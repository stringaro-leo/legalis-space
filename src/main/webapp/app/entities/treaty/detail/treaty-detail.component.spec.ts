import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TreatyDetailComponent } from './treaty-detail.component';

describe('Treaty Management Detail Component', () => {
  let comp: TreatyDetailComponent;
  let fixture: ComponentFixture<TreatyDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TreatyDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ treaty: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(TreatyDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TreatyDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load treaty on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.treaty).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
