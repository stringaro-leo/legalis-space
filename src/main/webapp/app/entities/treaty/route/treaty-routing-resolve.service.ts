import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITreaty, Treaty } from '../treaty.model';
import { TreatyService } from '../service/treaty.service';

@Injectable({ providedIn: 'root' })
export class TreatyRoutingResolveService implements Resolve<ITreaty> {
  constructor(protected service: TreatyService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITreaty> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((treaty: HttpResponse<Treaty>) => {
          if (treaty.body) {
            return of(treaty.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Treaty());
  }
}
