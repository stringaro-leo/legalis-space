import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITranslation, Translation } from '../translation.model';

import { TranslationService } from './translation.service';

describe('Translation Service', () => {
  let service: TranslationService;
  let httpMock: HttpTestingController;
  let elemDefault: ITranslation;
  let expectedResult: ITranslation | ITranslation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TranslationService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 'AAAAAAA',
      note: 'AAAAAAA',
      author: 'AAAAAAA',
      source: 'AAAAAAA',
      official: false,
      content: 'AAAAAAA',
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

    it('should create a Translation', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Translation()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Translation', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          note: 'BBBBBB',
          author: 'BBBBBB',
          source: 'BBBBBB',
          official: true,
          content: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Translation', () => {
      const patchObject = Object.assign(
        {
          source: 'BBBBBB',
          official: true,
        },
        new Translation()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Translation', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          note: 'BBBBBB',
          author: 'BBBBBB',
          source: 'BBBBBB',
          official: true,
          content: 'BBBBBB',
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

    it('should delete a Translation', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTranslationToCollectionIfMissing', () => {
      it('should add a Translation to an empty array', () => {
        const translation: ITranslation = { id: 'ABC' };
        expectedResult = service.addTranslationToCollectionIfMissing([], translation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(translation);
      });

      it('should not add a Translation to an array that contains it', () => {
        const translation: ITranslation = { id: 'ABC' };
        const translationCollection: ITranslation[] = [
          {
            ...translation,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addTranslationToCollectionIfMissing(translationCollection, translation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Translation to an array that doesn't contain it", () => {
        const translation: ITranslation = { id: 'ABC' };
        const translationCollection: ITranslation[] = [{ id: 'CBA' }];
        expectedResult = service.addTranslationToCollectionIfMissing(translationCollection, translation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(translation);
      });

      it('should add only unique Translation to an array', () => {
        const translationArray: ITranslation[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '322236c9-a656-4e73-95c5-1cb350cd1c0f' }];
        const translationCollection: ITranslation[] = [{ id: 'ABC' }];
        expectedResult = service.addTranslationToCollectionIfMissing(translationCollection, ...translationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const translation: ITranslation = { id: 'ABC' };
        const translation2: ITranslation = { id: 'CBA' };
        expectedResult = service.addTranslationToCollectionIfMissing([], translation, translation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(translation);
        expect(expectedResult).toContain(translation2);
      });

      it('should accept null and undefined values', () => {
        const translation: ITranslation = { id: 'ABC' };
        expectedResult = service.addTranslationToCollectionIfMissing([], null, translation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(translation);
      });

      it('should return initial array if no Translation is added', () => {
        const translationCollection: ITranslation[] = [{ id: 'ABC' }];
        expectedResult = service.addTranslationToCollectionIfMissing(translationCollection, undefined, null);
        expect(expectedResult).toEqual(translationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
