import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ITranslation } from '../../translation.model';
import { createRequestOption } from '../../../../core/request/request-util';

export type EntityArrayResponseType = HttpResponse<ITranslation[]>;

@Injectable({ providedIn: 'root' })
export class TranslationExtendedService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/extended/translations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  searchTranslationsByTypeAndTypeId(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITranslation[]>(`${this.resourceUrl}/search`, { params: options, observe: 'response' });
  }
}
