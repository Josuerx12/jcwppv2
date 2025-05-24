export interface IBaseRepository<InputParamsT, EntityT, OutputParamsT> {
  getById(id: string): Promise<EntityT | null>;
  getAll(props: InputParamsT): Promise<OutputParamsT>;
  store(entity: EntityT): Promise<void>;
  update(entity: EntityT): Promise<void>;
  delete(id: string): Promise<void>;
}
