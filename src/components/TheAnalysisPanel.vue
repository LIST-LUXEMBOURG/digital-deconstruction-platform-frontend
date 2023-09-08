<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
    <div>
        <v-row dense>
            <v-col cols="6">
                <v-row dense>
                    <CircularityAnalysisChart :circularityAnalysis="circularityAnalysisElements"/>
                </v-row>
                <v-row dense>
                    <v-spacer></v-spacer>
                    <v-select
                        hint="Select a priority"
                        persistent-hint
                        :items="circularityOrderOptions"
                        :item-text="property => property.label"
                        :item-value="property => property.value"
                        v-model="circularityOrderSelection"
                        full-width
                        dense>
                    </v-select>
                    <v-spacer></v-spacer>
                    <v-select
                        hint="Select the top limit"
                        persistent-hint
                        :items="circularityLimitOptions"
                        v-model="circularityLimitSelection"
                        full-width
                        dense>
                    </v-select>
                    <v-spacer></v-spacer>
                </v-row>
            </v-col>
            <v-col cols="6">
                <v-row dense>
                    <MaterialAnalysisChart :quantityType='materialQuantitySelection' :materialTypesAnalysis="materialTypesAnalysis"/>
                </v-row>
                <v-row dense>
                    <v-spacer></v-spacer>
                    <v-select
                        hint="Select quantity type"
                        persistent-hint
                        :items="materialQuantityOptions"
                        v-model="materialQuantitySelection"
                        full-width
                        dense>
                    </v-select>
                    <v-spacer></v-spacer>
                </v-row>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
                <ReusePotentialAnalysisChart :elementTypesAnalysis="elementTypesAnalysis"/>
            </v-col>
            <v-col cols="6">
                <ReusePieChart :elementsMaterialsReuseArray="elementsMaterialsReuseSummary" />
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import CircularityAnalysisChart from '@/components/CircularityAnalysisChart.vue';
import MaterialAnalysisChart from '@/components/MaterialAnalysisChart.vue';
import ReusePotentialAnalysisChart from '@/components/ReusePotentialAnalysisChart.vue';
import ReuseDecisionAnalysisChart from '@/components/ReuseDecisionAnalysisChart.vue';
import ReusePieChart from '@/components/ReusePieChart.vue';
import {
    GET_CURRENT_PROJECT,
    GET_CIRCULARITY_ANALYSIS_ELEMENTS,
    GET_MATERIAL_TYPES_ANALYSIS,
    GET_ELEMENT_TYPES_ANALYSIS,
    FETCH_CIRCULARITY_ANALYSIS_ELEMENTS,
    FETCH_MATERIAL_TYPES_ANALYSIS,
    FETCH_ELEMENT_TYPES_ANALYSIS,
    FETCH_ELEMENTS_MATERIALS_REUSE_SUMMARY,
    GET_ELEMENTS_MATERIALS_REUSE_SUMMARY
} from '@/store/project';

export default Vue.extend({
    name: 'TheAnalysisPanel',
    components: { 
        CircularityAnalysisChart, 
        MaterialAnalysisChart, 
        ReusePotentialAnalysisChart,
        ReuseDecisionAnalysisChart,
        ReusePieChart
    },
    data:() => ({
        circularityOrderOptions: [
            { label:"Market value", value:"marketValue" },
            { label:"CO2 savings", value:"savingsCO2" },
            { label:"Social balance", value:"socialBalance" }
        ],
        circularityOrderSelection: "marketValue",
        circularityLimitOptions: [5, 10, 15, 30],
        circularityLimitSelection: 5,
        materialQuantityOptions: ["Volume", "Mass"],
        materialQuantitySelection: "Volume"
    }),
  methods: {
    ...mapActions({
        fetchCircularityAnalysisElements: FETCH_CIRCULARITY_ANALYSIS_ELEMENTS,
        fetchElementTypesAnalysis: FETCH_ELEMENT_TYPES_ANALYSIS,
        fetchMaterialTypesAnalysis: FETCH_MATERIAL_TYPES_ANALYSIS,
        fetchElementsMaterialsReuseSummary: FETCH_ELEMENTS_MATERIALS_REUSE_SUMMARY
    })
  },
  computed: {
    ...mapGetters({
        currentProject: GET_CURRENT_PROJECT,
        elementTypesAnalysis: GET_ELEMENT_TYPES_ANALYSIS,
        circularityAnalysisElements: GET_CIRCULARITY_ANALYSIS_ELEMENTS,
        materialTypesAnalysis: GET_MATERIAL_TYPES_ANALYSIS,
        elementsMaterialsReuseSummary: GET_ELEMENTS_MATERIALS_REUSE_SUMMARY
    })
  },
  async created() {
    await this.fetchCircularityAnalysisElements({
        projectId: this.currentProject.id,
        query: { 
            limit: this.circularityLimitSelection, 
            ordering: this.circularityOrderSelection
        } 
    });
    await this.fetchElementTypesAnalysis(this.currentProject.id,);
    await this.fetchMaterialTypesAnalysis(this.currentProject.id);
    await this.fetchElementsMaterialsReuseSummary();
  },
  watch: {
    async circularityOrderSelection(newValue, oldValue) {
        await this.fetchCircularityAnalysisElements({
            projectId: this.currentProject.id,
            query: { 
                limit: this.circularityLimitSelection, 
                ordering: newValue
            } 
        });
    },
    async circularityLimitSelection(newValue, oldValue) {
        await this.fetchCircularityAnalysisElements({
            projectId: this.currentProject.id,
            query: { 
                limit: newValue, 
                ordering: this.circularityOrderSelection
            } 
        });
    }
  }
});

</script>