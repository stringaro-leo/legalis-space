import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StatementComponent } from '../list/statement.component';
import { StatementDetailComponent } from '../detail/statement-detail.component';
import { StatementUpdateComponent } from '../update/statement-update.component';
import { StatementRoutingResolveService } from './statement-routing-resolve.service';

const statementRoute: Routes = [
  {
    path: '',
    component: StatementComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StatementDetailComponent,
    resolve: {
      statement: StatementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StatementUpdateComponent,
    resolve: {
      statement: StatementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StatementUpdateComponent,
    resolve: {
      statement: StatementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(statementRoute)],
  exports: [RouterModule],
})
export class StatementRoutingModule {}
