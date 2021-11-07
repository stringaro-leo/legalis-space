import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CompareComponent } from './compare.component';

const CompareRoute: Routes = [
  {
    path: '',
    component: CompareComponent,
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(CompareRoute)],
  exports: [RouterModule],
})
export class CompareRoutingModule {}
