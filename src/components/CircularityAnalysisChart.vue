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
import { CircularityAnalysis, CircularityResultElement  } from '@/store/project/types';

export default Vue.extend({
  name: 'CircularityAnalysisChart',
  props: {
    circularityAnalysis: { 
      required: true, 
      type: Object as () => CircularityAnalysis,
      default() { return {} as CircularityAnalysis  } 
    },
    chartHeight: {
      required: false,
      default: 380
    }
  },
  computed: {
    chartSeries(): any {
      const formattedSeries:any = [];
        this.circularityAnalysis.results.forEach((entry: CircularityResultElement) => {
          let seriesName = entry.elementName;
          if (entry.elementName == undefined) seriesName = "Rest"
            formattedSeries.push({
                name: seriesName,
                data:[entry.marketValue, entry.savingsCO2, entry.socialBalance]
            })
        });
      return formattedSeries;        
    },
    chartOptions(): any { 
      return {
        colors:[ '#2a7693', '#488f31', '#de425b', '#003f5c', '#2f4b7c', '#665191', '#a05195', '#d45087', '#f95d6a', '#ff7c43', '#ffa600' ],
        chart: {
          id:'circularityAnalysisBarChart',
          type:'bar',
          stacked: true,
          stackType: "100%",
          width: '100%',
          toolbar: { show: false }
        },
        xaxis: {
          categories: [ "Market Value", "CO2 Savings", "Social Balance"]
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        legend: {
          width: 280,
          position: 'right',
          horizontalAlign: 'right',
          offsetX: 1,
        },
      }
    }
  }
});

</script>
