import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { StatementService } from '../service/statement.service';

import { StatementComponent } from './statement.component';

describe('Statement Management Component', () => {
  let comp: StatementComponent;
  let fixture: ComponentFixture<StatementComponent>;
  let service: StatementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [StatementComponent],
    })
      .overrideTemplate(StatementComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StatementComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(StatementService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 'ABC' }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.statements?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });
});
