<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-container>
    <apexchart :height="chartHeight" :options="chartOptions" :series="chartSeries"></apexchart>
  </v-container>
</template>

<script lang="ts">

import Vue from 'vue';
import { ElementTypesAnalysis  } from '@/store/project/types';

export default Vue.extend({
  name: 'ReusePotentialAnalysisChart',
  props: {
    elementTypesAnalysis: { 
      required: true, 
      type: Object as () => ElementTypesAnalysis,
      default() { return {} as ElementTypesAnalysis  } 
    },
    chartHeight: {
      required: false,
      default: 380
    }
  },
  computed: {
    chartSeries(): any {
        const reuseSeries = [0,0,0,0];
        if (this.elementTypesAnalysis.potentialBackfillingCount) {
          reuseSeries[0] = Number(this.elementTypesAnalysis.potentialBackfillingCount / this.elementTypesAnalysis.count *100);
        }
        if (this.elementTypesAnalysis.potentialRecyclingCount) {
          reuseSeries[1] = Number(this.elementTypesAnalysis.potentialRecyclingCount / this.elementTypesAnalysis.count *100);
        }
        if (this.elementTypesAnalysis.potentialReuseCount) {
          reuseSeries[2] = Number(this.elementTypesAnalysis.potentialReuseCount / this.elementTypesAnalysis.count *100);
        }
        if (this.elementTypesAnalysis.potentialUndefinedCount) {
          reuseSeries[3] = Number(this.elementTypesAnalysis.potentialUndefinedCount / this.elementTypesAnalysis.count *100);
        }

        return reuseSeries;    
      },
    chartOptions(): any {
      return {
        labels: ['Backfilling Potential', 'Recylcing Potential', 'Reuse Potential', 'Undefined'] as string[],
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
                  label: "Elements Reuse Potential",
                  formatter: () => {
                    return this.elementTypesAnalysis.count;
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
