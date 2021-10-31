jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CountryService } from '../service/country.service';
import { ICountry, Country } from '../country.model';
import { ITreaty } from 'app/entities/treaty/treaty.model';
import { TreatyService } from 'app/entities/treaty/service/treaty.service';

import { CountryUpdateComponent } from './country-update.component';

describe('Country Management Update Component', () => {
  let comp: CountryUpdateComponent;
  let fixture: ComponentFixture<CountryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let countryService: CountryService;
  let treatyService: TreatyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CountryUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(CountryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CountryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    countryService = TestBed.inject(CountryService);
    treatyService = TestBed.inject(TreatyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Treaty query and add missing value', () => {
      const country: ICountry = { id: 'CBA' };
      const ratifiedCountries: ITreaty = { id: '7d12cb25-ead9-4a42-b550-141c3fa44969' };
      country.ratifiedCountries = ratifiedCountries;

      const treatyCollection: ITreaty[] = [{ id: 'f20d833e-ba0c-4b27-a352-44dcfce0f7f7' }];
      jest.spyOn(treatyService, 'query').mockReturnValue(of(new HttpResponse({ body: treatyCollection })));
      const additionalTreaties = [ratifiedCountries];
      const expectedCollection: ITreaty[] = [...additionalTreaties, ...treatyCollection];
      jest.spyOn(treatyService, 'addTreatyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ country });
      comp.ngOnInit();

      expect(treatyService.query).toHaveBeenCalled();
      expect(treatyService.addTreatyToCollectionIfMissing).toHaveBeenCalledWith(treatyCollection, ...additionalTreaties);
      expect(comp.treatiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const country: ICountry = { id: 'CBA' };
      const ratifiedCountries: ITreaty = { id: 'fce5f620-2a20-4201-bbec-ff2f0ebeadfe' };
      country.ratifiedCountries = ratifiedCountries;

      activatedRoute.data = of({ country });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(country));
      expect(comp.treatiesSharedCollection).toContain(ratifiedCountries);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Country>>();
      const country = { id: 'ABC' };
      jest.spyOn(countryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ country });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: country }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(countryService.update).toHaveBeenCalledWith(country);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Country>>();
      const country = new Country();
      jest.spyOn(countryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ country });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: country }));
      saveSubject.complete();

      // THEN
      expect(countryService.create).toHaveBeenCalledWith(country);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Country>>();
      const country = { id: 'ABC' };
      jest.spyOn(countryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ country });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(countryService.update).toHaveBeenCalledWith(country);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTreatyById', () => {
      it('Should return tracked Treaty primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackTreatyById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
