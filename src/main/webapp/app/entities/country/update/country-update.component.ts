import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICountry, Country } from '../country.model';
import { CountryService } from '../service/country.service';
import { ITreaty } from 'app/entities/treaty/treaty.model';
import { TreatyService } from 'app/entities/treaty/service/treaty.service';

@Component({
  selector: 'jhi-country-update',
  templateUrl: './country-update.component.html',
})
export class CountryUpdateComponent implements OnInit {
  isSaving = false;

  treatiesSharedCollection: ITreaty[] = [];

  editForm = this.fb.group({
    id: [],
    code: [],
    name: [],
    ratifiedCountries: [],
  });

  constructor(
    protected countryService: CountryService,
    protected treatyService: TreatyService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ country }) => {
      this.updateForm(country);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const country = this.createFromForm();
    if (country.id !== undefined) {
      this.subscribeToSaveResponse(this.countryService.update(country));
    } else {
      this.subscribeToSaveResponse(this.countryService.create(country));
    }
  }

  trackTreatyById(index: number, item: ITreaty): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICountry>>): void {
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

  protected updateForm(country: ICountry): void {
    this.editForm.patchValue({
      id: country.id,
      code: country.code,
      name: country.name,
      ratifiedCountries: country.ratifiedCountries,
    });

    this.treatiesSharedCollection = this.treatyService.addTreatyToCollectionIfMissing(
      this.treatiesSharedCollection,
      country.ratifiedCountries
    );
  }

  protected loadRelationshipsOptions(): void {
    this.treatyService
      .query()
      .pipe(map((res: HttpResponse<ITreaty[]>) => res.body ?? []))
      .pipe(
        map((treaties: ITreaty[]) =>
          this.treatyService.addTreatyToCollectionIfMissing(treaties, this.editForm.get('ratifiedCountries')!.value)
        )
      )
      .subscribe((treaties: ITreaty[]) => (this.treatiesSharedCollection = treaties));
  }

  protected createFromForm(): ICountry {
    return {
      ...new Country(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      name: this.editForm.get(['name'])!.value,
      ratifiedCountries: this.editForm.get(['ratifiedCountries'])!.value,
    };
  }
}
