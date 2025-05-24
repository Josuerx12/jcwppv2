export type InputParamsConstructorProps<FilterT = string> = {
  page?: string;
  perPage?: string;
  filter?: FilterT | null;
};

export class InputParams<FilterT = string> {
  page?: number;
  perPage?: number;
  filter?: FilterT | null;

  constructor(props: InputParamsConstructorProps) {
    this.page = Number(props.page);
    this.perPage = Number(props.perPage);
  }
}
