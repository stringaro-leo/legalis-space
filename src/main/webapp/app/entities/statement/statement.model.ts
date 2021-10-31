import { ICountry } from 'app/entities/country/country.model';
import { ITreaty } from 'app/entities/treaty/treaty.model';

export interface IStatement {
  id?: string;
  description?: string | null;
  title?: string | null;
  country?: ICountry | null;
  treaty?: ITreaty | null;
}

export class Statement implements IStatement {
  constructor(
    public id?: string,
    public description?: string | null,
    public title?: string | null,
    public country?: ICountry | null,
    public treaty?: ITreaty | null
  ) {}
}

export function getStatementIdentifier(statement: IStatement): string | undefined {
  return statement.id;
}
