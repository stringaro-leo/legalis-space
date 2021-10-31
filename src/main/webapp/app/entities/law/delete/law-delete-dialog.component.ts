import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILaw } from '../law.model';
import { LawService } from '../service/law.service';

@Component({
  templateUrl: './law-delete-dialog.component.html',
})
export class LawDeleteDialogComponent {
  law?: ILaw;

  constructor(protected lawService: LawService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.lawService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
