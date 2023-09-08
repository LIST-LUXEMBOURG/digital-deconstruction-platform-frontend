<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
    <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <v-chip class="subtitle-2 text--secondary" color="white" v-on="on"> 
            {{ header.text }}
            <v-icon v-if="isFilterable">{{ mdiFilterVariant }}</v-icon>
          </v-chip>
          <v-col>
            <v-badge class="mr-3" :value="lastAppliedSelection !== ''" color='success' dot>
              {{ lastAppliedSelection }}
            </v-badge>
            <v-badge :value="lastAppliedOperator !== ''" color='success' dot>
              {{ lastAppliedOperator }} 
              {{ isNumericalFilter ? '' : lastAppliedTextValue }}
              {{ lastAppliedNumericalValue != -1 ? lastAppliedNumericalValue : '' }}
            </v-badge>
          </v-col>
        </template>
        <v-card v-if="isFilterable">
          <v-card-title>Filter {{ header.text }} </v-card-title>
          <v-card-actions>
            <v-btn 
              @click="updateOrder(orderingOptions[0])" 
              :depressed="ordering === orderingOptions[0]"
              :color='ordering === orderingOptions[0] ? "primary" : ""'
            ><v-icon>{{ mdiSortAscending }}</v-icon>
            </v-btn>
            <v-btn
              class="mr-5"
              @click="updateOrder(orderingOptions[1])" 
              :depressed="ordering === orderingOptions[1]"
              :color='ordering === orderingOptions[1] ? "primary" : ""'
              ><v-icon>{{ mdiSortDescending }}</v-icon>
            </v-btn>
            <div v-if="ordering != ''">
            {{ ordering === orderingOptions[0] ? "Ascending order" : "Descending order" }}
            </div>
          </v-card-actions>
          <div v-if="isNumericalFilter">
            <v-card-actions>
              <v-btn
                @click="updateOperator(numericalOperatorOptions[0])" 
                :depressed="filterOperator === numericalOperatorOptions[0]"
                :color='filterOperator === numericalOperatorOptions[0] ? "primary" : ""'
                ><v-icon>{{ mdiLessThanOrEqual }}</v-icon>
              </v-btn>
              <v-btn
                @click="updateOperator(numericalOperatorOptions[1])" 
                :depressed="filterOperator === numericalOperatorOptions[1]"
                :color='filterOperator === numericalOperatorOptions[1] ? "primary" : ""'
                ><v-icon>{{ mdiEqual }}</v-icon>
              </v-btn>
              <v-btn
                @click="updateOperator(numericalOperatorOptions[2])" 
                :depressed="filterOperator === numericalOperatorOptions[2]"
                :color='filterOperator === numericalOperatorOptions[2] ? "primary" : ""'
                ><v-icon>{{ mdiGreaterThanOrEqual }}</v-icon>
              </v-btn>
              <v-text-field 
                class="ml-2"
                type='number'
                solo
                @change="updateNumber"
                :value="numericalValue"
                label="number"
                dense
                hide-details
              ></v-text-field>
            </v-card-actions>
          </div>
          <div v-else>
            <v-card-actions v-if="isMultiChoiceFilter">
              <v-select
                solo
                :items="multipleChoiceOptions"
                @change="updateText"
                :value="textValue"
                label="text"
                dense
                hide-details
              ></v-select>
            </v-card-actions>
            <v-card-actions v-else>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="mr-2"
                    v-on="on"
                    @click="updateOperator(textOperatorOptions[0])" 
                    :depressed="filterOperator === textOperatorOptions[0]"
                    :color='filterOperator === textOperatorOptions[0] ? "primary" : ""'
                    ><v-icon>{{ mdiApproximatelyEqual }}</v-icon>
                  </v-btn>
                </template>
                <span>Similar</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="mr-2"
                    v-on="on"
                    @click="updateOperator(textOperatorOptions[1])"
                    :depressed="filterOperator === textOperatorOptions[1]"
                    :color='filterOperator === textOperatorOptions[1] ? "primary" : ""'
                    ><v-icon>{{ mdiNotEqual }}</v-icon>
                  </v-btn>
                </template>
                <span>Different</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="mr-2"
                    v-on="on"
                    @click="updateOperator(textOperatorOptions[2])"
                    :depressed="filterOperator === textOperatorOptions[2]"
                    :color='filterOperator === textOperatorOptions[2] ? "primary" : ""'>
                    <v-icon>{{ mdiEqual }}</v-icon>
                  </v-btn>
                </template>
                <span>Exact</span>
              </v-tooltip>
              <v-text-field
                class="ml-2"
                solo
                @change="updateText"
                :value="textValue"
                label="text"
                dense
                hide-details
              ></v-text-field>
            </v-card-actions>
          </div>
          <v-card-actions>
            <v-btn @click="resetFilter">Reset</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="applyFilter">Apply</v-btn>
          </v-card-actions>
        </v-card>
    </v-menu>
