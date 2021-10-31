jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TreatyService } from '../service/treaty.service';
import { ITreaty, Treaty } from '../treaty.model';
import { ILaw } from 'app/entities/law/law.model';
import { LawService } from 'app/entities/law/service/law.service';

import { TreatyUpdateComponent } from './treaty-update.component';

describe('Treaty Management Update Component', () => {
  let comp: TreatyUpdateComponent;
  let fixture: ComponentFixture<TreatyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let treatyService: TreatyService;
  let lawService: LawService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TreatyUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(TreatyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TreatyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    treatyService = TestBed.inject(TreatyService);
    lawService = TestBed.inject(LawService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Law query and add missing value', () => {
      const treaty: ITreaty = { id: 'CBA' };
      const law: ILaw = { id: '18857df8-ce13-4035-8bc7-89444a083843' };
      treaty.law = law;

      const lawCollection: ILaw[] = [{ id: 'b1c00015-a535-4286-aee0-0817feae8c57' }];
      jest.spyOn(lawService, 'query').mockReturnValue(of(new HttpResponse({ body: lawCollection })));
      const additionalLaws = [law];
      const expectedCollection: ILaw[] = [...additionalLaws, ...lawCollection];
      jest.spyOn(lawService, 'addLawToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ treaty });
      comp.ngOnInit();

      expect(lawService.query).toHaveBeenCalled();
      expect(lawService.addLawToCollectionIfMissing).toHaveBeenCalledWith(lawCollection, ...additionalLaws);
      expect(comp.lawsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const treaty: ITreaty = { id: 'CBA' };
      const law: ILaw = { id: '4aa619e4-6457-4b16-8dab-cad11ceba1b2' };
      treaty.law = law;

      activatedRoute.data = of({ treaty });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(treaty));
      expect(comp.lawsSharedCollection).toContain(law);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Treaty>>();
      const treaty = { id: 'ABC' };
      jest.spyOn(treatyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ treaty });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: treaty }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(treatyService.update).toHaveBeenCalledWith(treaty);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Treaty>>();
      const treaty = new Treaty();
      jest.spyOn(treatyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ treaty });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: treaty }));
      saveSubject.complete();

      // THEN
      expect(treatyService.create).toHaveBeenCalledWith(treaty);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Treaty>>();
      const treaty = { id: 'ABC' };
      jest.spyOn(treatyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ treaty });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(treatyService.update).toHaveBeenCalledWith(treaty);
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
  });
});
