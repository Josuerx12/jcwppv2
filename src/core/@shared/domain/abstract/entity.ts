type Props = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
export abstract class Entity {
  id?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: Props) {
    this.id = props.id;

    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }
}
