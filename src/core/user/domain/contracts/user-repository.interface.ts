import { InputParams } from '../../../@shared/domain/abstract/input-params';
import { OutputParams } from '../../../@shared/domain/abstract/output-params';
import { IBaseRepository } from '../../../@shared/domain/contracts/base-repository';
import { User } from '../entities/user.entity';

export type UserFilter = string;

export class UserInputParams extends InputParams<UserFilter> {}

export class UserOutputParams extends OutputParams<User> {}

export interface IUserRepository
  extends IBaseRepository<UserInputParams, User, UserOutputParams> {
  getByCode(code: string): Promise<User | null>;
  generateCode(): Promise<string>;
  getByDocument(document: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  verifyEmailInUse(email: string): Promise<boolean>;
  verifyDocumentInUse(document: string): Promise<boolean>;
}
