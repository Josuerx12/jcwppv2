import { Prisma } from '../../../../generated/prisma';
import { User } from '../../domain/entities/user.entity';

export class UserModelMapper {
  static toModel(entity: User) {
    return {
      document: entity.document,
      documentType: entity.documentType,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      password: entity.password,
      code: entity.code,
    } as Prisma.UserCreateInput;
  }

  static toEntity(model: Prisma.UserGetPayload<{}>) {
    return new User({
      id: model.id,
      document: model.document,
      documentType: model.documentType,
      email: model.email,
      firstName: model.firstName,
      lastName: model.lastName,
      password: model.password,
      role: model.role,
      code: model.code,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
