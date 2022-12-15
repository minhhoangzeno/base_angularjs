export interface Filter {
  [key: string]: string[];
}

export interface Setting {
  title?: string;
  type: string;
  key?: string;
  outset?: string[];
}

export class Vertex {
  constructor(
    public type: string,
    public value: string,
    public key: string,
    public matcher: (f: Filter) => boolean,
  ) { }

  title = '';
  // outgoing vertices
  outsetTypes = new Set<string>();
  outset = new Set<Vertex>();
  // incoming vertices
  inset = new Set<Vertex>();
  expanded = false;
  selected = false;
  indeterminate = false;

  get expandable() {
    return this.outset.size > 0;
  }

  updateSelect(selected: boolean) {
    if (this.selected !== selected || this.indeterminate) {
      this.selected = selected;
      this.indeterminate = false;
      this.updateOutset();
      this.updateInset();
    }

  }

  private updateOutset() {
    for (const u of this.outset) {
      u.selected = this.selected;
      // if user click updateOutset, indeterminate also update
      u.indeterminate = this.indeterminate;
      u.updateOutset();
    }
  }

  private check() {
    let selected = 0;
    let indeterminate = 0;
    for (const u of this.outset) {
      if (u.selected) {
        selected++;
      } else if (u.indeterminate) {
        indeterminate++;
      }
    }

    if (selected === this.outset.size) {
      this.selected = true;
      this.indeterminate = false;
    } else if (selected > 0 || indeterminate > 0) {
      this.indeterminate = true;
      this.selected = false;
    } else {
      this.selected = false;
      this.indeterminate = false;
    }
  }

  private updateInset() {
    for (const u of this.inset) {
      u.check();
      u.updateInset();
    }
  }

  connect(u: Vertex) {
    if (this.outsetTypes.has(u.type)) {
      this.outset.add(u);
      u.inset.add(this);
    }
  }

  applyFilters(filters: Filter[]) {
    for (const f of filters) {
      if (this.matcher(f)) {
        this.updateSelect(true);
        return;
      }
    }
    this.updateSelect(false);
    for (const u of this.outset) {
      u.applyFilters(filters);
    }
  }
}

function GroupBy<T>(set: Set<T>, field: string) {
  const map = new Map<string, Set<T>>();
  for (const v of set) {
    const k = v[field];
    if (!map.has(k)) {
      map.set(k, new Set());
    }
    map.get(k)?.add(v);
  }
  return map;
}

export class Graph {
  settings: Setting[] = [];
  private readonly lookup = new Map<string, Vertex>();

  private buildVertices(p: any) {
    const vertices: Vertex[] = [];
    for (const s of this.settings) {
      const keyFields = (s.key || '').split(':');
      const obj = {};
      const keys: string[] = [];
      for (const k of keyFields) {
        keys.push(p[k]);
        obj[k] = p[k];
      }
      const matcher = (f: Filter) => {
        // for every key in the filter
        // p[key] must be in filter[key]
        for (const k in f) {
          const v = obj[k];
          if (!v) {
            return false;
          }
          const s = f[k];
          if (!s.includes(v)) {
            return false;
          }
        }
        return true;
      };
      const key = keys.filter((k) => k).join(':');
      const v = new Vertex(s.type, p[s.type], key, matcher);
      v.title = p[s.title || s.type];
      v.outsetTypes = new Set(s.outset);
      vertices.push(v);
    }
    return vertices;
  }

  private connectAll(keys: string[]) {
    for (const k1 of keys) {
      for (const k2 of keys) {
        if (k1 == k2) {
          continue;
        }
        const v = this.lookup.get(k1);
        const u = this.lookup.get(k2);
        if (v && u) {
          v.connect(u);
          u.connect(v);
        }
      }
    }
  }

  getNeighbour(v: Vertex) {
    return [...v.outset];
  }

  getByType(type: string) {
    const vertices = new Set<Vertex>();
    for (const v of this.lookup.values()) {
      if (v.type === type) {
        vertices.add(v);
      }
    }
    return vertices;
  }

  getByKey(key: string) {
    return this.lookup.get(key);
  }

  getEntries() {
    return this.getByType(this.settings[0]?.type);
  }

  build(data: any[]) {
    for (const p of data) {
      const vertices = this.buildVertices(p);
      for (const v of vertices) {
        // compare v.value and null. If null it will be not display
        if (!this.lookup.has(v.key) && v.value !== null) {
          this.lookup.set(v.key, v);
        }
      }
      const keys = vertices.map((v) => v.key);
      this.connectAll(keys);
    }
  }

  // compactSelected pick only selected vertices
  // and put them into an array
  private compactSelected(vertices: Set<Vertex>) {
    // Group vertices by type
    // type=id;set=P1,P2,P3
    // type=brands;set=B1,B2,B3
    // type=category;set=C1,C2,C3
    const map = GroupBy(vertices, 'type');
    const filters: Filter[] = [];
    for (const [type, set] of map.entries()) {
      const values = [...set.values()].map((v) => v.value);
      filters.push({ [type]: values });
    }
    return filters;
  }

  // compact the vertices
  // selected vertices -> include them all
  // indeterminate vertices -> add extra filter
  // if all vertices are select,
  // the filter is empty
  compact(vertices?: Set<Vertex>) {
    if (!vertices) {
      vertices = this.getEntries();
    }
    const selected = new Set<Vertex>();
    const filters: Filter[] = [];
    for (const v of vertices) {
      if (v.selected) {
        selected.add(v);
      } else if (v.indeterminate) {
        // travel all outgoing vertices
        const subfilters = this.compact(v.outset);
        for (const f of subfilters) {
          // remember to add the extra filter
          // [v.type]: [v.value]
          filters.push({ [v.type]: [v.value], ...f });
        }
      }
    }
    if (selected.size === vertices.size) {
      // select all
      return [];
    }
    // get other selected vertices
    filters.push(...this.compactSelected(selected));
    return filters;
  }

  applyFilters(filters: Filter[] = []) {
    const entries = this.getEntries();
    if (filters.length < 1) {
      // select all
      for (const e of entries) {
        e.updateSelect(true);
      }
    } else {
      for (const e of entries) {
        e.applyFilters(filters);
      }
    }
  }
}
