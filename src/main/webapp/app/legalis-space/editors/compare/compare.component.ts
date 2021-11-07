import { Component, OnInit, OnDestroy } from '@angular/core';
import { ILaw } from '../../../entities/law/law.model';
import { LawService } from '../../../entities/law/service/law.service';
import { TranslationService } from '../../../entities/translation/service/translation.service';
import { HttpResponse } from '@angular/common/http';
import { ITranslation } from '../../../entities/translation/translation.model';
import { TranslationExtendedService } from '../../../entities/translation/service/extended/translation-extended.service';

@Component({
  selector: 'jhi-compare',
  templateUrl: './compare.component.html',
})
export class CompareComponent implements OnDestroy, OnInit {
  isLoading = false;
  law: ILaw | null = null;
  laws?: ILaw[];
  translations?: ITranslation[];
  message?: string;
  options?: any = {};

  constructor(
    protected lawService: LawService,
    protected translationExtendedService: TranslationExtendedService,
    protected translationService: TranslationService
  ) {}

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
  loadTranslations(id = ''): void {
    this.isLoading = true;

    this.translationExtendedService.searchTranslationsByTypeAndTypeId({ type: 'law', typeId: id }).subscribe(
      (res: HttpResponse<ITranslation[]>) => {
        console.warn(res);
        this.isLoading = false;
        this.translations = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }
  onLawChange(law: ILaw | null): void {
    console.warn('ONCHANGES', law);
    this.loadTranslations(law?.id);
  }

  ngOnInit(): void {
    this.loadAll();
    this.message = 'Compare translations';
    this.options = {
      placeholderText: 'Edit Your Content Here!!!',
      charCounterCount: false,
    };
    console.warn('CompareComponent Init !!!!!!');
    console.warn(this.options);
  }

  ngOnDestroy(): void {
    this.message = 'bye';
    console.warn('CompareComponent Destroy !!!!!!');
  }
}
