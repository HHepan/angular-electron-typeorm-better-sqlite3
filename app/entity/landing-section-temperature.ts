import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany} from 'typeorm';
import {Line} from "./line";

/**
 * 登录段最高温度
 */
@Entity()
export class LandingSectionTemperature {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  value: number | undefined;

  @Column()
  createTime: number | undefined;

  @ManyToOne(() => Line, (line) => line.landingSectionTemperatures, {
    onDelete: 'CASCADE'
  })
  line: Line | undefined;

}
