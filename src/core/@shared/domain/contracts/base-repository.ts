export interface IBaseRepository<InputParamsT, EntityT, OutputParamsT> {
  getById(id: string): Promise<EntityT>;
  getAll(props: InputParamsT): Promise<OutputParamsT>;
  store(entity: EntityT): Promise<void>;
  update(entity: EntityT): Promise<void>;
}
