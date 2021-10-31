import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LawDetailComponent } from './law-detail.component';

describe('Law Management Detail Component', () => {
  let comp: LawDetailComponent;
  let fixture: ComponentFixture<LawDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LawDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ law: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(LawDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LawDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load law on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.law).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
