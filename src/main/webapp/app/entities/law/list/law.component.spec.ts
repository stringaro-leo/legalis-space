import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LawService } from '../service/law.service';

import { LawComponent } from './law.component';

describe('Law Management Component', () => {
  let comp: LawComponent;
  let fixture: ComponentFixture<LawComponent>;
  let service: LawService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LawComponent],
    })
      .overrideTemplate(LawComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LawComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LawService);

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
    expect(comp.laws?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });
});
