import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { CompareRoutingModule } from './compare-routing.module';
import { CompareComponent } from './compare.component';
import { FroalaEditorModule } from 'angular-froala-wysiwyg';

@NgModule({
  imports: [SharedModule, CompareRoutingModule, FroalaEditorModule],
  declarations: [CompareComponent],
})
export class CompareModule {}
