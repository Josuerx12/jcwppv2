import { BadRequestException } from '@nestjs/common';

export type DocumentType = 'cpf' | 'cnpj';

export class DocumentVO {
  private constructor(
    public readonly value: string,
    public readonly type: DocumentType,
  ) {}

  static create(document: string, documentType: DocumentType): DocumentVO {
    const cleanDocument = document.replace(/\D/g, '');
    DocumentVO.validate(cleanDocument, documentType);
    return new DocumentVO(cleanDocument, documentType);
  }

  static validate(document: string, documentType: DocumentType): void {
    if (!/^[0-9]+$/.test(document)) {
      throw new BadRequestException('O documento deve conter apenas números.');
    }
    if (documentType === 'cpf') {
      if (document.length !== 11) {
        throw new BadRequestException('CPF deve ter exatamente 11 dígitos.');
      }
      if (!DocumentVO.isValidCPF(document)) {
        throw new BadRequestException('CPF inválido.');
      }
    } else if (documentType === 'cnpj') {
      if (document.length !== 14) {
        throw new BadRequestException('CNPJ deve ter exatamente 14 dígitos.');
      }
      if (!DocumentVO.isValidCNPJ(document)) {
        throw new BadRequestException('CNPJ inválido.');
      }
    } else {
      throw new BadRequestException('Tipo de documento inválido.');
    }
  }

  // Validação real de CPF
  static isValidCPF(cpf: string): boolean {
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += Number(cpf.charAt(i)) * (10 - i);
    let firstCheck = 11 - (sum % 11);
    if (firstCheck >= 10) firstCheck = 0;
    if (firstCheck !== Number(cpf.charAt(9))) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += Number(cpf.charAt(i)) * (11 - i);
    let secondCheck = 11 - (sum % 11);
    if (secondCheck >= 10) secondCheck = 0;
    return secondCheck === Number(cpf.charAt(10));
  }

  // Validação real de CNPJ
  static isValidCNPJ(cnpj: string): boolean {
    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    let length = cnpj.length - 2;
    let numbers = cnpj.substring(0, length);
    const digits = cnpj.substring(length);
    let sum = 0;
    let pos = length - 7;
    for (let i = length; i >= 1; i--) {
      sum += Number(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== Number(digits.charAt(0))) return false;
    length = length + 1;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;
    for (let i = length; i >= 1; i--) {
      sum += Number(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return result === Number(digits.charAt(1));
  }
}
