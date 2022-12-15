import { Injectable } from '@angular/core';
import { DefaultHttpUrlGenerator, HttpResourceUrls, normalizeRoot } from '@ngrx/data';

@Injectable()
export class EntityUrlGenerator extends DefaultHttpUrlGenerator {
  /** Override to make sure all generated URLs aren't pluralized from entity name. */
  protected getResourceUrls(name: string, root: string): HttpResourceUrls {
    let resourceUrls = this.knownHttpResourceUrls[name];
    if (!resourceUrls) {
      const url = `${normalizeRoot(root)}/${name}/`.toLowerCase();
      resourceUrls = {
        entityResourceUrl: url,
        collectionResourceUrl: url,
      };
      this.registerHttpResourceUrls({ [name]: resourceUrls });
    }
    return resourceUrls;
  }
}
