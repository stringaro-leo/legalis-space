import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITreaty } from '../treaty.model';
import { TreatyService } from '../service/treaty.service';
import { TreatyDeleteDialogComponent } from '../delete/treaty-delete-dialog.component';

@Component({
  selector: 'jhi-treaty',
  templateUrl: './treaty.component.html',
})
export class TreatyComponent implements OnInit {
  treaties?: ITreaty[];
  isLoading = false;

  constructor(protected treatyService: TreatyService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.treatyService.query().subscribe(
      (res: HttpResponse<ITreaty[]>) => {
        this.isLoading = false;
        this.treaties = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITreaty): string {
    return item.id!;
  }

  delete(treaty: ITreaty): void {
    const modalRef = this.modalService.open(TreatyDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.treaty = treaty;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
