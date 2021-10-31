import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ITreaty, Treaty } from '../treaty.model';

import { TreatyService } from './treaty.service';

describe('Treaty Service', () => {
  let service: TreatyService;
  let httpMock: HttpTestingController;
  let elemDefault: ITreaty;
  let expectedResult: ITreaty | ITreaty[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TreatyService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 'AAAAAAA',
      description: 'AAAAAAA',
      name: 'AAAAAAA',
      voteDate: currentDate,
      effectiveDate: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          voteDate: currentDate.format(DATE_FORMAT),
          effectiveDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Treaty', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
          voteDate: currentDate.format(DATE_FORMAT),
          effectiveDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          voteDate: currentDate,
          effectiveDate: currentDate,
        },
        returnedFromService
      );

      service.create(new Treaty()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Treaty', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          description: 'BBBBBB',
          name: 'BBBBBB',
          voteDate: currentDate.format(DATE_FORMAT),
          effectiveDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          voteDate: currentDate,
          effectiveDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Treaty', () => {
      const patchObject = Object.assign(
        {
          voteDate: currentDate.format(DATE_FORMAT),
          effectiveDate: currentDate.format(DATE_FORMAT),
        },
        new Treaty()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          voteDate: currentDate,
          effectiveDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Treaty', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          description: 'BBBBBB',
          name: 'BBBBBB',
          voteDate: currentDate.format(DATE_FORMAT),
          effectiveDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          voteDate: currentDate,
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

    it('should delete a Treaty', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTreatyToCollectionIfMissing', () => {
      it('should add a Treaty to an empty array', () => {
        const treaty: ITreaty = { id: 'ABC' };
        expectedResult = service.addTreatyToCollectionIfMissing([], treaty);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(treaty);
      });

      it('should not add a Treaty to an array that contains it', () => {
        const treaty: ITreaty = { id: 'ABC' };
        const treatyCollection: ITreaty[] = [
          {
            ...treaty,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addTreatyToCollectionIfMissing(treatyCollection, treaty);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Treaty to an array that doesn't contain it", () => {
        const treaty: ITreaty = { id: 'ABC' };
        const treatyCollection: ITreaty[] = [{ id: 'CBA' }];
        expectedResult = service.addTreatyToCollectionIfMissing(treatyCollection, treaty);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(treaty);
      });

      it('should add only unique Treaty to an array', () => {
        const treatyArray: ITreaty[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'f5eca649-5cea-4631-a273-2dc3e73913f0' }];
        const treatyCollection: ITreaty[] = [{ id: 'ABC' }];
        expectedResult = service.addTreatyToCollectionIfMissing(treatyCollection, ...treatyArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const treaty: ITreaty = { id: 'ABC' };
        const treaty2: ITreaty = { id: 'CBA' };
        expectedResult = service.addTreatyToCollectionIfMissing([], treaty, treaty2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(treaty);
        expect(expectedResult).toContain(treaty2);
      });

      it('should accept null and undefined values', () => {
        const treaty: ITreaty = { id: 'ABC' };
        expectedResult = service.addTreatyToCollectionIfMissing([], null, treaty, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(treaty);
      });

      it('should return initial array if no Treaty is added', () => {
        const treatyCollection: ITreaty[] = [{ id: 'ABC' }];
        expectedResult = service.addTreatyToCollectionIfMissing(treatyCollection, undefined, null);
        expect(expectedResult).toEqual(treatyCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
