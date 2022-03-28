import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import 'reflect-metadata'
import User from './User';

@Entity('devices')
class Device {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar'})
  name!: string;

  @Column({ type: 'boolean' })
  active!: boolean;

  @Column({ type: 'varchar'})
  device_id!: string;

  @Column({ type: 'varchar'})
  description!: string;

  @Column({ type: 'varchar'})
  last_metering!: string

  @ManyToOne(() => User, user => user.name)
  @JoinColumn({ name: 'user_id' })
  user_id!: string
}

export default Device;
