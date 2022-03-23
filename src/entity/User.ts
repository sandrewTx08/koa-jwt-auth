import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn()
  id?: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  enable: boolean;

  @Column()
  email: string;

  @Column()
  refresh_token: string;
}
