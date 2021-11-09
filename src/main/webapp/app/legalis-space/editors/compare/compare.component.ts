import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class CompareComponent implements OnDestroy, OnInit {
  isLoading = false;
  checked = false;
  law: ILaw | null = null;
  laws?: ILaw[];
  translations?: ITranslation[];
  message?: string;
  toolbar: Toolbar = [
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
  colorPresets: any = ['red', '#FF0000', 'rgb(255, 0, 0)'];
  contents: any = [];

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

  toggleVisibility(index: number): void {
    //    for (let _i = 0; _i < this.contents.length; _i++) {
    //      if (this.contents[_i].code === code) {
    //        console.warn(code + " found.")
    //        this.contents[_i].display = !this.contents[_i].display;
    //      }
    //    }
    this.contents[index].display = !this.contents[index].display;
    console.warn(this.contents[index]);
  }

  onLawChange(law: ILaw | null): void {
    console.warn('ONCHANGES', law);
    this.loadTranslations(law?.id);
  }

  /*
  onCheckTranslation(value: any): void {
    console.warn('onCheckTranslation', value);
  }
          <input type="checkbox"
                 name="string"
                 ng-true-value="OK"
                 ng-false-value="KO"
                 [(ngModel)]="translation"
                 ng-change="onCheckTranslation($event)">
   */

  ngOnInit(): void {
    this.loadAll();
  }

  ngOnDestroy(): void {
    this.message = 'bye';
  }
}
