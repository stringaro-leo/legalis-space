import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILaw, getLawIdentifier } from '../law.model';

export type EntityResponseType = HttpResponse<ILaw>;
export type EntityArrayResponseType = HttpResponse<ILaw[]>;

@Injectable({ providedIn: 'root' })
export class LawService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/laws');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(law: ILaw): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(law);
    return this.http
      .post<ILaw>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(law: ILaw): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(law);
    return this.http
      .put<ILaw>(`${this.resourceUrl}/${getLawIdentifier(law) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(law: ILaw): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(law);
    return this.http
      .patch<ILaw>(`${this.resourceUrl}/${getLawIdentifier(law) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<ILaw>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ILaw[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLawToCollectionIfMissing(lawCollection: ILaw[], ...lawsToCheck: (ILaw | null | undefined)[]): ILaw[] {
    const laws: ILaw[] = lawsToCheck.filter(isPresent);
    if (laws.length > 0) {
      const lawCollectionIdentifiers = lawCollection.map(lawItem => getLawIdentifier(lawItem)!);
      const lawsToAdd = laws.filter(lawItem => {
        const lawIdentifier = getLawIdentifier(lawItem);
        if (lawIdentifier == null || lawCollectionIdentifiers.includes(lawIdentifier)) {
          return false;
        }
        lawCollectionIdentifiers.push(lawIdentifier);
        return true;
      });
      return [...lawsToAdd, ...lawCollection];
    }
    return lawCollection;
  }

  protected convertDateFromClient(law: ILaw): ILaw {
    return Object.assign({}, law, {
      publicationDate: law.publicationDate?.isValid() ? law.publicationDate.format(DATE_FORMAT) : undefined,
      effectiveDate: law.effectiveDate?.isValid() ? law.effectiveDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.publicationDate = res.body.publicationDate ? dayjs(res.body.publicationDate) : undefined;
      res.body.effectiveDate = res.body.effectiveDate ? dayjs(res.body.effectiveDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((law: ILaw) => {
        law.publicationDate = law.publicationDate ? dayjs(law.publicationDate) : undefined;
        law.effectiveDate = law.effectiveDate ? dayjs(law.effectiveDate) : undefined;
      });
    }
    return res;
  }
}
