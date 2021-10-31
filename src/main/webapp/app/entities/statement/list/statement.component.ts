import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IStatement } from '../statement.model';
import { StatementService } from '../service/statement.service';
import { StatementDeleteDialogComponent } from '../delete/statement-delete-dialog.component';

@Component({
  selector: 'jhi-statement',
  templateUrl: './statement.component.html',
})
export class StatementComponent implements OnInit {
  statements?: IStatement[];
  isLoading = false;

  constructor(protected statementService: StatementService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.statementService.query().subscribe(
      (res: HttpResponse<IStatement[]>) => {
        this.isLoading = false;
        this.statements = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IStatement): string {
    return item.id!;
  }

  delete(statement: IStatement): void {
    const modalRef = this.modalService.open(StatementDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.statement = statement;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
