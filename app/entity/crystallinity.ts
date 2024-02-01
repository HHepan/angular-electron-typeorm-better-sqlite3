import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany} from 'typeorm';
import {Line} from "./line";

/**
 * 结晶度
 */
@Entity()
export class Crystallinity {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  value: number | undefined;

  @Column()
  createTime: number | undefined;

  @Column()
  position: string | undefined;

  @ManyToOne(() => Line, (line) => line.crystallinitys, {
    onDelete: 'CASCADE'
  })
  line: Line | undefined;

}
