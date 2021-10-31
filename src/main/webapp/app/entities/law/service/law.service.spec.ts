import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ILaw, Law } from '../law.model';

import { LawService } from './law.service';

describe('Law Service', () => {
  let service: LawService;
  let httpMock: HttpTestingController;
  let elemDefault: ILaw;
  let expectedResult: ILaw | ILaw[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LawService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 'AAAAAAA',
      description: 'AAAAAAA',
      name: 'AAAAAAA',
      publicationDate: currentDate,
      effectiveDate: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          publicationDate: currentDate.format(DATE_FORMAT),
          effectiveDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Law', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
          publicationDate: currentDate.format(DATE_FORMAT),
          effectiveDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          publicationDate: currentDate,
          effectiveDate: currentDate,
        },
        returnedFromService
      );

      service.create(new Law()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Law', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          description: 'BBBBBB',
          name: 'BBBBBB',
          publicationDate: currentDate.format(DATE_FORMAT),
          effectiveDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          publicationDate: currentDate,
          effectiveDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Law', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          publicationDate: currentDate.format(DATE_FORMAT),
        },
        new Law()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          publicationDate: currentDate,
          effectiveDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Law', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          description: 'BBBBBB',
          name: 'BBBBBB',
          publicationDate: currentDate.format(DATE_FORMAT),
          effectiveDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          publicationDate: currentDate,
          effectiveDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Law', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLawToCollectionIfMissing', () => {
      it('should add a Law to an empty array', () => {
        const law: ILaw = { id: 'ABC' };
        expectedResult = service.addLawToCollectionIfMissing([], law);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(law);
      });

      it('should not add a Law to an array that contains it', () => {
        const law: ILaw = { id: 'ABC' };
        const lawCollection: ILaw[] = [
          {
            ...law,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addLawToCollectionIfMissing(lawCollection, law);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Law to an array that doesn't contain it", () => {
        const law: ILaw = { id: 'ABC' };
        const lawCollection: ILaw[] = [{ id: 'CBA' }];
        expectedResult = service.addLawToCollectionIfMissing(lawCollection, law);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(law);
      });

      it('should add only unique Law to an array', () => {
        const lawArray: ILaw[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '7467f4e6-02b3-48b1-8734-f8be6fcb1393' }];
        const lawCollection: ILaw[] = [{ id: 'ABC' }];
        expectedResult = service.addLawToCollectionIfMissing(lawCollection, ...lawArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const law: ILaw = { id: 'ABC' };
        const law2: ILaw = { id: 'CBA' };
        expectedResult = service.addLawToCollectionIfMissing([], law, law2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(law);
        expect(expectedResult).toContain(law2);
      });

      it('should accept null and undefined values', () => {
        const law: ILaw = { id: 'ABC' };
        expectedResult = service.addLawToCollectionIfMissing([], null, law, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(law);
      });

      it('should return initial array if no Law is added', () => {
        const lawCollection: ILaw[] = [{ id: 'ABC' }];
        expectedResult = service.addLawToCollectionIfMissing(lawCollection, undefined, null);
        expect(expectedResult).toEqual(lawCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
