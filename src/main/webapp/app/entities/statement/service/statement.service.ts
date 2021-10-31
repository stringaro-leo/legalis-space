import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStatement, getStatementIdentifier } from '../statement.model';

export type EntityResponseType = HttpResponse<IStatement>;
export type EntityArrayResponseType = HttpResponse<IStatement[]>;

@Injectable({ providedIn: 'root' })
export class StatementService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/statements');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(statement: IStatement): Observable<EntityResponseType> {
    return this.http.post<IStatement>(this.resourceUrl, statement, { observe: 'response' });
  }

  update(statement: IStatement): Observable<EntityResponseType> {
    return this.http.put<IStatement>(`${this.resourceUrl}/${getStatementIdentifier(statement) as string}`, statement, {
      observe: 'response',
    });
  }

  partialUpdate(statement: IStatement): Observable<EntityResponseType> {
    return this.http.patch<IStatement>(`${this.resourceUrl}/${getStatementIdentifier(statement) as string}`, statement, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IStatement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStatement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addStatementToCollectionIfMissing(
    statementCollection: IStatement[],
    ...statementsToCheck: (IStatement | null | undefined)[]
  ): IStatement[] {
    const statements: IStatement[] = statementsToCheck.filter(isPresent);
    if (statements.length > 0) {
      const statementCollectionIdentifiers = statementCollection.map(statementItem => getStatementIdentifier(statementItem)!);
      const statementsToAdd = statements.filter(statementItem => {
        const statementIdentifier = getStatementIdentifier(statementItem);
        if (statementIdentifier == null || statementCollectionIdentifiers.includes(statementIdentifier)) {
          return false;
        }
        statementCollectionIdentifiers.push(statementIdentifier);
        return true;
      });
      return [...statementsToAdd, ...statementCollection];
    }
    return statementCollection;
  }
}
