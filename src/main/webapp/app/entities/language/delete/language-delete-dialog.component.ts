import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILanguage } from '../language.model';
import { LanguageService } from '../service/language.service';

@Component({
  templateUrl: './language-delete-dialog.component.html',
})
export class LanguageDeleteDialogComponent {
  language?: ILanguage;

  constructor(protected languageService: LanguageService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.languageService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
