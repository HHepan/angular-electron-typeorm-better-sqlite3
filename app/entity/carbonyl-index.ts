import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany} from 'typeorm';
import {Line} from "./line";

/**
 * 羰基指数
 */
@Entity()
export class CarbonylIndex {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: "float" })
  value: number | undefined;

  @Column()
  createTime: number | undefined;

  @Column()
  position: string | undefined;

  @ManyToOne(() => Line, (line) => line.carbonylIndexes, {
    onDelete: 'CASCADE'
  })
  line: Line | undefined;

}
