import { Prisma } from '../../../../generated/prisma';
import { Instance } from '../../domain/entities/instance.entity';

export class InstanceModelMapper {
  static toModel(entity: Instance) {
    return {
      name: entity.name,
      session: {
        connect: {
          id: entity.sessionId,
        },
      },
      user: {
        connect: {
          id: entity.userId,
        },
      },
    } as Prisma.InstanceCreateInput;
  }

  static toEntity(model: Prisma.InstanceGetPayload<{}>) {
    return new Instance({
      id: model.id,
      userId: model.userId,
      sessionId: model.sessionId,
      name: model.name,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
