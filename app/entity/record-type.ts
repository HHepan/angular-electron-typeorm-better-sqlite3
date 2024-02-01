import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from 'typeorm';
import {Line} from "./line";

/**
 * 记录类型
 */
@Entity()
export class RecordType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name: string | undefined;

  @Column({ nullable: true })
  updateTime: number | undefined;

  @ManyToOne(() => Line, (line) => line.recordTypes, {
    onDelete: 'CASCADE'
  })
  line: Line | undefined;
}
