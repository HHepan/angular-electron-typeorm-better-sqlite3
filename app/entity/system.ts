import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from 'typeorm';
import {Line} from "./line";

/**
 * 系统设置
 */
@Entity()
export class System {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({unique: true})
  key: string | undefined;

  @Column()
  value: string | undefined;

  @Column()
  description: string | undefined;
}
