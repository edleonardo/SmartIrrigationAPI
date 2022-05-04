import 'reflect-metadata'
import { Entity, Column, PrimaryGeneratedColumn, Double } from 'typeorm';

@Entity('meterings')
class Metering {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar'})
  flow_rate!: string;

  @Column({ type: 'varchar'})
  device_id!: string;

  @Column({ type: 'varchar'})
  time_instant!: string;

  @Column({ type: 'float'})
  humidity!: Double;

  @Column({ type: 'float'})
  humidity_soil!: Double;

  @Column({ type: 'float'})
  temperature!: Double;

  @Column({ type: 'boolean'})
  commandInfo!: boolean;

  @Column({ type: 'varchar'})
  totalFlow!: string;

  @Column({ type: 'int8' })
  created_at!: number
}

export default Metering;
