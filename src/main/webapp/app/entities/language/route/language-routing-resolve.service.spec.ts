jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ILanguage, Language } from '../language.model';
import { LanguageService } from '../service/language.service';

import { LanguageRoutingResolveService } from './language-routing-resolve.service';

describe('Language routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: LanguageRoutingResolveService;
  let service: LanguageService;
  let resultLanguage: ILanguage | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(LanguageRoutingResolveService);
    service = TestBed.inject(LanguageService);
    resultLanguage = undefined;
  });

  describe('resolve', () => {
    it('should return ILanguage returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLanguage = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultLanguage).toEqual({ id: 'ABC' });
    });

    it('should return new ILanguage if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLanguage = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultLanguage).toEqual(new Language());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Language })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLanguage = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultLanguage).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
