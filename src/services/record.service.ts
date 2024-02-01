import {Injectable} from "@angular/core";
import {DielectricParameterService} from "./dielectricParameter.service";
import {ConductivityService} from "./conductivity.service";
import {BreakingElongationService} from "./breaking-elongation.service";
import {CarbonylIndexService} from "./carbonyl-index.service";
import {CrystallinityService} from "./crystallinity.service";
import {BreakdownFieldStrengthService} from "./breakdown-field-strength.service";
import {BreakdownFieldStrength} from "../../app/entity/breakdown-field-strength";
import {Score} from "../../app/entity/score";
import {recordKey} from "../app/key";
import {ScoreService} from "./score.service";
import {Line} from "../../app/entity/line";

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private baseUrl = 'record' + '-';
  constructor(private scoreService: ScoreService,
              private dielectricParameterService: DielectricParameterService,
              private conductivityService: ConductivityService,
              private breakingElongationService: BreakingElongationService,
              private carbonylIndexService: CarbonylIndexService,
              private crystallinityService: CrystallinityService,
              private breakdownFieldStrengthService: BreakdownFieldStrengthService) {}

  async save(recordTypes: string[], lineId: number) {
    // console.log('save', lineId);
    let min = 100;
    let breakdownFieldStrength = undefined as unknown as BreakdownFieldStrength;
    // 击穿场强
    if (recordTypes.includes(recordKey.breakdownFieldStrength)) {
      breakdownFieldStrength = await this.breakdownFieldStrengthService.getTopOne(lineId);
      const point = this.breakdownFieldStrengthService.getPoint(breakdownFieldStrength);
      min = Math.min(min, point);
      // console.log('breakdownFieldStrength', point, min, breakdownFieldStrength);
    }
    // 电导率
    if (recordTypes.includes(recordKey.conductivity)) {
      const conductivity = await this.conductivityService.getTopOne(lineId);
      const point = this.conductivityService.getPoint(conductivity);
      min = Math.min(min, point);
      // console.log('conductivity', point, min, conductivity);
    }
    // 断裂伸长率
    if (recordTypes.includes(recordKey.breakingElongation)) {
      const breakingElongation = await this.breakingElongationService.getTopOne(lineId);
      const point = this.breakingElongationService.getPoint(breakingElongation);
      min = Math.min(min, point);
      // console.log('breakingElongation', point, min);
    }
    // 羰基指数
    if (recordTypes.includes(recordKey.carbonylIndex)) {
      const carbonylIndex = await this.carbonylIndexService.getTopOne(lineId);
      const point = this.carbonylIndexService.getPoint(carbonylIndex, breakdownFieldStrength);
      min = Math.min(min, point);
      // console.log('carbonylIndex', point, min);
    }
    // 结晶度
    if (recordTypes.includes(recordKey.crystallinity)) {
      const crystallinity = await this.crystallinityService.getTopOne(lineId);
      const point = this.crystallinityService.getPoint(crystallinity, breakdownFieldStrength);
      min = Math.min(min, point);
      // console.log('crystallinity', point, min);
    }
    // 介电损耗因素
    if (recordTypes.includes(recordKey.dielectricParameter)) {
      const dielectricParameter = await this.dielectricParameterService.getTopOne(lineId);
      const point = this.dielectricParameterService.getPoint(dielectricParameter, breakdownFieldStrength);
      min = Math.min(min, point);
      // console.log('dielectricParameter', point, min);
    }
    min = min < 0 ? 0 : Math.round(min);
    const data = {} as { createTime: number; lineId: number | undefined; value: number | null | undefined };
    data.value = min;
    data.createTime = new Date().getTime();
    data.lineId = lineId;
    this.scoreService.add(data);
  }

}
