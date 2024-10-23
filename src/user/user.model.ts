import { Column, DefaultScope, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 't_user', comment: '用户表' })
export class User extends Model<User> {

  @Column
  username: string;

  @Column
  email: string;

  @Column
  password: string; // 可考虑使用加密存储
}
