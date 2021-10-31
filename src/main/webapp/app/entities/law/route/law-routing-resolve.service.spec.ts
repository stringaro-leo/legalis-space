jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ILaw, Law } from '../law.model';
import { LawService } from '../service/law.service';

import { LawRoutingResolveService } from './law-routing-resolve.service';

describe('Law routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: LawRoutingResolveService;
  let service: LawService;
  let resultLaw: ILaw | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(LawRoutingResolveService);
    service = TestBed.inject(LawService);
    resultLaw = undefined;
  });

  describe('resolve', () => {
    it('should return ILaw returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLaw = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultLaw).toEqual({ id: 'ABC' });
    });

    it('should return new ILaw if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLaw = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultLaw).toEqual(new Law());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Law })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLaw = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultLaw).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
