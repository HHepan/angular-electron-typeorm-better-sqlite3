import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany} from 'typeorm';
import {Line} from "./line";

/**
 * 击穿场强
 */
@Entity()
export class BreakdownFieldStrength {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  value: number | undefined;

  @Column()
  createTime: number | undefined;

  @Column()
  position: string | undefined;

  @ManyToOne(() => Line, (line) => line.breakdownFieldStrengths, {
    onDelete: 'CASCADE'
  })
  line: Line | undefined;

}
