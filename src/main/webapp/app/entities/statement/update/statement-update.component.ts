import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IStatement, Statement } from '../statement.model';
import { StatementService } from '../service/statement.service';
import { ICountry } from 'app/entities/country/country.model';
import { CountryService } from 'app/entities/country/service/country.service';
import { ITreaty } from 'app/entities/treaty/treaty.model';
import { TreatyService } from 'app/entities/treaty/service/treaty.service';

@Component({
  selector: 'jhi-statement-update',
  templateUrl: './statement-update.component.html',
})
export class StatementUpdateComponent implements OnInit {
  isSaving = false;

  countriesSharedCollection: ICountry[] = [];
  treatiesSharedCollection: ITreaty[] = [];

  editForm = this.fb.group({
    id: [],
    description: [],
    title: [],
    country: [],
    treaty: [],
  });

  constructor(
    protected statementService: StatementService,
    protected countryService: CountryService,
    protected treatyService: TreatyService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ statement }) => {
      this.updateForm(statement);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const statement = this.createFromForm();
    if (statement.id !== undefined) {
      this.subscribeToSaveResponse(this.statementService.update(statement));
    } else {
      this.subscribeToSaveResponse(this.statementService.create(statement));
    }
  }

  trackCountryById(index: number, item: ICountry): string {
    return item.id!;
  }

  trackTreatyById(index: number, item: ITreaty): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStatement>>): void {
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

  protected updateForm(statement: IStatement): void {
    this.editForm.patchValue({
      id: statement.id,
      description: statement.description,
      title: statement.title,
      country: statement.country,
      treaty: statement.treaty,
    });

    this.countriesSharedCollection = this.countryService.addCountryToCollectionIfMissing(this.countriesSharedCollection, statement.country);
    this.treatiesSharedCollection = this.treatyService.addTreatyToCollectionIfMissing(this.treatiesSharedCollection, statement.treaty);
  }

  protected loadRelationshipsOptions(): void {
    this.countryService
      .query()
      .pipe(map((res: HttpResponse<ICountry[]>) => res.body ?? []))
      .pipe(
        map((countries: ICountry[]) => this.countryService.addCountryToCollectionIfMissing(countries, this.editForm.get('country')!.value))
      )
      .subscribe((countries: ICountry[]) => (this.countriesSharedCollection = countries));

    this.treatyService
      .query()
      .pipe(map((res: HttpResponse<ITreaty[]>) => res.body ?? []))
      .pipe(map((treaties: ITreaty[]) => this.treatyService.addTreatyToCollectionIfMissing(treaties, this.editForm.get('treaty')!.value)))
      .subscribe((treaties: ITreaty[]) => (this.treatiesSharedCollection = treaties));
  }

  protected createFromForm(): IStatement {
    return {
      ...new Statement(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      title: this.editForm.get(['title'])!.value,
      country: this.editForm.get(['country'])!.value,
      treaty: this.editForm.get(['treaty'])!.value,
    };
  }
}
