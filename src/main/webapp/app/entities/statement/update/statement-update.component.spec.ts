jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { StatementService } from '../service/statement.service';
import { IStatement, Statement } from '../statement.model';
import { ICountry } from 'app/entities/country/country.model';
import { CountryService } from 'app/entities/country/service/country.service';
import { ITreaty } from 'app/entities/treaty/treaty.model';
import { TreatyService } from 'app/entities/treaty/service/treaty.service';

import { StatementUpdateComponent } from './statement-update.component';

describe('Statement Management Update Component', () => {
  let comp: StatementUpdateComponent;
  let fixture: ComponentFixture<StatementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let statementService: StatementService;
  let countryService: CountryService;
  let treatyService: TreatyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [StatementUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(StatementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StatementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    statementService = TestBed.inject(StatementService);
    countryService = TestBed.inject(CountryService);
    treatyService = TestBed.inject(TreatyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Country query and add missing value', () => {
      const statement: IStatement = { id: 'CBA' };
      const country: ICountry = { id: '47906940-4e4f-479b-9f71-d052e7051a3e' };
      statement.country = country;

      const countryCollection: ICountry[] = [{ id: 'd679b3ff-d1c8-4db8-b94b-80459907a267' }];
      jest.spyOn(countryService, 'query').mockReturnValue(of(new HttpResponse({ body: countryCollection })));
      const additionalCountries = [country];
      const expectedCollection: ICountry[] = [...additionalCountries, ...countryCollection];
      jest.spyOn(countryService, 'addCountryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ statement });
      comp.ngOnInit();

      expect(countryService.query).toHaveBeenCalled();
      expect(countryService.addCountryToCollectionIfMissing).toHaveBeenCalledWith(countryCollection, ...additionalCountries);
      expect(comp.countriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Treaty query and add missing value', () => {
      const statement: IStatement = { id: 'CBA' };
      const treaty: ITreaty = { id: '844761e7-7a8d-469d-bb9d-2003adc75070' };
      statement.treaty = treaty;

      const treatyCollection: ITreaty[] = [{ id: '0867bf43-e597-4a06-89db-b389c4be2fff' }];
      jest.spyOn(treatyService, 'query').mockReturnValue(of(new HttpResponse({ body: treatyCollection })));
      const additionalTreaties = [treaty];
      const expectedCollection: ITreaty[] = [...additionalTreaties, ...treatyCollection];
      jest.spyOn(treatyService, 'addTreatyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ statement });
      comp.ngOnInit();

      expect(treatyService.query).toHaveBeenCalled();
      expect(treatyService.addTreatyToCollectionIfMissing).toHaveBeenCalledWith(treatyCollection, ...additionalTreaties);
      expect(comp.treatiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const statement: IStatement = { id: 'CBA' };
      const country: ICountry = { id: '71716763-130c-424a-8a27-c39166b83565' };
      statement.country = country;
      const treaty: ITreaty = { id: '832a4d25-1b0d-4c10-a7ce-99bf44aa57ff' };
      statement.treaty = treaty;

      activatedRoute.data = of({ statement });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(statement));
      expect(comp.countriesSharedCollection).toContain(country);
      expect(comp.treatiesSharedCollection).toContain(treaty);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Statement>>();
      const statement = { id: 'ABC' };
      jest.spyOn(statementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ statement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: statement }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(statementService.update).toHaveBeenCalledWith(statement);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Statement>>();
      const statement = new Statement();
      jest.spyOn(statementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ statement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: statement }));
      saveSubject.complete();

      // THEN
      expect(statementService.create).toHaveBeenCalledWith(statement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Statement>>();
      const statement = { id: 'ABC' };
      jest.spyOn(statementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ statement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(statementService.update).toHaveBeenCalledWith(statement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackCountryById', () => {
      it('Should return tracked Country primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackCountryById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackTreatyById', () => {
      it('Should return tracked Treaty primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackTreatyById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
