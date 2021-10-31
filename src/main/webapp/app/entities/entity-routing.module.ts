import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'country',
        data: { pageTitle: 'legalisSpaceApp.country.home.title' },
        loadChildren: () => import('./country/country.module').then(m => m.CountryModule),
      },
      {
        path: 'language',
        data: { pageTitle: 'legalisSpaceApp.language.home.title' },
        loadChildren: () => import('./language/language.module').then(m => m.LanguageModule),
      },
      {
        path: 'statement',
        data: { pageTitle: 'legalisSpaceApp.statement.home.title' },
        loadChildren: () => import('./statement/statement.module').then(m => m.StatementModule),
      },
      {
        path: 'law',
        data: { pageTitle: 'legalisSpaceApp.law.home.title' },
        loadChildren: () => import('./law/law.module').then(m => m.LawModule),
      },
      {
        path: 'treaty',
        data: { pageTitle: 'legalisSpaceApp.treaty.home.title' },
        loadChildren: () => import('./treaty/treaty.module').then(m => m.TreatyModule),
      },
      {
        path: 'translation',
        data: { pageTitle: 'legalisSpaceApp.translation.home.title' },
        loadChildren: () => import('./translation/translation.module').then(m => m.TranslationModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
