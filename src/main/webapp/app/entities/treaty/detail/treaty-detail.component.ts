import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITreaty } from '../treaty.model';

@Component({
  selector: 'jhi-treaty-detail',
  templateUrl: './treaty-detail.component.html',
})
export class TreatyDetailComponent implements OnInit {
  treaty: ITreaty | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ treaty }) => {
      this.treaty = treaty;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
