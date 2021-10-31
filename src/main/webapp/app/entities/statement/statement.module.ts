import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { StatementComponent } from './list/statement.component';
import { StatementDetailComponent } from './detail/statement-detail.component';
import { StatementUpdateComponent } from './update/statement-update.component';
import { StatementDeleteDialogComponent } from './delete/statement-delete-dialog.component';
import { StatementRoutingModule } from './route/statement-routing.module';

@NgModule({
  imports: [SharedModule, StatementRoutingModule],
  declarations: [StatementComponent, StatementDetailComponent, StatementUpdateComponent, StatementDeleteDialogComponent],
  entryComponents: [StatementDeleteDialogComponent],
})
export class StatementModule {}
