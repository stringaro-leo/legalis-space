import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'editors/compare',
        data: { pageTitle: 'legalisSpaceApp.editors.compare.home.title' },
        loadChildren: () => import('./editors/compare/compare.module').then(m => m.CompareModule),
      },
    ]),
  ],
})
export class LegalisSpaceRoutingModule {}
