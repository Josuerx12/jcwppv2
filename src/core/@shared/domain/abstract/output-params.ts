export abstract class OutputParams<EntityT> {
  perPage: string;
  page: string;
  totalItems: string;
  data: EntityT[];
}
