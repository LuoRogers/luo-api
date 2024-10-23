import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @Column
  username: string;

  @Column
  email: string;

  @Column
  password: string; // 可考虑使用加密存储
}
