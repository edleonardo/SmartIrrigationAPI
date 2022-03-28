import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import User from './User';

@Entity('devices')
class Device {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  active!: boolean;

  @Column()
  device_id!: string;

  @Column()
  description!: string;

  @Column()
  last_metering!: string

  @ManyToOne(() => User, user => user.name)
  @JoinColumn({ name: 'user_id' })
  user_id!: string
}

export default Device;
