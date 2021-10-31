import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILaw, Law } from '../law.model';
import { LawService } from '../service/law.service';
import { ICountry } from 'app/entities/country/country.model';
import { CountryService } from 'app/entities/country/service/country.service';

@Component({
  selector: 'jhi-law-update',
  templateUrl: './law-update.component.html',
})
export class LawUpdateComponent implements OnInit {
  isSaving = false;

  lawsSharedCollection: ILaw[] = [];
  countriesSharedCollection: ICountry[] = [];

  editForm = this.fb.group({
    id: [],
    description: [],
    name: [],
    publicationDate: [],
    effectiveDate: [],
    country: [],
    ref: [],
  });

  constructor(
    protected lawService: LawService,
    protected countryService: CountryService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ law }) => {
      this.updateForm(law);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const law = this.createFromForm();
    if (law.id !== undefined) {
      this.subscribeToSaveResponse(this.lawService.update(law));
    } else {
      this.subscribeToSaveResponse(this.lawService.create(law));
    }
  }

  trackLawById(index: number, item: ILaw): string {
    return item.id!;
  }

  trackCountryById(index: number, item: ICountry): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILaw>>): void {
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

  protected updateForm(law: ILaw): void {
    this.editForm.patchValue({
      id: law.id,
      description: law.description,
      name: law.name,
      publicationDate: law.publicationDate,
      effectiveDate: law.effectiveDate,
      country: law.country,
      ref: law.ref,
    });

    this.lawsSharedCollection = this.lawService.addLawToCollectionIfMissing(this.lawsSharedCollection, law.ref);
    this.countriesSharedCollection = this.countryService.addCountryToCollectionIfMissing(this.countriesSharedCollection, law.country);
  }

  protected loadRelationshipsOptions(): void {
    this.lawService
      .query()
      .pipe(map((res: HttpResponse<ILaw[]>) => res.body ?? []))
      .pipe(map((laws: ILaw[]) => this.lawService.addLawToCollectionIfMissing(laws, this.editForm.get('ref')!.value)))
      .subscribe((laws: ILaw[]) => (this.lawsSharedCollection = laws));

    this.countryService
      .query()
      .pipe(map((res: HttpResponse<ICountry[]>) => res.body ?? []))
      .pipe(
        map((countries: ICountry[]) => this.countryService.addCountryToCollectionIfMissing(countries, this.editForm.get('country')!.value))
      )
      .subscribe((countries: ICountry[]) => (this.countriesSharedCollection = countries));
  }

  protected createFromForm(): ILaw {
    return {
      ...new Law(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      name: this.editForm.get(['name'])!.value,
      publicationDate: this.editForm.get(['publicationDate'])!.value,
      effectiveDate: this.editForm.get(['effectiveDate'])!.value,
      country: this.editForm.get(['country'])!.value,
      ref: this.editForm.get(['ref'])!.value,
    };
  }
}
