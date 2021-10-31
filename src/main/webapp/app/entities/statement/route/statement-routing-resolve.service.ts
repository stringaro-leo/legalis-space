import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStatement, Statement } from '../statement.model';
import { StatementService } from '../service/statement.service';

@Injectable({ providedIn: 'root' })
export class StatementRoutingResolveService implements Resolve<IStatement> {
  constructor(protected service: StatementService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStatement> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((statement: HttpResponse<Statement>) => {
          if (statement.body) {
            return of(statement.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Statement());
  }
}
