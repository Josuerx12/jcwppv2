import { BadRequestException } from '@nestjs/common';
import { IUseCase } from '../../../@shared/domain/contracts/use-case';
import { IUserRepository } from '../../domain/contracts/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { DocumentType } from '../../domain/vo/document.vo';
import { MailerService } from '@nestjs-modules/mailer';
import { WelcomeEmailHTML } from '../../domain/mail/welcome-mail';

export class RegisterUseCase implements IUseCase<RegisterUseCase.Input, void> {
  constructor(
    private readonly repository: IUserRepository,
    private readonly mail: MailerService,
  ) {}
  async execute(input: RegisterUseCase.Input): Promise<void> {
    const emailInUse = await this.repository.verifyEmailInUse(input.email);
    if (emailInUse) {
      throw new BadRequestException('Email já está em uso.');
    }

    const documentInUse = await this.repository.verifyDocumentInUse(
      input.document,
    );
    if (documentInUse) {
      throw new BadRequestException('Documento já em uso.');
    }

    const user = new User(input);

    await this.repository.store(user);
    await this.mail.sendMail({
      to: user.email,
      subject: `🎉 Bem-vindo(a) à nossa plataforma, ${user.firstName}!`,
      html: WelcomeEmailHTML(user),
    });
  }
}

export namespace RegisterUseCase {
  export interface Input {
    firstName: string;
    lastName: string;
    email: string;
    documentType: DocumentType;
    document: string;
    password: string;
  }
}
