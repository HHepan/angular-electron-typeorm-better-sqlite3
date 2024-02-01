import {Item} from "./entity/item";
import {DataSource} from "typeorm";
import {Line} from "./entity/line";
import {BreakdownFieldStrength} from "./entity/breakdown-field-strength";
import {BreakingElongation} from "./entity/breaking-elongation";
import {CarbonylIndex} from "./entity/carbonyl-index";
import {Conductivity} from "./entity/conductivity";
import {Crystallinity} from "./entity/crystallinity";
import {DielectricParameter} from "./entity/dielectric-parameter";
import {DielectricParameterItem} from "./entity/dielectric-parameter-item";
import {LandingSectionTemperature} from "./entity/landing-section-temperature";
import {PartialDischarge} from "./entity/partial-discharge";
import {Score} from "./entity/score";
import {Location} from "./entity/location";
import {MAIN_CONFIG} from "./environment.main";
import {System} from "./entity/system";
import {RecordType} from "./entity/record-type";

export const AppDataSource = new DataSource({
  type: "better-sqlite3", // 设定链接的数据库类型
  database: MAIN_CONFIG.dataBaseUrl, // 数据库存放地址
  synchronize: true, // 确保每次运行应用程序时实体都将与数据库同步
  logging: ['error','warn'], // 日志，默认在控制台中打印，数组列举错误类型枚举
  entities: [
    Item,
    Line,
    BreakdownFieldStrength,
    BreakingElongation,
    CarbonylIndex,
    Conductivity,
    Crystallinity,
    DielectricParameter,
    DielectricParameterItem,
    LandingSectionTemperature,
    PartialDischarge,
    Score,
    Location,
    System,
    RecordType
  ], // 实体或模型表
})
