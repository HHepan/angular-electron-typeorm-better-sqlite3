import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToMany, JoinTable} from 'typeorm';
import {Score} from "./score";
import {Location} from "./location";
import {DielectricParameter} from "./dielectric-parameter";
import {PartialDischarge} from "./partial-discharge";
import {LandingSectionTemperature} from "./landing-section-temperature";
import {Conductivity} from "./conductivity";
import {BreakdownFieldStrength} from "./breakdown-field-strength";
import {CarbonylIndex} from "./carbonyl-index";
import {Crystallinity} from "./crystallinity";
import {BreakingElongation} from "./breaking-elongation";
import {RecordType} from "./record-type";

@Entity()
export class Line {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  name: string | undefined;

  @Column({ type: "float" })
  voltage: number | undefined;

  @Column({ type: "float" })
  length: number | undefined;

  @Column()
  createTime: number | undefined;

  @Column({
    nullable: true
  })
  types: string | undefined;

  @OneToOne(() => Location)
  @JoinColumn()
  location1: Location | undefined;

  @OneToOne(() => Location)
  @JoinColumn()
  location2: Location | undefined;

  @OneToMany(() => Score, (score) => score.line)
  scores: Score[] | undefined;

  @OneToMany(
    () => DielectricParameter,
    (dielectricParameter) => dielectricParameter.line,
    {cascade: true}
  )
  dielectricParameters: DielectricParameter[] | undefined;

  @OneToMany(
    () => PartialDischarge,
    (partialDischarge) => partialDischarge.line
  )
  partialDischarges: PartialDischarge[] | undefined;

  @OneToMany(
    () => LandingSectionTemperature,
    (landingSectionTemperature) => landingSectionTemperature.line
  )
  landingSectionTemperatures: LandingSectionTemperature[] | undefined;

  @OneToMany(
    () => Conductivity,
    (conductivity) => conductivity.line
  )
  conductivities: Conductivity[] | undefined;

  @OneToMany(
    () => BreakdownFieldStrength,
    (breakdownFieldStrength) => breakdownFieldStrength.line
  )
  breakdownFieldStrengths: BreakdownFieldStrength[] | undefined;

  @OneToMany(
    () => CarbonylIndex,
    (carbonylIndex) => carbonylIndex.line
  )
  carbonylIndexes: BreakdownFieldStrength[] | undefined;

  @OneToMany(
    () => Crystallinity,
    (crystallinity) => crystallinity.line
  )
  crystallinitys: Crystallinity[] | undefined;

  @OneToMany(
    () => BreakingElongation,
    (breakingElongation) => breakingElongation.line
  )
  breakingElongations: BreakingElongation[] | undefined;

  @OneToMany(
    () => RecordType,
    (recordType) => recordType.line
  )
  recordTypes: RecordType[] | undefined;
}
