import { BadRequestException } from '@nestjs/common';
import { Entity } from '../../../@shared/domain/abstract/entity';
import { compare, compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { Instance } from '../../../instance/domain/entities/instance.entity';
import { RoleEnum } from '../../../../generated/prisma';
import { DocumentVO, DocumentType } from '../vo/document.vo';

type EntityProps = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  document: string;
  documentType: DocumentType;
  password: string;
  role?: RoleEnum;
  code?: string | null;
  instances?: Instance[];
  createdAt?: Date;
  updatedAt?: Date;
};

export class User extends Entity {
  firstName: string;
  lastName: string;
  email: string;
  document: string;
  documentType: DocumentType;
  password: string;
  role: RoleEnum;
  code?: string | null;
  instances?: Instance[];

  constructor(props: EntityProps) {
    super(props);

    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email;
    this.document = DocumentVO.create(props.document, props.documentType).value;
    this.documentType = props.documentType;
    this.password = this.setPassword(props.password);
    this.role = props.role ?? RoleEnum.USER;
    this.code = props.code;
    this.instances = props.instances;
  }

  private setPassword(password: string): string {
    if (!password) throw new BadRequestException('Senha deve ser informada');

    const bcryptRegex = /^\$2[aby]?\$\d{2}\$[./A-Za-z0-9]{53}$/;

    if (bcryptRegex.test(password)) {
      return password;
    }

    const salt = genSaltSync(10);
    return hashSync(password, salt);
  }

  async changePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    if (!this.password) {
      throw new BadRequestException('Senha não está definida.');
    }

    const isMatch = await compare(oldPassword, this.password);

    if (!isMatch) {
      throw new BadRequestException('Senha atual incorreta.');
    }

    this.password = this.setPassword(newPassword);
  }

  resetPasswordWithCode(code: string, newPassword: string) {
    if (!this.code || this.code !== code) {
      throw new BadRequestException('Código inválido ou expirado.');
    }

    this.password = this.setPassword(newPassword);
    this.code = undefined;
  }

  static generateCode(): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
  }

  isSuper() {
    return this.role === RoleEnum.SUPER;
  }

  isAdmin() {
    return this.role === RoleEnum.ADMIN;
  }

  isUser() {
    return this.role === RoleEnum.USER;
  }

  verifyPassword(password: string) {
    const compare = compareSync(password, this.password!);

    if (!compare) {
      throw new BadRequestException('Credenciais invalidas!');
    }
  }
}
