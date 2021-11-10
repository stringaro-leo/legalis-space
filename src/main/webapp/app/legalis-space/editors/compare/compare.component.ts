import { Component, OnInit } from '@angular/core';
import { ILaw } from '../../../entities/law/law.model';
import { LawService } from '../../../entities/law/service/law.service';
import { TranslationService } from '../../../entities/translation/service/translation.service';
import { HttpResponse } from '@angular/common/http';
import { ITranslation } from '../../../entities/translation/translation.model';
import { TranslationExtendedService } from '../../../entities/translation/service/extended/translation-extended.service';
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'jhi-compare',
  templateUrl: './compare.component.html',
})
export class CompareComponent implements OnInit {
  isLoading = false;

  lawLeft: ILaw | null = null;
  lawRight: ILaw | null = null;
  laws?: ILaw[];

  message?: string;

  translationLeft?: ITranslation | null = null;
  translationRight?: ITranslation | null = null;
  translations?: ITranslation[];

  editorConfig: any = {
    editable: true,
    spellcheck: false,
    height: '5rem',
    minHeight: '2rem',
    placeholder: 'Enter text here...',
    translate: 'no',
  };
  editorLeft: any = new Editor();
  editorRight: any = new Editor();
  editorsToolbarConfig: Toolbar = [
    // default value
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(protected lawService: LawService, protected translationService: TranslationService) {}

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
  /*
  loadTranslations(id = ''): void {
    this.isLoading = true;

    this.translationExtendedService.searchTranslationsByTypeAndTypeId({ type: 'law', typeId: id }).subscribe(
      (res: HttpResponse<ITranslation[]>) => {
        this.isLoading = false;
        this.contents = [];
        this.translations = res.body ?? [];
        this.translations.forEach(translation => {
          const languageCode = translation.language?.code ?? '';
          this.contents.push({
            editor: new Editor(),
            translation,
            code: languageCode,
            display: false,
          });
        }, this);
      },
      () => {
        this.isLoading = false;
      }
    );
  }
   */

  onLawLeftChange(selectedLaw: ILaw | null): void {
    this.lawLeft = selectedLaw;
    this.translationLeft = null;
  }

  onLawRightChange(selectedLaw: ILaw | null): void {
    this.lawRight = selectedLaw;
    this.translationRight = null;
  }

  onTranslationLeftChange(selectedTranslation: ITranslation | null | undefined): void {
    this.translationLeft = selectedTranslation;
  }

  onTranslationRightChange(selectedTranslation: ITranslation | null | undefined): void {
    this.translationRight = selectedTranslation;
  }

  ngOnInit(): void {
    this.message = 'Compare Laws';
    this.loadAll();
  }
}
