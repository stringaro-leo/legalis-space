jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITreaty, Treaty } from '../treaty.model';
import { TreatyService } from '../service/treaty.service';

import { TreatyRoutingResolveService } from './treaty-routing-resolve.service';

describe('Treaty routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: TreatyRoutingResolveService;
  let service: TreatyService;
  let resultTreaty: ITreaty | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(TreatyRoutingResolveService);
    service = TestBed.inject(TreatyService);
    resultTreaty = undefined;
  });

  describe('resolve', () => {
    it('should return ITreaty returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTreaty = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultTreaty).toEqual({ id: 'ABC' });
    });

    it('should return new ITreaty if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTreaty = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultTreaty).toEqual(new Treaty());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Treaty })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTreaty = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultTreaty).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
