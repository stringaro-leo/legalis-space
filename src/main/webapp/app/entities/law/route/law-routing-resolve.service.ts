import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILaw, Law } from '../law.model';
import { LawService } from '../service/law.service';

@Injectable({ providedIn: 'root' })
export class LawRoutingResolveService implements Resolve<ILaw> {
  constructor(protected service: LawService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILaw> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((law: HttpResponse<Law>) => {
          if (law.body) {
            return of(law.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Law());
  }
}
