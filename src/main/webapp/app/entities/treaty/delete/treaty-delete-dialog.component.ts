import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITreaty } from '../treaty.model';
import { TreatyService } from '../service/treaty.service';

@Component({
  templateUrl: './treaty-delete-dialog.component.html',
})
export class TreatyDeleteDialogComponent {
  treaty?: ITreaty;

  constructor(protected treatyService: TreatyService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.treatyService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
