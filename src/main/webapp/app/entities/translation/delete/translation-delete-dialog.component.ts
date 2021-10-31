import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITranslation } from '../translation.model';
import { TranslationService } from '../service/translation.service';

@Component({
  templateUrl: './translation-delete-dialog.component.html',
})
export class TranslationDeleteDialogComponent {
  translation?: ITranslation;

  constructor(protected translationService: TranslationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.translationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
