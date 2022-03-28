import 'reflect-metadata'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('meterings')
class Metering {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar'})
  flow_rate!: string;

  @Column({ type: 'varchar'})
  device_id!: string;

  @Column({ type: 'varchar'})
  timeInstant!: string;

  @Column({ type: 'varchar'})
  humidity!: string;

  @Column({ type: 'varchar'})
  humiditySoil!: string;

  @Column({ type: 'varchar'})
  temperature!: string;

  @Column({ type: 'varchar'})
  commandInfo!: string;

  @Column({ type: 'varchar'})
  totalFlow!: string;
}

export default Metering;
