import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TreatyComponent } from '../list/treaty.component';
import { TreatyDetailComponent } from '../detail/treaty-detail.component';
import { TreatyUpdateComponent } from '../update/treaty-update.component';
import { TreatyRoutingResolveService } from './treaty-routing-resolve.service';

const treatyRoute: Routes = [
  {
    path: '',
    component: TreatyComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TreatyDetailComponent,
    resolve: {
      treaty: TreatyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TreatyUpdateComponent,
    resolve: {
      treaty: TreatyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TreatyUpdateComponent,
    resolve: {
      treaty: TreatyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(treatyRoute)],
  exports: [RouterModule],
})
export class TreatyRoutingModule {}
