import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILanguage, Language } from '../language.model';

import { LanguageService } from './language.service';

describe('Language Service', () => {
  let service: LanguageService;
  let httpMock: HttpTestingController;
  let elemDefault: ILanguage;
  let expectedResult: ILanguage | ILanguage[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LanguageService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 'AAAAAAA',
      code: 'AAAAAAA',
      name: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Language', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Language()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Language', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          code: 'BBBBBB',
          name: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Language', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new Language()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Language', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          code: 'BBBBBB',
          name: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Language', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLanguageToCollectionIfMissing', () => {
      it('should add a Language to an empty array', () => {
        const language: ILanguage = { id: 'ABC' };
        expectedResult = service.addLanguageToCollectionIfMissing([], language);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(language);
      });

      it('should not add a Language to an array that contains it', () => {
        const language: ILanguage = { id: 'ABC' };
        const languageCollection: ILanguage[] = [
          {
            ...language,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addLanguageToCollectionIfMissing(languageCollection, language);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Language to an array that doesn't contain it", () => {
        const language: ILanguage = { id: 'ABC' };
        const languageCollection: ILanguage[] = [{ id: 'CBA' }];
        expectedResult = service.addLanguageToCollectionIfMissing(languageCollection, language);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(language);
      });

      it('should add only unique Language to an array', () => {
        const languageArray: ILanguage[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'f9200057-5c92-4323-82b9-6ce0e6d7789b' }];
        const languageCollection: ILanguage[] = [{ id: 'ABC' }];
        expectedResult = service.addLanguageToCollectionIfMissing(languageCollection, ...languageArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const language: ILanguage = { id: 'ABC' };
        const language2: ILanguage = { id: 'CBA' };
        expectedResult = service.addLanguageToCollectionIfMissing([], language, language2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(language);
        expect(expectedResult).toContain(language2);
      });

      it('should accept null and undefined values', () => {
        const language: ILanguage = { id: 'ABC' };
        expectedResult = service.addLanguageToCollectionIfMissing([], null, language, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(language);
      });

      it('should return initial array if no Language is added', () => {
        const languageCollection: ILanguage[] = [{ id: 'ABC' }];
        expectedResult = service.addLanguageToCollectionIfMissing(languageCollection, undefined, null);
        expect(expectedResult).toEqual(languageCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
