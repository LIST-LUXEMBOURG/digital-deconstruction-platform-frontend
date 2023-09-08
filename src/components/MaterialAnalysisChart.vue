<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-container>
    <apexchart ref="chart" :height="chartHeight" :options="chartOptions" :series="chartSeries"></apexchart>
  </v-container>
</template>

<script lang="ts">

import Vue from 'vue';
import { MaterialTypeAnalysis, MaterialTypesAnalysis  } from '@/store/project/types';

export default Vue.extend({
  name: 'MaterialAnalysisChart',
  props: {
    materialTypesAnalysis: { 
      required: true, 
      type: Object as () => MaterialTypesAnalysis,
      default() { return { materials: [] as MaterialTypeAnalysis[], overallMass: 0, overallVolume: 0 } as MaterialTypesAnalysis  } 
    },
    quantityType: {
      required: true,
      default: "Volume"
    },
    chartHeight: {
      required: false,
      default: 380
    }
  },
  data: () => ({
    overallQuantity: 0,
    chartTitle: "Volume"
  }),
  computed: {
    chartSeries(): Number[] {
      let newSeries: Number[] = [];
      if (this.quantityType == "Volume") {
        this.materialTypesAnalysis.materials.forEach((materialTypeAnalysis: MaterialTypeAnalysis) => {
          if (materialTypeAnalysis.totalVolume != 0)
          newSeries.push((materialTypeAnalysis.totalVolume / this.materialTypesAnalysis.overallVolume) * 100)
        });
        this.overallQuantity = this.materialTypesAnalysis.overallVolume;
        this.chartTitle = "Materials Volume"
      }
      if (this.quantityType == "Mass") {
        this.materialTypesAnalysis.materials.forEach((materialTypeAnalysis: MaterialTypeAnalysis) => {
          if (materialTypeAnalysis.totalMass != 0)
          newSeries.push((materialTypeAnalysis.totalMass / this.materialTypesAnalysis.overallMass) * 100)
        });
        this.overallQuantity = this.materialTypesAnalysis.overallMass;
        this.chartTitle = "Materials Mass"
      }
      return newSeries;
    },
    chartOptions(): any {
      return {
        colors:['#003f5c', '#2f4b7c', '#665191', '#a05195', '#d45087', '#f95d6a', '#ff7c43', '#ffa600', '#2a7693', '#488f31', '#de425b' ],
        labels: this.materialTypesAnalysis.materials.map(m=> m.name),
        plotOptions:{
          pie: {
            donut: {
              labels: {
                show: true,
                value: {
                  show: true,
                  formatter(value: string) {
                    return Math.round(parseFloat(value) * 100) / 100 + '%';
                  },
                },
                total: {
                  show: true,
                  color: '#1e1e1e',
                  label: this.chartTitle,
                  formatter: () => {
                    return Math.round(this.overallQuantity);
                  },
                },
              },
            },
          },
        },
        tooltip: {
          y: {
            formatter(value: number) {
              return Math.round(value * 100) / 100 + '%';
            },
          },
        },
        legend: {
          width: 300,
          position: 'right',
          horizontalAlign: 'right',
          offsetX: 1,
        },
        chart: {
            id:'reusePotentialChart',
            type:'donut',
            width: '100%',
            toolbar: { show: false }
        },
      }
    },        
  }
});

</script>
