import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStatement } from '../statement.model';

@Component({
  selector: 'jhi-statement-detail',
  templateUrl: './statement-detail.component.html',
})
export class StatementDetailComponent implements OnInit {
  statement: IStatement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ statement }) => {
      this.statement = statement;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
