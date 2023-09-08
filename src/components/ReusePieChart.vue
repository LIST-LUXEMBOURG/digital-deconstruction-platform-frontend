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
import { ElementTypesAnalysis, ElementsMaterialsReuseQuantity  } from '@/store/project/types';

export default Vue.extend({
  name: 'ReusePieChart',
  props: {
    elementTypesAnalysis: { 
      required: false, // for the element view
      type: Object as () => ElementTypesAnalysis,
      default() { return {} as ElementTypesAnalysis  } 
    },
    elementsMaterialsReuseArray: {
      required: false, // for the materials quantities view
      type: Array as () => ElementsMaterialsReuseQuantity[],
      default() { return [] as ElementsMaterialsReuseQuantity[]  } 
    },
    chartHeight: {
      required: false,
      default: 380
    }
  },
  computed: {
    chartSeries(): any {
        let reuseSeries = [0,0,0,0];
        if (this.elementTypesAnalysis.count > 0) {
            reuseSeries[0] = Number(this.elementTypesAnalysis.decisionBackfillingCount / this.elementTypesAnalysis.count *100);
            reuseSeries[1] = Number(this.elementTypesAnalysis.decisionRecyclingCount / this.elementTypesAnalysis.count *100);
            reuseSeries[2] = Number(this.elementTypesAnalysis.decisionReuseCount / this.elementTypesAnalysis.count *100);
            reuseSeries[3] = Number(this.elementTypesAnalysis.decisionUndefinedCount / this.elementTypesAnalysis.count *100);
        } else if (this.elementsMaterialsReuseArray.length > 0) {
            this.elementsMaterialsReuseArray.forEach(reuseQuantity => {
                if (reuseQuantity.reuseDecision === 'backfilling') {
                    reuseSeries[0] = Number(reuseQuantity.totalVolume / this.totalVolumes *100);
                }
                else if (reuseQuantity.reuseDecision === 'recycling') {
                    reuseSeries[1] = Number(reuseQuantity.totalVolume / this.totalVolumes *100);
                }
                else if (reuseQuantity.reuseDecision === 'reuse') {
                    reuseSeries[2] = Number(reuseQuantity.totalVolume / this.totalVolumes *100);
                }
                else if (reuseQuantity.reuseDecision === 'undefined') {
                    reuseSeries[3] = Number(reuseQuantity.totalVolume / this.totalVolumes *100);
                }
            });
        }
        return reuseSeries;    
      },
    totalVolumes(): number {
      const totalVolumes = this.elementsMaterialsReuseArray.map(item => Number(item.totalVolume)).reduce((sum, current) => { return sum + current }, 0);
      return totalVolumes;
    },
    chartOptions(): any {
      return {
        labels: ['Backfiling Decision', 'Recylcing Decision', 'Reuse Decision', 'Undefined'] as string[],
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
                  label: "Elements Reuse Decision",
                  formatter: () => {
                    if (this.elementTypesAnalysis.count) return this.elementTypesAnalysis.count;
                    else if (this.elementsMaterialsReuseArray.length > 0) return this.totalVolumes.toFixed(3);
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
