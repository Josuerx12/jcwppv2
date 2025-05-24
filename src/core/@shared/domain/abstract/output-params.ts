export abstract class OutputParams<EntityT> {
  perPage: number;
  page: number;
  totalItems: number;
  totalPages: number;
  data: EntityT[];
}
