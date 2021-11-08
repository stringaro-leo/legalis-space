import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TranslationComponent } from './list/translation.component';
import { TranslationDetailComponent } from './detail/translation-detail.component';
import { TranslationUpdateComponent } from './update/translation-update.component';
import { TranslationDeleteDialogComponent } from './delete/translation-delete-dialog.component';
import { TranslationRoutingModule } from './route/translation-routing.module';
import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  imports: [SharedModule, TranslationRoutingModule, NgxEditorModule],
  declarations: [TranslationComponent, TranslationDetailComponent, TranslationUpdateComponent, TranslationDeleteDialogComponent],
  entryComponents: [TranslationDeleteDialogComponent],
})
export class TranslationModule {}
