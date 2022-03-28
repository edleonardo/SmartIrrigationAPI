import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm'
import 'reflect-metadata'
import Device from './Device';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar'})
  name!: string;

  @Column({ type: 'varchar'})
  email!: string;

  @Column({ type: 'varchar'})
  password!: string;

  @OneToMany(() => Device, device => device.user_id)
  @JoinColumn({ name: 'user_id' })
  device!: Device
}

export default User;
