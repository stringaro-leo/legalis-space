import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILaw } from '../law.model';

@Component({
  selector: 'jhi-law-detail',
  templateUrl: './law-detail.component.html',
})
export class LawDetailComponent implements OnInit {
  law: ILaw | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ law }) => {
      this.law = law;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
