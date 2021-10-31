jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LawService } from '../service/law.service';
import { ILaw, Law } from '../law.model';
import { ICountry } from 'app/entities/country/country.model';
import { CountryService } from 'app/entities/country/service/country.service';

import { LawUpdateComponent } from './law-update.component';

describe('Law Management Update Component', () => {
  let comp: LawUpdateComponent;
  let fixture: ComponentFixture<LawUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let lawService: LawService;
  let countryService: CountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LawUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(LawUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LawUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    lawService = TestBed.inject(LawService);
    countryService = TestBed.inject(CountryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Law query and add missing value', () => {
      const law: ILaw = { id: 'CBA' };
      const ref: ILaw = { id: '49242bd7-b16a-4db3-98ef-4cf481615646' };
      law.ref = ref;

      const lawCollection: ILaw[] = [{ id: '2505bf0a-9cad-4095-82e0-835b85082f58' }];
      jest.spyOn(lawService, 'query').mockReturnValue(of(new HttpResponse({ body: lawCollection })));
      const additionalLaws = [ref];
      const expectedCollection: ILaw[] = [...additionalLaws, ...lawCollection];
      jest.spyOn(lawService, 'addLawToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ law });
      comp.ngOnInit();

      expect(lawService.query).toHaveBeenCalled();
      expect(lawService.addLawToCollectionIfMissing).toHaveBeenCalledWith(lawCollection, ...additionalLaws);
      expect(comp.lawsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Country query and add missing value', () => {
      const law: ILaw = { id: 'CBA' };
      const country: ICountry = { id: '3c442117-f357-45b9-8492-e47503d35f75' };
      law.country = country;

      const countryCollection: ICountry[] = [{ id: '22853795-6059-49e2-925d-c8f069a0b7c7' }];
      jest.spyOn(countryService, 'query').mockReturnValue(of(new HttpResponse({ body: countryCollection })));
      const additionalCountries = [country];
      const expectedCollection: ICountry[] = [...additionalCountries, ...countryCollection];
      jest.spyOn(countryService, 'addCountryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ law });
      comp.ngOnInit();

      expect(countryService.query).toHaveBeenCalled();
      expect(countryService.addCountryToCollectionIfMissing).toHaveBeenCalledWith(countryCollection, ...additionalCountries);
      expect(comp.countriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const law: ILaw = { id: 'CBA' };
      const ref: ILaw = { id: '1a7c0df7-e2ab-4330-b303-ea2b6f9ecd42' };
      law.ref = ref;
      const country: ICountry = { id: '36acfee1-54b2-47d0-b632-ed68123d37d2' };
      law.country = country;

      activatedRoute.data = of({ law });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(law));
      expect(comp.lawsSharedCollection).toContain(ref);
      expect(comp.countriesSharedCollection).toContain(country);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Law>>();
      const law = { id: 'ABC' };
      jest.spyOn(lawService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ law });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: law }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(lawService.update).toHaveBeenCalledWith(law);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Law>>();
      const law = new Law();
      jest.spyOn(lawService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ law });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: law }));
      saveSubject.complete();

      // THEN
      expect(lawService.create).toHaveBeenCalledWith(law);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Law>>();
      const law = { id: 'ABC' };
      jest.spyOn(lawService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ law });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(lawService.update).toHaveBeenCalledWith(law);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackLawById', () => {
      it('Should return tracked Law primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackLawById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackCountryById', () => {
      it('Should return tracked Country primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackCountryById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
