import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LawComponent } from '../list/law.component';
import { LawDetailComponent } from '../detail/law-detail.component';
import { LawUpdateComponent } from '../update/law-update.component';
import { LawRoutingResolveService } from './law-routing-resolve.service';

const lawRoute: Routes = [
  {
    path: '',
    component: LawComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LawDetailComponent,
    resolve: {
      law: LawRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LawUpdateComponent,
    resolve: {
      law: LawRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LawUpdateComponent,
    resolve: {
      law: LawRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(lawRoute)],
  exports: [RouterModule],
})
export class LawRoutingModule {}
