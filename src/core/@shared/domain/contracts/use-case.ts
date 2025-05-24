export interface IUseCase<InputT, outputT> {
  execute(input: InputT): Promise<outputT>;
}
