import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { CompareRoutingModule } from './compare-routing.module';
import { CompareComponent } from './compare.component';
import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  imports: [SharedModule, CompareRoutingModule, NgxEditorModule],
  declarations: [CompareComponent],
})
export class CompareModule {}
