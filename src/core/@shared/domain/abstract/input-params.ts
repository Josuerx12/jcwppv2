export type InputParamsConstructorProps<FilterT = string> = {
  page?: string;
  perPage?: string;
  filter?: FilterT | null;
};

export class InputParams<FilterT = string> {
  page: number;
  perPage: number;
  filter?: FilterT | null;

  constructor(props: InputParamsConstructorProps) {
    this.page = props.page ? parseInt(props.page) : 1;
    this.perPage = props.perPage ? parseInt(props.perPage) : 15;
  }
}
