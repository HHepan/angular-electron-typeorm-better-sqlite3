import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from 'typeorm';
@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  /**
   * 经度
   * */
  @Column({type: 'decimal', precision: 10, scale: 7})
  longitude: number | undefined;

  /**
   * 纬度
   * */
  @Column({type: 'decimal', precision: 10, scale: 7})
  latitude: number | undefined;
}
