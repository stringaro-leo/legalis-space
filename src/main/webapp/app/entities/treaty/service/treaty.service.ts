import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITreaty, getTreatyIdentifier } from '../treaty.model';

export type EntityResponseType = HttpResponse<ITreaty>;
export type EntityArrayResponseType = HttpResponse<ITreaty[]>;

@Injectable({ providedIn: 'root' })
export class TreatyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/treaties');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(treaty: ITreaty): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(treaty);
    return this.http
      .post<ITreaty>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(treaty: ITreaty): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(treaty);
    return this.http
      .put<ITreaty>(`${this.resourceUrl}/${getTreatyIdentifier(treaty) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(treaty: ITreaty): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(treaty);
    return this.http
      .patch<ITreaty>(`${this.resourceUrl}/${getTreatyIdentifier(treaty) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<ITreaty>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITreaty[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTreatyToCollectionIfMissing(treatyCollection: ITreaty[], ...treatiesToCheck: (ITreaty | null | undefined)[]): ITreaty[] {
    const treaties: ITreaty[] = treatiesToCheck.filter(isPresent);
    if (treaties.length > 0) {
      const treatyCollectionIdentifiers = treatyCollection.map(treatyItem => getTreatyIdentifier(treatyItem)!);
      const treatiesToAdd = treaties.filter(treatyItem => {
        const treatyIdentifier = getTreatyIdentifier(treatyItem);
        if (treatyIdentifier == null || treatyCollectionIdentifiers.includes(treatyIdentifier)) {
          return false;
        }
        treatyCollectionIdentifiers.push(treatyIdentifier);
        return true;
      });
      return [...treatiesToAdd, ...treatyCollection];
    }
    return treatyCollection;
  }

  protected convertDateFromClient(treaty: ITreaty): ITreaty {
    return Object.assign({}, treaty, {
      voteDate: treaty.voteDate?.isValid() ? treaty.voteDate.format(DATE_FORMAT) : undefined,
      effectiveDate: treaty.effectiveDate?.isValid() ? treaty.effectiveDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.voteDate = res.body.voteDate ? dayjs(res.body.voteDate) : undefined;
      res.body.effectiveDate = res.body.effectiveDate ? dayjs(res.body.effectiveDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((treaty: ITreaty) => {
        treaty.voteDate = treaty.voteDate ? dayjs(treaty.voteDate) : undefined;
        treaty.effectiveDate = treaty.effectiveDate ? dayjs(treaty.effectiveDate) : undefined;
      });
    }
    return res;
  }
}
