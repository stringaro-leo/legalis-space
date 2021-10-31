import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IStatement } from '../statement.model';
import { StatementService } from '../service/statement.service';

@Component({
  templateUrl: './statement-delete-dialog.component.html',
})
export class StatementDeleteDialogComponent {
  statement?: IStatement;

  constructor(protected statementService: StatementService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.statementService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
