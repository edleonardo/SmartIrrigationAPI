import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('meterings')
class Metering {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  flow_rate!: string;

  @Column()
  device!: string;

  @Column()
  timeInstant!: string;

  @Column()
  humidity!: string;

  @Column()
  humiditySoil!: string;

  @Column()
  temperature!: string;

  @Column()
  commandInfo!: string;

  @Column()
  totalFlow!: string;
}

export default Metering;
