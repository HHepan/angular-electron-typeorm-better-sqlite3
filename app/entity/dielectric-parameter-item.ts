import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from 'typeorm';
import {DielectricParameter} from "./dielectric-parameter";

/**
 * 介电参数项
 */
@Entity()
export class DielectricParameterItem {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: 'float' })
  frequency: number | undefined;

  @Column({ type: 'float' })
  value: number | undefined;

  // 测试电压值
  @Column({ type: "float" })
  V: number | undefined;

  @ManyToOne(
    () => DielectricParameter,
    (dielectricParameter) => dielectricParameter.dielectricParameterItems, {
      onDelete: 'CASCADE'
    }
  )
  dielectricParameter: DielectricParameter | undefined;

}
