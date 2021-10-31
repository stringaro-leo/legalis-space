import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILaw } from '../law.model';
import { LawService } from '../service/law.service';
import { LawDeleteDialogComponent } from '../delete/law-delete-dialog.component';

@Component({
  selector: 'jhi-law',
  templateUrl: './law.component.html',
})
export class LawComponent implements OnInit {
  laws?: ILaw[];
  isLoading = false;

  constructor(protected lawService: LawService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.lawService.query().subscribe(
      (res: HttpResponse<ILaw[]>) => {
        this.isLoading = false;
        this.laws = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ILaw): string {
    return item.id!;
  }

  delete(law: ILaw): void {
    const modalRef = this.modalService.open(LawDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.law = law;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
