import { PrismaService } from '../../../../nest-modules/prisma-service/prisma-service.service';
import { Prisma } from '../../../../generated/prisma';
import {
  IUserRepository,
  UserInputParams,
  UserOutputParams,
} from '../../domain/contracts/user-repository.interface';
import { UserModelMapper } from '../models/user.model.mapper';
import { User } from '../../domain/entities/user.entity';

export class UserRepository implements IUserRepository {
  constructor(private readonly db: PrismaService) {}
  async verifyEmailInUse(email: string): Promise<boolean> {
    const model = await this.db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
      },
    });

    return !!model;
  }

  async verifyDocumentInUse(document: string): Promise<boolean> {
    const model = await this.db.user.findUnique({
      where: {
        document,
      },
      select: {
        id: true,
        document: true,
      },
    });

    return !!model;
  }

  async generateCode(): Promise<string> {
    while (true) {
      const code = User.generateCode();

      const verifyCode = await this.db.user.findFirst({ where: { code } });

      if (!verifyCode) {
        return code;
      }
    }
  }

  async getByCode(code: string): Promise<User | null> {
    const model = await this.db.user.findFirst({ where: { code } });

    return model ? UserModelMapper.toEntity(model) : null;
  }

  async getByDocument(document: string): Promise<User | null> {
    const model = await this.db.user.findUnique({
      where: {
        document,
      },
    });

    return model ? UserModelMapper.toEntity(model) : null;
  }
  async getByEmail(email: string): Promise<User | null> {
    const model = await this.db.user.findUnique({
      where: {
        email,
      },
    });

    return model ? UserModelMapper.toEntity(model) : null;
  }

  async getById(id: string): Promise<User | null> {
    const model = await this.db.user.findUnique({
      where: {
        id,
      },
    });

    return model ? UserModelMapper.toEntity(model) : null;
  }

  async getAll(props: UserInputParams): Promise<UserOutputParams> {
    const { page = 1, perPage = 10, filter } = props;

    const filters: Prisma.UserWhereInput = {
      OR: [
        { firstName: { contains: filter || '', mode: 'insensitive' } },
        { lastName: { contains: filter || '', mode: 'insensitive' } },
        { email: { contains: filter || '', mode: 'insensitive' } },
        { document: { contains: filter || '', mode: 'insensitive' } },
      ],
    };

    const totalItems = await this.db.user.count({ where: filters });
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
    const currentPage = Math.max(1, page);
    const offSet = (currentPage - 1) * perPage;

    const items = await this.db.user.findMany({
      where: filters,
      skip: offSet,
      take: perPage,
    });

    return {
      data: items.map((e) => UserModelMapper.toEntity(e)),
      page: currentPage,
      perPage,
      totalItems,
      totalPages,
    };
  }

  async store(entity: User): Promise<void> {
    await this.db.user.create({
      data: UserModelMapper.toModel(entity),
    });
  }

  async update(entity: User): Promise<void> {
    await this.db.user.update({
      where: { id: entity.id },
      data: UserModelMapper.toModel(entity),
    });
  }

  async delete(id: string): Promise<void> {
    await this.db.user.delete({
      where: { id },
    });
  }
}
