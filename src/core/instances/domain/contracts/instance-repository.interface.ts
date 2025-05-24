import { InputParams } from '../../../@shared/domain/abstract/input-params';
import { OutputParams } from '../../../@shared/domain/abstract/output-params';
import { IBaseRepository } from '../../../@shared/domain/contracts/base-repository';
import { Instance } from '../entities/instance.entity';

export type InstanceFilter = string;

export class InstanceInputParams extends InputParams<InstanceFilter> {}

export class InstanceOutputParams extends OutputParams<Instance> {}

export interface IInstanceRepository
  extends IBaseRepository<
    InstanceInputParams,
    Instance,
    InstanceOutputParams
  > {}
