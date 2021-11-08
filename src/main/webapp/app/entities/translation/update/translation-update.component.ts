import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITranslation, Translation } from '../translation.model';
import { TranslationService } from '../service/translation.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ILanguage } from 'app/entities/language/language.model';
import { LanguageService } from 'app/entities/language/service/language.service';
import { ILaw } from 'app/entities/law/law.model';
import { LawService } from 'app/entities/law/service/law.service';
import { ITreaty } from 'app/entities/treaty/treaty.model';
import { TreatyService } from 'app/entities/treaty/service/treaty.service';
import { Editor, toDoc } from 'ngx-editor';

@Component({
  selector: 'jhi-translation-update',
  templateUrl: './translation-update.component.html',
})
export class TranslationUpdateComponent implements OnInit {
  isSaving = false;

  languagesCollection: ILanguage[] = [];
  lawsSharedCollection: ILaw[] = [];
  treatiesSharedCollection: ITreaty[] = [];

  editForm = this.fb.group({
    id: [],
    note: [],
    author: [],
    source: [],
    official: [],
    content: [],
    language: [],
    law: [],
    treaty: [],
  });

  editorWysiwyg: any = {};

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected translationService: TranslationService,
    protected languageService: LanguageService,
    protected lawService: LawService,
    protected treatyService: TreatyService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ translation }) => {
      this.updateForm(translation);

      this.loadRelationshipsOptions();

      this.editorWysiwyg = new Editor();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('legalisSpaceApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const translation = this.createFromForm();
    if (translation.id !== undefined) {
      this.subscribeToSaveResponse(this.translationService.update(translation));
    } else {
      this.subscribeToSaveResponse(this.translationService.create(translation));
    }
  }

  trackLanguageById(index: number, item: ILanguage): string {
    return item.id!;
  }

  trackLawById(index: number, item: ILaw): string {
    return item.id!;
  }

  trackTreatyById(index: number, item: ITreaty): string {
    return item.id!;
  }

  checkContent(content: any): void {
    const jsonDoc = toDoc(content);
    console.warn('check:', jsonDoc);
  }

  fillContent(content: string): void {
    this.editForm.patchValue({
      content,
    });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITranslation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(translation: ITranslation): void {
    this.editForm.patchValue({
      id: translation.id,
      note: translation.note,
      author: translation.author,
      source: translation.source,
      official: translation.official,
      content: translation.content,
      language: translation.language,
      law: translation.law,
      treaty: translation.treaty,
    });

    this.languagesCollection = this.languageService.addLanguageToCollectionIfMissing(this.languagesCollection, translation.language);
    this.lawsSharedCollection = this.lawService.addLawToCollectionIfMissing(this.lawsSharedCollection, translation.law);
    this.treatiesSharedCollection = this.treatyService.addTreatyToCollectionIfMissing(this.treatiesSharedCollection, translation.treaty);
  }

  protected loadRelationshipsOptions(): void {
    this.languageService
      .query({ filter: 'translation-is-null' })
      .pipe(map((res: HttpResponse<ILanguage[]>) => res.body ?? []))
      .pipe(
        map((languages: ILanguage[]) =>
          this.languageService.addLanguageToCollectionIfMissing(languages, this.editForm.get('language')!.value)
        )
      )
      .subscribe((languages: ILanguage[]) => (this.languagesCollection = languages));

    this.lawService
      .query()
      .pipe(map((res: HttpResponse<ILaw[]>) => res.body ?? []))
      .pipe(map((laws: ILaw[]) => this.lawService.addLawToCollectionIfMissing(laws, this.editForm.get('law')!.value)))
      .subscribe((laws: ILaw[]) => (this.lawsSharedCollection = laws));

    this.treatyService
      .query()
      .pipe(map((res: HttpResponse<ITreaty[]>) => res.body ?? []))
      .pipe(map((treaties: ITreaty[]) => this.treatyService.addTreatyToCollectionIfMissing(treaties, this.editForm.get('treaty')!.value)))
      .subscribe((treaties: ITreaty[]) => (this.treatiesSharedCollection = treaties));
  }

  protected createFromForm(): ITranslation {
    return {
      ...new Translation(),
      id: this.editForm.get(['id'])!.value,
      note: this.editForm.get(['note'])!.value,
      author: this.editForm.get(['author'])!.value,
      source: this.editForm.get(['source'])!.value,
      official: this.editForm.get(['official'])!.value,
      content: this.editForm.get(['content'])!.value,
      language: this.editForm.get(['language'])!.value,
      law: this.editForm.get(['law'])!.value,
      treaty: this.editForm.get(['treaty'])!.value,
    };
  }
}
