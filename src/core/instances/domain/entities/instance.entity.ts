import { Entity } from '../../../@shared/domain/abstract/entity';

type EntityProps = {
  id?: string;
  sessionId: string;
  userId: string;
  name: string;
  session?: any;
  user?: any;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Instance extends Entity {
  sessionId: string;
  userId: string;
  name: string;
  session: any;
  user?: any;

  constructor(props: EntityProps) {
    super(props);

    this.name = props.name;
    this.sessionId = props.sessionId;
    this.userId = props.userId;
    this.session = props.session;
    this.user = props.user;
  }
}
