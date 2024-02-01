import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from 'typeorm';
import {Line} from "./line";

/**
 * 评分
 */
@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  value: number | undefined;

  @Column()
  createTime: number | undefined;

  @ManyToOne(() => Line, (line) => line.scores, {
    onDelete: 'CASCADE'
  })
  line: Line | undefined;

}
