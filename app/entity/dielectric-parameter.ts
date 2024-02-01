import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany} from 'typeorm';
import {Line} from "./line";
import {DielectricParameterItem} from "./dielectric-parameter-item";

/**
 * 介电参数
 */
@Entity()
export class DielectricParameter {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  createTime: number | undefined;

  @ManyToOne(() => Line, (line) => line.dielectricParameters, {
    onDelete: 'CASCADE'
  })
  line: Line | undefined;

  @OneToMany(
    () => DielectricParameterItem,
    (dielectricParameterItem) => dielectricParameterItem.dielectricParameter,
  )
  dielectricParameterItems: DielectricParameterItem[] | undefined;

}
