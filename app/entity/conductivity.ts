import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import {Line} from "./line";

/**
 * 电导率
 */
@Entity()
export class Conductivity {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: "float" })
  value1: number | undefined;

  @Column()
  value2: number | undefined;

  @Column()
  createTime: number | undefined;

  @Column()
  position: string | undefined;

  @ManyToOne(() => Line, (line) => line.conductivities, {
    onDelete: 'CASCADE'
  })
  line: Line | undefined;

}
