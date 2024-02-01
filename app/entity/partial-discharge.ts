import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany} from 'typeorm';
import {Line} from "./line";

/**
 * 局部放电监测数据
 */
@Entity()
export class PartialDischarge {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  value: number | undefined;

  @Column()
  createTime: number | undefined;

  @Column()
  position: string | undefined;

  @ManyToOne(() => Line, (line) => line.partialDischarges, {
    onDelete: 'CASCADE'
  })
  line: Line | undefined;

}
