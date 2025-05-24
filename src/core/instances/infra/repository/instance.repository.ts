import {
  IInstanceRepository,
  InstanceInputParams,
  InstanceOutputParams,
} from '../../domain/contracts/instance-repository.interface';
import { PrismaService } from '../../../../nest-modules/prisma-service/prisma-service.service';
import { Instance } from '../../domain/entities/instance.entity';
import { InstanceModelMapper } from '../models/instance.model.mapper';
import { Prisma } from '../../../../generated/prisma';

export class InstanceRepository implements IInstanceRepository {
  constructor(private readonly db: PrismaService) {}

  async getById(id: string): Promise<Instance | null> {
    const model = await this.db.instance.findUnique({
      where: {
        id,
      },
    });

    return model ? InstanceModelMapper.toEntity(model) : null;
  }

  async getAll(props: InstanceInputParams): Promise<InstanceOutputParams> {
    const { page = 1, perPage = 10, filter } = props;

    const filters: Prisma.InstanceWhereInput = {
      OR: [
        { name: { contains: filter || '', mode: 'insensitive' } },
        { sessionId: { contains: filter || '', mode: 'insensitive' } },
        { userId: { contains: filter || '', mode: 'insensitive' } },
      ],
    };

    const totalItems = await this.db.instance.count({ where: filters });
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
    const currentPage = Math.max(1, page);
    const offSet = (currentPage - 1) * perPage;

    const items = await this.db.instance.findMany({
      where: filters,
      skip: offSet,
      take: perPage,
    });

    return {
      data: items.map((e) => InstanceModelMapper.toEntity(e)),
      page: currentPage,
      perPage,
      totalItems,
      totalPages,
    };
  }

  async store(entity: Instance): Promise<void> {
    await this.db.instance.create({
      data: InstanceModelMapper.toModel(entity),
    });
  }

  async update(entity: Instance): Promise<void> {
    await this.db.instance.update({
      where: { id: entity.id },
      data: InstanceModelMapper.toModel(entity),
    });
  }

  async delete(id: string): Promise<void> {
    await this.db.instance.delete({
      where: { id },
    });
  }
}
