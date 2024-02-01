import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ScoreComponent} from "./score/score.component";
import { DielectricParameterComponent } from './dielectric-parameter/dielectric-parameter.component';
import { PartialDischargeComponent } from './partial-discharge/partial-discharge.component';
import { LandingSectionTemperatureComponent } from './landing-section-temperature/landing-section-temperature.component';
import { ConductivityComponent } from './conductivity/conductivity.component';
import { BreakdownFieldStrengthComponent } from './breakdown-field-strength/breakdown-field-strength.component';
import { CarbonylIndexComponent } from './carbonyl-index/carbonyl-index.component';
import { CrystallinityComponent } from './crystallinity/crystallinity.component';
import { BreakingElongationComponent } from './breaking-elongation/breaking-elongation.component';
import {YzModalModule} from "../yz-modal/yz-modal.module";
import {ReactiveFormsModule} from "@angular/forms";
import {LineService} from "../../../services/line.service";
import {PartialDischargeService} from "../../../services/partial-discharge.service";
import {CommonService} from "../../../services/common.service";
import {LandingSectionTemperatureService} from "../../../services/landing-section-temperature.service";
import {BreakdownFieldStrengthService} from "../../../services/breakdown-field-strength.service";
import {CarbonylIndexService} from "../../../services/carbonyl-index.service";
import {CrystallinityService} from "../../../services/crystallinity.service";
import {BreakingElongationService} from "../../../services/breaking-elongation.service";
import {ChartModule} from "../charts/chart.module";
import {ConductivityService} from "../../../services/conductivity.service";
import {DielectricParameterService} from "../../../services/dielectricParameter.service";
import {DateInputRestrictionModule} from "../../../directive/DateInputRestrictionDirective";

@NgModule({
  declarations: [ScoreComponent, DielectricParameterComponent, PartialDischargeComponent, LandingSectionTemperatureComponent, ConductivityComponent, BreakdownFieldStrengthComponent, CarbonylIndexComponent, CrystallinityComponent, BreakingElongationComponent],
  exports: [
    DielectricParameterComponent,
    ScoreComponent,
    PartialDischargeComponent,
    LandingSectionTemperatureComponent,
    ConductivityComponent,
    BreakdownFieldStrengthComponent,
    CarbonylIndexComponent,
    CrystallinityComponent,
    BreakingElongationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    YzModalModule,
    ChartModule,
    DateInputRestrictionModule
  ],
  providers: [
    LineService,
    PartialDischargeService,
    CommonService,
    LandingSectionTemperatureService,
    BreakdownFieldStrengthService,
    CarbonylIndexService,
    CrystallinityService,
    BreakingElongationService,
    ConductivityService,
    DielectricParameterService
  ]
})
export class RecordModule { }
