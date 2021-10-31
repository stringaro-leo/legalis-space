import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITreaty, Treaty } from '../treaty.model';
import { TreatyService } from '../service/treaty.service';
import { ILaw } from 'app/entities/law/law.model';
import { LawService } from 'app/entities/law/service/law.service';

@Component({
  selector: 'jhi-treaty-update',
  templateUrl: './treaty-update.component.html',
})
export class TreatyUpdateComponent implements OnInit {
  isSaving = false;

  lawsSharedCollection: ILaw[] = [];

  editForm = this.fb.group({
    id: [],
    description: [],
    name: [],
    voteDate: [],
    effectiveDate: [],
    law: [],
  });

  constructor(
    protected treatyService: TreatyService,
    protected lawService: LawService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ treaty }) => {
      this.updateForm(treaty);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const treaty = this.createFromForm();
    if (treaty.id !== undefined) {
      this.subscribeToSaveResponse(this.treatyService.update(treaty));
    } else {
      this.subscribeToSaveResponse(this.treatyService.create(treaty));
    }
  }

  trackLawById(index: number, item: ILaw): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITreaty>>): void {
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

  protected updateForm(treaty: ITreaty): void {
    this.editForm.patchValue({
      id: treaty.id,
      description: treaty.description,
      name: treaty.name,
      voteDate: treaty.voteDate,
      effectiveDate: treaty.effectiveDate,
      law: treaty.law,
    });

    this.lawsSharedCollection = this.lawService.addLawToCollectionIfMissing(this.lawsSharedCollection, treaty.law);
  }

  protected loadRelationshipsOptions(): void {
    this.lawService
      .query()
      .pipe(map((res: HttpResponse<ILaw[]>) => res.body ?? []))
      .pipe(map((laws: ILaw[]) => this.lawService.addLawToCollectionIfMissing(laws, this.editForm.get('law')!.value)))
      .subscribe((laws: ILaw[]) => (this.lawsSharedCollection = laws));
  }

  protected createFromForm(): ITreaty {
    return {
      ...new Treaty(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      name: this.editForm.get(['name'])!.value,
      voteDate: this.editForm.get(['voteDate'])!.value,
      effectiveDate: this.editForm.get(['effectiveDate'])!.value,
      law: this.editForm.get(['law'])!.value,
    };
  }
}
