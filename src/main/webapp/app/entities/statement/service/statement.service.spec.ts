import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IStatement, Statement } from '../statement.model';

import { StatementService } from './statement.service';

describe('Statement Service', () => {
  let service: StatementService;
  let httpMock: HttpTestingController;
  let elemDefault: IStatement;
  let expectedResult: IStatement | IStatement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StatementService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 'AAAAAAA',
      description: 'AAAAAAA',
      title: 'AAAAAAA',
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

    it('should create a Statement', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Statement()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Statement', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          description: 'BBBBBB',
          title: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Statement', () => {
      const patchObject = Object.assign({}, new Statement());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Statement', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          description: 'BBBBBB',
          title: 'BBBBBB',
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

    it('should delete a Statement', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addStatementToCollectionIfMissing', () => {
      it('should add a Statement to an empty array', () => {
        const statement: IStatement = { id: 'ABC' };
        expectedResult = service.addStatementToCollectionIfMissing([], statement);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(statement);
      });

      it('should not add a Statement to an array that contains it', () => {
        const statement: IStatement = { id: 'ABC' };
        const statementCollection: IStatement[] = [
          {
            ...statement,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addStatementToCollectionIfMissing(statementCollection, statement);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Statement to an array that doesn't contain it", () => {
        const statement: IStatement = { id: 'ABC' };
        const statementCollection: IStatement[] = [{ id: 'CBA' }];
        expectedResult = service.addStatementToCollectionIfMissing(statementCollection, statement);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(statement);
      });

      it('should add only unique Statement to an array', () => {
        const statementArray: IStatement[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '302e84d5-1724-46a5-aafc-43bab95f16c8' }];
        const statementCollection: IStatement[] = [{ id: 'ABC' }];
        expectedResult = service.addStatementToCollectionIfMissing(statementCollection, ...statementArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const statement: IStatement = { id: 'ABC' };
        const statement2: IStatement = { id: 'CBA' };
        expectedResult = service.addStatementToCollectionIfMissing([], statement, statement2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(statement);
        expect(expectedResult).toContain(statement2);
      });

      it('should accept null and undefined values', () => {
        const statement: IStatement = { id: 'ABC' };
        expectedResult = service.addStatementToCollectionIfMissing([], null, statement, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(statement);
      });

      it('should return initial array if no Statement is added', () => {
        const statementCollection: IStatement[] = [{ id: 'ABC' }];
        expectedResult = service.addStatementToCollectionIfMissing(statementCollection, undefined, null);
        expect(expectedResult).toEqual(statementCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
