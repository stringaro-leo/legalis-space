import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TranslationService } from '../service/translation.service';

import { TranslationComponent } from './translation.component';

describe('Translation Management Component', () => {
  let comp: TranslationComponent;
  let fixture: ComponentFixture<TranslationComponent>;
  let service: TranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TranslationComponent],
    })
      .overrideTemplate(TranslationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TranslationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TranslationService);

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
    expect(comp.translations?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });
});
