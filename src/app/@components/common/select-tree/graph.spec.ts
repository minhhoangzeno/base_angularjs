import { async } from '@angular/core/testing';
import { SegmentFilter } from '../../../@core/interfaces/business/segment';
import { Graph, Setting, Vertex } from './graph';

describe('Graph', () => {
  const settings: Setting[] = [
    {
      type: 'category',
      key: 'category',
      outset: ['brand'],
    },
    {
      type: 'brand',
      key: 'category:brand',
      outset: ['id'],
    },
    {
      type: 'id',
      key: 'category:brand:id',
      title: 'name',
    },
  ];

  interface Product {
    id: string;
    name?: string;
    brand: string;
    category: string;
  }
  // C1 -> B1 -> P1,P2
  // C1 -> B2 -> P3,P4
  // C2 -> B1 -> P5,P6
  const SampleProducts: Product[] = [
    {
      category: 'C1',
      brand: 'B1',
      id: 'P1',
    },
    {
      category: 'C1',
      brand: 'B1',
      id: 'P2',
    },
    {
      category: 'C1',
      brand: 'B2',
      id: 'P3',
    },
    {
      category: 'C1',
      brand: 'B2',
      id: 'P4',
    },
    {
      category: 'C2',
      brand: 'B1',
      id: 'P5',
    },
    {
      category: 'C2',
      brand: 'B1',
      id: 'P6',
    },
  ];

  const graph = new Graph();
  graph.settings = settings;

  function getByKeys(keys: string[]) {
    const set = new Set<Vertex>();
    for (const k of keys) {
      set.add(graph.getByKey(k));
    }
    return set;
  }

  beforeEach(async(() => {
    // clean the graph
    graph.build([]);
  }));

  it('should populate vertex', async () => {
    const products: Product[] = [
      {
        id: 'P1',
        category: 'C1',
        brand: 'B1',
        name: 'Product 1',
      },
    ];
    graph.build(products);
    const categoryVertex: Vertex = graph.getByKey('C1');
    const brandVertex: Vertex = graph.getByKey('C1:B1');
    const idVertex: Vertex = graph.getByKey('C1:B1:P1');
    {
      const v = categoryVertex;
      await expect(v.type).toBe('category');
      await expect(v.expanded).toBeFalsy();
      await expect(v.indeterminate).toBeFalsy();
      await expect(v.matcher({ category: ['C1'] })).toBeTruthy();
      await expect(v.outsetTypes.size).toBe(1);
      await expect(v.outset).toEqual(new Set([brandVertex]));
      await expect(v.inset).toEqual(new Set());
      await expect(v.value).toBe('C1');
      await expect(v.key).toBe('C1');
    }
    {
      const v = brandVertex;
      await expect(v.type).toBe('brand');
      await expect(v.expanded).toBeFalsy();
      await expect(v.indeterminate).toBeFalsy();
      await expect(v.matcher({ category: ['C1'], brand: ['B1'] })).toBeTruthy();
      await expect(v.outsetTypes.size).toBe(1);
      await expect(v.outset).toEqual(new Set([idVertex]));
      await expect(v.inset).toEqual(new Set([categoryVertex]));
      await expect(v.value).toBe('B1');
      await expect(v.key).toBe('C1:B1');
    }
    {
      const v = idVertex;
      await expect(v.type).toBe('id');
      await expect(v.expanded).toBeFalsy();
      await expect(v.indeterminate).toBeFalsy();
      await expect(v.matcher({ category: ['C1'], brand: ['B1'], id: ['P1'] })).toBeTruthy();
      await expect(v.matcher({ category: ['C1'], brand: ['B1'], id: ['P2'] })).toBeFalsy();
      await expect(v.outsetTypes.size).toBe(0);
      await expect(v.outset).toEqual(new Set());
      await expect(v.inset).toEqual(new Set([brandVertex]));
      await expect(v.title).toBe('Product 1');
      await expect(v.value).toBe('P1');
      await expect(v.key).toBe('C1:B1:P1');
    }
  });

  it('should compact', async () => {
    graph.build(SampleProducts);
    // await expect all vertices are created
    await expect(graph.getByType('category')).toEqual(getByKeys(['C1', 'C2']));
    await expect(graph.getByType('brand')).toEqual(getByKeys(['C1:B1', 'C1:B2', 'C2:B1']));
    await expect(graph.getByType('id')).toEqual(
      getByKeys(['C1:B1:P1', 'C1:B1:P2', 'C1:B2:P3', 'C1:B2:P4', 'C2:B1:P5', 'C2:B1:P6']),
    );
    /*
     * CASE 1:
     * select C1:B1 -> P1, P2
     * await expect C1 is indeterminate
     * await expect C2:B1 unchanged
     */
    {
      graph.getByKey('C1:B1').updateSelect(true);
      await expect(graph.getByKey('C1:B1').selected).toBeTruthy();
      await expect(graph.getByKey('C1:B1').indeterminate).toBeFalsy();
      await expect(graph.getByKey('C1:B1:P1').selected).toBeTruthy();
      await expect(graph.getByKey('C1:B1:P1').indeterminate).toBeFalsy();
      await expect(graph.getByKey('C1:B1:P2').selected).toBeTruthy();
      await expect(graph.getByKey('C1:B1:P2').indeterminate).toBeFalsy();
      await expect(graph.getByKey('C1').selected).toBeFalsy();
      await expect(graph.getByKey('C1').indeterminate).toBeTruthy();
      await expect(graph.getByKey('C2:B1').selected).toBeFalsy();
      await expect(graph.getByKey('C2:B1').indeterminate).toBeFalsy();
      const filters = graph.compact(graph.getEntries());
      await expect(filters).toEqual([{ category: ['C1'], brand: ['B1'] }]);
    }

    /*
     * CASE 2:
     * given selected C1:B1
     * select C2:B1 -> P5, P6
     * await expect C2 is selected
     */
    {
      graph.getByKey('C2:B1').updateSelect(true);
      await expect(graph.getByKey('C2:B1').selected).toBeTruthy();
      await expect(graph.getByKey('C2:B1:P5').selected).toBeTruthy();
      await expect(graph.getByKey('C2:B1:P6').selected).toBeTruthy();
      await expect(graph.getByKey('C2').selected).toBeTruthy();
      const filters = graph.compact();
      await expect(filters).toEqual([{ category: ['C1'], brand: ['B1'] }, { category: ['C2'] }]);
    }

    /*
     * CASE 3:
     * unselect C1:B1
     * await expect C2 is unselected
     */
    {
      graph.getByKey('C2:B1').updateSelect(false);
      await expect(graph.getByKey('C2:B1').selected).toBeFalsy();
      await expect(graph.getByKey('C2:B1:P5').selected).toBeFalsy();
      await expect(graph.getByKey('C2:B1:P6').selected).toBeFalsy();
      await expect(graph.getByKey('C2').selected).toBeFalsy();
      const filters = graph.compact();
      await expect(filters).toEqual([{ category: ['C1'], brand: ['B1'] }]);
    }
  });

  it('should apply filter', async () => {
    graph.build(SampleProducts);
    {
      // C1:B1
      const filters: SegmentFilter[] = [{ category: ['C1'], brand: ['B1'] }];
      graph.applyFilters(filters);
      await expect(graph.getByKey('C1:B1').selected).toBeTruthy();
      await expect(graph.getByKey('C1:B1').indeterminate).toBeFalsy();
      await expect(graph.getByKey('C1:B1:P1').selected).toBeTruthy();
      await expect(graph.getByKey('C1:B1:P1').indeterminate).toBeFalsy();
      await expect(graph.getByKey('C1:B1:P2').selected).toBeTruthy();
      await expect(graph.getByKey('C1:B1:P2').indeterminate).toBeFalsy();
      await expect(graph.getByKey('C1').selected).toBeFalsy();
      await expect(graph.getByKey('C1').indeterminate).toBeTruthy();
      await expect(graph.getByKey('C2:B1').selected).toBeFalsy();
      await expect(graph.getByKey('C2:B1').indeterminate).toBeFalsy();
    }
    {
      // C1:B1 and C2
      const filters: SegmentFilter[] = [{ category: ['C1'], brand: ['B1'] }, { category: ['C2'] }];
      graph.applyFilters(filters);
      await expect(graph.getByKey('C1:B1').selected).toBeTruthy();
      await expect(graph.getByKey('C2:B1').selected).toBeTruthy();
      await expect(graph.getByKey('C2:B1:P5').selected).toBeTruthy();
      await expect(graph.getByKey('C2:B1:P6').selected).toBeTruthy();
      await expect(graph.getByKey('C2').selected).toBeTruthy();
    }
    {
      // no filters
      const filters: SegmentFilter[] = [];
      graph.applyFilters(filters);
      await expect(graph.getByKey('C1').selected).toBeTruthy();
      await expect(graph.getByKey('C2').selected).toBeTruthy();
      await expect(graph.compact()).toEqual([]);
    }
    {
      // unknown filters
      const filters: SegmentFilter[] = [{ foo: ['1'] }];
      graph.applyFilters(filters);
      await expect(graph.getByKey('C1').selected).toBeFalsy();
      await expect(graph.getByKey('C2').selected).toBeFalsy();
      await expect(graph.compact()).toEqual([]);
    }
  });
});
