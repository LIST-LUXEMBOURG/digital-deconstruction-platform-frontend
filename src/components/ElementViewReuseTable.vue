<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
    <v-card class="mx-auto" justify="space-around" align="right" :height="height">
        <v-card-title>Reuse Data</v-card-title>
        <v-simple-table>
            <template v-slot:default>
                <tbody>
                    <tr>
                        <td><v-icon md>{{mdiChevronDoubleUp}}</v-icon></td>
                        <td><b>Reuse Potential</b> </td>
                        <td><v-chip class="ma-2" :color='colorChip(element.reusePotential)' dark> {{ element.reusePotential || "n/a" }} </v-chip></td>
                    </tr>
                    <tr>
                        <td><v-icon md>{{mdiHammer}}</v-icon></td>
                        <td><b>Surface Damage</b> </td>
                        <td><v-chip class="ma-2" :color='colorChip(element.surfaceDamage)' dark> {{ element.surfaceDamage || "n/a" }} </v-chip></td>
                    </tr>
                    <tr>
                        <td><v-icon md>{{mdiTreeOutline}}</v-icon></td>
                        <td><b>Reuse decision</b> </td>
                        <td><v-chip class="ma-2" :color='colorChip(element.reuseDecision)' dark> {{ element.reuseDecision || "n/a" }} </v-chip></td>
                    </tr>
                    <tr>
                        <td><v-icon md>{{mdiHazardLights}}</v-icon></td>
                        <td><b>Hazard Assessment</b> </td>
                        <td><v-chip class="ma-2" :color='colorChip(element.hazardAssessment)' dark> {{ element.hazardAssessment || "n/a" }} </v-chip></td>
                    </tr>
                    <tr>
                        <td><v-icon md>{{mdiHazardLights}}</v-icon></td>
                        <td><b>Hazard Status</b> </td>
                        <td><v-chip class="ma-2" :color='colorChip(element.hazardAssessmentStatus)' dark> {{ element.hazardAssessmentStatus || "n/a" }} </v-chip></td>
                    </tr>
                    <tr>
                        <td><v-icon md>{{mdiStateMachine}}</v-icon></td>
                        <td><b>Status</b> </td>
                        <td><v-chip class="ma-2" :color='colorChip(element.status)' dark> {{ element.status || "n/a" }} </v-chip></td>
                    </tr>
                    <tr>
                        <td><v-icon md>{{mdiTriangleOutline}}</v-icon></td>
                        <td><b>Trademark</b> </td>
                        <td><v-chip class="ma-2" v-if="element.elementType" :color='colorChip(element.elementType.trademark)' dark> {{ element.elementType.trademark || "n/a" }} </v-chip></td>
                    </tr>
                    <tr>
                        <td><v-icon md>{{mdiMaterialDesign}}</v-icon></td>
                        <td><b>Designer</b> </td>
                        <td><v-chip class="ma-2" v-if="element.elementType" :color='colorChip(element.elementType.designer || null)' dark> {{ element.elementType.designer || "n/a" }} </v-chip></td>
                    </tr>
                    <tr>
                        <td><v-icon md>{{mdiGold}}</v-icon></td>
                        <td><b>Historical value</b> </td>
                        <td><v-chip class="ma-2" v-if="element.elementType" :color='colorChip(element.elementType.historicalValue || null)' dark> {{ element.elementType.historicalValue || "n/a" }} </v-chip></td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
    </v-card>
</template>

<script lang="ts">

import Vue from 'vue';
import {  mdiChevronDoubleUp, mdiHammer, mdiTreeOutline, mdiHazardLights, mdiStateMachine, mdiTriangleOutline, mdiMaterialDesign, mdiGold } from '@mdi/js';


export default Vue.extend({
  name: 'ElementViewReuseTable',
  data: () => ({
    // icons
    mdiChevronDoubleUp,
    mdiHammer,
    mdiTreeOutline,
    mdiHazardLights,
    mdiStateMachine,
    mdiTriangleOutline,
    mdiMaterialDesign,
    mdiGold,

  }),
  methods: {
    colorChip(attribute: any) {
      // if null or undefined
      if (attribute) {
        // reusePotential
        if (attribute > 0.7) return 'green';
        else if (attribute > 0.4) return 'orange';
        else if (attribute < 0.4) return 'red';
        // reuseDecision
        else if (attribute === "reuse") return 'green';
        else if (attribute === "recycling") return 'orange';
        else if (attribute === "backfilling") return 'red';
        // surfaceDamage
        else if (attribute === "high") return 'red';
        else if (attribute === "medium") return 'orange';
        else if (attribute === "low" ) return 'yellow';
        else if (attribute === "none") return 'green';
        // hazardAsessment
        else if (attribute === "requested") return 'red';
        else if (attribute === "in_progress") return 'yellow';
        else if (attribute === "finished" ) return 'green';
        // hazard
        else if (attribute === "no_hazard") return 'green';
        else if (attribute === "connection_only") return 'yellow';
        else if (attribute === "surface_only" ) return 'orange';
        else if (attribute === "overall" ) return 'red';
      }
      else return 'gray';
    },
  },
  props: {
    element: {
        required:true,
        default: {}
    },
    height: {
        required: false,
        default: 520
    }
  }
});
</script>
          