</template>

<script lang="ts">

import Vue from 'vue';

import {  mdiFilterVariant, 
          mdiSortAscending, 
          mdiSortDescending, 
          mdiLessThanOrEqual, 
          mdiGreaterThanOrEqual, 
          mdiEqual, 
          mdiApproximatelyEqual,
          mdiNotEqual } from '@mdi/js';
import { FilterQueryCondition, FilterQuerySelect, FilterQueryConditionExpression, FilterQuery } from '@/store/project/types';
import { DataTableHeader } from 'vuetify';

export default Vue.extend({
  name: 'TableItemFilterMenu',
  props:{
    header: {
      required: true,
      default: {} as DataTableHeader
    },
    isFilterable: {
      required: true,
      default: false
    },
    parentFilter: {
      required: false,
      type: Object as () => FilterQuery,
      default(){ return {} as FilterQuery }
    },
    fetchFunction: {
      required: false,
      type: Function as () => Function,
      default(){ return {} as Function }
    },
    isNumericalFilter: {
      required: false,
      default: false,
    },
    isMultiChoiceFilter: {
      required: false,
      default: false,
    },
    multipleChoiceOptions: {
      required: false,
      default(){ return [] as string[] }
    },
  },
  data() {
    return {
      mdiFilterVariant,
      mdiSortAscending,
      mdiSortDescending,
      mdiEqual,
      mdiLessThanOrEqual,
      mdiGreaterThanOrEqual,
      mdiApproximatelyEqual,
      mdiNotEqual,
      orderingOptions: ['ASC', 'DESC'],
      ordering: 'ASC',
      textValue: '',
      textOperatorOptions: ['LIKE', 'NOT_LIKE', 'EQUAL'],
      numericalValue: -1,
      numericalOperatorOptions: ['LOWER_OR_EQUAL', 'EQUAL', 'GREATER_OR_EQUAL'],
      filterOperator: '',
      lastAppliedNumericalValue: -1,
      lastAppliedTextValue: '',
      lastAppliedOperator: '',
      lastAppliedSelection: '',
      filterQuerySelect: {
        isActive: false,
        field: this.header.value,
        order: ''
      } as FilterQuerySelect,
      filterQueryCondition: {
        isActive: false,
        field: this.header.value,
        expression: {
          value: this.isNumericalFilter ? -1 : '',
          operator: this.isMultiChoiceFilter? 'EQUAL' : ''
        } as FilterQueryConditionExpression
      } as FilterQueryCondition,
    };
  },
  created() {
    // new instance of select and condition for the filter (shared with other filtering columns)
    if (this.parentFilter.selects) {
      this.parentFilter.selects.push(this.filterQuerySelect);
      this.parentFilter.conditions.push(this.filterQueryCondition);
    }
  },
  methods: {
    applyFilter() {
      this.fetchFunction();
      this.lastAppliedOperator = this.filterOperator;
      this.lastAppliedSelection = this.ordering;
      this.lastAppliedNumericalValue = this.numericalValue;
      this.lastAppliedTextValue = this.textValue;
    },
    resetFilter() {
      this.updateOperator('');
      this.updateOrder('');
      this.textValue = this.lastAppliedTextValue = '';
      this.numericalValue = this.lastAppliedNumericalValue = -1;
      this.lastAppliedOperator = this.lastAppliedSelection = '';
      this.fetchFunction();
    },
    updateText(newTextValue: string) {
      if (newTextValue && newTextValue.length > 0) {
        this.textValue = newTextValue;
        this.filterQueryCondition.expression.value = newTextValue;
      }
      if (this.isMultiChoiceFilter) {
        this.filterQueryCondition.isActive = true;
        this.filterQueryCondition.expression.operator = this.filterOperator = 'EQUAL';
      }
    },
    updateNumber(newNumberValue: number) {
      if (newNumberValue > -1) {
        this.filterQueryCondition.expression.value = this.numericalValue = newNumberValue;
        this.filterQueryCondition.expression.value = newNumberValue;
      }
    },
    updateOperator(newValue: any) {
      if (newValue === this.filterOperator || newValue === '') {
        this.filterQueryCondition.expression.operator = this.filterOperator = '';
        this.filterQueryCondition.isActive = false;
      } 
      else {
        this.filterQueryCondition.expression.operator = this.filterOperator = newValue;
        this.filterQueryCondition.isActive = true;
      }
    },
    updateOrder(newValue: '' | 'ASC' | 'DESC') {
      if (newValue === this.ordering || newValue === '') {
        this.filterQuerySelect.order = this.ordering = '';
        this.filterQuerySelect.isActive = false;
      } 
      else {
        this.filterQuerySelect.order = this.ordering = newValue;
        this.filterQuerySelect.isActive = true;
      }
    }
  }

});

</script>

<style lang="scss" scoped>
.user-details {
  position: absolute;
  z-index: 1;
  cursor: pointer;
}
</style>