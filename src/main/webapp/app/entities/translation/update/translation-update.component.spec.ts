jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TranslationService } from '../service/translation.service';
import { ITranslation, Translation } from '../translation.model';
import { ILanguage } from 'app/entities/language/language.model';
import { LanguageService } from 'app/entities/language/service/language.service';
import { ILaw } from 'app/entities/law/law.model';
import { LawService } from 'app/entities/law/service/law.service';
import { ITreaty } from 'app/entities/treaty/treaty.model';
import { TreatyService } from 'app/entities/treaty/service/treaty.service';

import { TranslationUpdateComponent } from './translation-update.component';

describe('Translation Management Update Component', () => {
  let comp: TranslationUpdateComponent;
  let fixture: ComponentFixture<TranslationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let translationService: TranslationService;
  let languageService: LanguageService;
  let lawService: LawService;
  let treatyService: TreatyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TranslationUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(TranslationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TranslationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    translationService = TestBed.inject(TranslationService);
    languageService = TestBed.inject(LanguageService);
    lawService = TestBed.inject(LawService);
    treatyService = TestBed.inject(TreatyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call language query and add missing value', () => {
      const translation: ITranslation = { id: 'CBA' };
      const language: ILanguage = { id: '2098bea4-2cdf-42ec-a708-4508875f7c0c' };
      translation.language = language;

      const languageCollection: ILanguage[] = [{ id: '5b21c89e-bbff-42db-983c-48d225234ee1' }];
      jest.spyOn(languageService, 'query').mockReturnValue(of(new HttpResponse({ body: languageCollection })));
      const expectedCollection: ILanguage[] = [language, ...languageCollection];
      jest.spyOn(languageService, 'addLanguageToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ translation });
      comp.ngOnInit();

      expect(languageService.query).toHaveBeenCalled();
      expect(languageService.addLanguageToCollectionIfMissing).toHaveBeenCalledWith(languageCollection, language);
      expect(comp.languagesCollection).toEqual(expectedCollection);
    });

    it('Should call Law query and add missing value', () => {
      const translation: ITranslation = { id: 'CBA' };
      const law: ILaw = { id: '11319ded-1eda-44b3-ae2b-9ce42faebbef' };
      translation.law = law;

      const lawCollection: ILaw[] = [{ id: '4fc7edfb-b2db-403c-b8f1-456160507352' }];
      jest.spyOn(lawService, 'query').mockReturnValue(of(new HttpResponse({ body: lawCollection })));
      const additionalLaws = [law];
      const expectedCollection: ILaw[] = [...additionalLaws, ...lawCollection];
      jest.spyOn(lawService, 'addLawToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ translation });
      comp.ngOnInit();

      expect(lawService.query).toHaveBeenCalled();
      expect(lawService.addLawToCollectionIfMissing).toHaveBeenCalledWith(lawCollection, ...additionalLaws);
      expect(comp.lawsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Treaty query and add missing value', () => {
      const translation: ITranslation = { id: 'CBA' };
      const treaty: ITreaty = { id: '846f3dbf-aab0-4846-925e-2305e12bbaa4' };
      translation.treaty = treaty;

      const treatyCollection: ITreaty[] = [{ id: '72b00a7a-998e-41aa-b7ff-bacb72faa4f0' }];
      jest.spyOn(treatyService, 'query').mockReturnValue(of(new HttpResponse({ body: treatyCollection })));
      const additionalTreaties = [treaty];
      const expectedCollection: ITreaty[] = [...additionalTreaties, ...treatyCollection];
      jest.spyOn(treatyService, 'addTreatyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ translation });
      comp.ngOnInit();

      expect(treatyService.query).toHaveBeenCalled();
      expect(treatyService.addTreatyToCollectionIfMissing).toHaveBeenCalledWith(treatyCollection, ...additionalTreaties);
      expect(comp.treatiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const translation: ITranslation = { id: 'CBA' };
      const language: ILanguage = { id: 'd677c900-193b-4723-9b5c-8239ca3c85b2' };
      translation.language = language;
      const law: ILaw = { id: 'c00d737d-35fd-43d0-98d4-7858d686b766' };
      translation.law = law;
      const treaty: ITreaty = { id: '6b3eb5e8-a61f-4367-9e49-002b4e4224cd' };
      translation.treaty = treaty;

      activatedRoute.data = of({ translation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(translation));
      expect(comp.languagesCollection).toContain(language);
      expect(comp.lawsSharedCollection).toContain(law);
      expect(comp.treatiesSharedCollection).toContain(treaty);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Translation>>();
      const translation = { id: 'ABC' };
      jest.spyOn(translationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ translation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: translation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(translationService.update).toHaveBeenCalledWith(translation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Translation>>();
      const translation = new Translation();
      jest.spyOn(translationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ translation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: translation }));
      saveSubject.complete();

      // THEN
      expect(translationService.create).toHaveBeenCalledWith(translation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Translation>>();
      const translation = { id: 'ABC' };
      jest.spyOn(translationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ translation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(translationService.update).toHaveBeenCalledWith(translation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackLanguageById', () => {
      it('Should return tracked Language primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackLanguageById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackLawById', () => {
      it('Should return tracked Law primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackLawById(0, entity);
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
