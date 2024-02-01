import {Component, Input} from '@angular/core';
import {ECharts, EChartsOption} from "echarts";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {
  viewInit = false;
  echartsOption: EChartsOption;
  // echarts 实例
  echarts: ECharts | undefined;

  @Input()
  mergeOption: EChartsOption = {} as EChartsOption;

  constructor() {
    this.echartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          animation: false,
          label: {
            backgroundColor: '#ccc',
            borderColor: '#aaa',
            borderWidth: 1,
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            color: '#222'
          }
        }
      },
      grid: {
        top: 30,
        left: 40,
        right: 10,
        bottom: 20
      },
      minorTick: {
        show: true
      },
      minorSplitLine: {
        show: true
      },
      xAxis: {
        name: '',
        data: []
      },
      yAxis: {
        name: '',
        minorTick: {
          show: true
        },
        minorSplitLine: {
          show: true
        }},
      series: [
        {
          data: [],
          type: 'line',
          smooth: true
        }
      ]
    };
  }

  onChartInit(echarts: any) {
    this.echarts = echarts;
    this.viewInit = true;
    this.echarts?.setOption(this.mergeOption);
  }

}
