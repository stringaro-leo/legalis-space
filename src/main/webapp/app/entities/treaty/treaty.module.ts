import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TreatyComponent } from './list/treaty.component';
import { TreatyDetailComponent } from './detail/treaty-detail.component';
import { TreatyUpdateComponent } from './update/treaty-update.component';
import { TreatyDeleteDialogComponent } from './delete/treaty-delete-dialog.component';
import { TreatyRoutingModule } from './route/treaty-routing.module';

@NgModule({
  imports: [SharedModule, TreatyRoutingModule],
  declarations: [TreatyComponent, TreatyDetailComponent, TreatyUpdateComponent, TreatyDeleteDialogComponent],
  entryComponents: [TreatyDeleteDialogComponent],
})
export class TreatyModule {}
