import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany} from 'typeorm';
import {Line} from "./line";

/**
 * 断裂伸长率
 */
@Entity()
export class BreakingElongation {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  value: number | undefined;

  @Column()
  createTime: number | undefined;

  @ManyToOne(() => Line, (line) => line.breakingElongations, {
    onDelete: 'CASCADE'
  })
  line: Line | undefined;

  @Column()
  position: string | undefined;

}
