import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITranslation } from '../translation.model';
import { TranslationService } from '../service/translation.service';
import { TranslationDeleteDialogComponent } from '../delete/translation-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-translation',
  templateUrl: './translation.component.html',
})
export class TranslationComponent implements OnInit {
  translations?: ITranslation[];
  isLoading = false;

  constructor(protected translationService: TranslationService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.translationService.query().subscribe(
      (res: HttpResponse<ITranslation[]>) => {
        this.isLoading = false;
        this.translations = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITranslation): string {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(translation: ITranslation): void {
    const modalRef = this.modalService.open(TranslationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.translation = translation;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
