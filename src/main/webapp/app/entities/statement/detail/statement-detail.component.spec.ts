import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StatementDetailComponent } from './statement-detail.component';

describe('Statement Management Detail Component', () => {
  let comp: StatementDetailComponent;
  let fixture: ComponentFixture<StatementDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatementDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ statement: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(StatementDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(StatementDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load statement on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.statement).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
