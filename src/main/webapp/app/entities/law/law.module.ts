import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LawComponent } from './list/law.component';
import { LawDetailComponent } from './detail/law-detail.component';
import { LawUpdateComponent } from './update/law-update.component';
import { LawDeleteDialogComponent } from './delete/law-delete-dialog.component';
import { LawRoutingModule } from './route/law-routing.module';

@NgModule({
  imports: [SharedModule, LawRoutingModule],
  declarations: [LawComponent, LawDetailComponent, LawUpdateComponent, LawDeleteDialogComponent],
  entryComponents: [LawDeleteDialogComponent],
})
export class LawModule {}
