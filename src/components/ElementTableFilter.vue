<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-menu :disabled="disabled" :close-on-content-click="false" v-model="open">
    <template v-slot:activator="{ on, attrs }">
      <v-btn-toggle :value="open ? 0 : undefined" @change="() => {}">
        <v-btn v-bind="attrs" v-on="on" outlined>
          Filters
        </v-btn>
        <v-btn
          :disabled="!inventoryFilterActive"
          color="primary"
          outlined
          :ripple="false"
          class="no-action-btn"
        >
          {{ inventoryFilterActive ? 'on' : 'off' }}
        </v-btn>
      </v-btn-toggle>
    </template>

    <v-card>
      <v-card-text>
        <v-row justify="end">
          <v-btn @click="open = false" icon small>
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-row>

        <v-row v-for="(item, i) in items" :key="item.name" align="center">
          <v-col style="text-align: center">
            <v-btn v-if="i !== 0" small icon @click.stop="removeColumn(i)">
              <v-icon>{{ icons.mdiFilterRemove }}</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="5">
            <v-select
              :items="columns"
              v-model="items[i].name"
              label="Column"
              dense
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="5">
            <v-text-field
              @input="input($event, i)"
              :value="items[i].value"
              label="Value"
              dense
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="addColumn"
          ><v-icon>{{ icons.mdiPlus }}</v-icon> Add filter</v-btn
        >
        <v-btn @click="resetFiltering">
          <v-icon>{{ icons.mdiRestore }}</v-icon>
          Reset
        </v-btn>
        <v-btn @click="applyFiltering" :disabled="!valid" color="primary"
          >Apply filtering</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { mdiFilterRemove, mdiPlus, mdiClose, mdiRestore } from '@mdi/js';
import {
  SET_INVENTORY_FILTER_ACTIVE,
  GET_INVENTORY_FILTER_ACTIVE,
  GET_CURRENT_PROJECT
} from '@/store/project';
const baseItem = {
  name: '',
  value: '',
};
export default Vue.extend({
  name:"ElementTableFilter",
  props: ['apply', 'baseColumns', 'disabled'],
  data: () => ({
      icons: {
        mdiFilterRemove,
        mdiPlus,
        mdiClose,
        mdiRestore,
      },
      open: false,
      items: [{ ...baseItem }],
      valid: false,
      toggleFilters: undefined,
  }),
  computed: {
      ...mapGetters({
      inventoryFilterActive: GET_INVENTORY_FILTER_ACTIVE,
      currentProject: GET_CURRENT_PROJECT,
    }),
    columns() {
      return this.baseColumns.map(
        (column: Record<string, string | boolean>) => {
          column.disabled = !!this.items.find(
            item => item.name === column.value,
          );
          return column;
        },
      );
    },
  },
  methods: {
    addColumn() {
      this.items.push({ ...baseItem });
    },
    removeColumn(index: number): void {
      // search column index in items

      this.items.splice(index, 1);
      // slice items
    },
    resetFiltering() {
      this.items = [{ ...baseItem }];
      this.$store.commit(SET_INVENTORY_FILTER_ACTIVE, false);
      this.$emit('filtering', { apply: true, filters: {} });
    },
    applyFiltering() {
      const formattedItems = this.items.reduce((acc, curr) => {
        acc[curr.name] = curr.value;
        return acc;
      }, {} as any);

      this.$store.commit(SET_INVENTORY_FILTER_ACTIVE, true);
      this.$emit('filtering', { apply: true, filters: formattedItems });
    },

    input($event: any, index: number) {
      this.items[index].value = $event;
    },
  },
  watch: {
    items: {
      deep: true,
      immediate: true,
      handler(newItems) {
        this.valid = newItems.every((item: Record<string, string>) => {
          return !!item.name && !!item.value;
        });
      },
    },
  },
});
</script>

<style scoped>
.no-action-btn {
  cursor: initial;
}
.no-action-btn::before {
  display: none;
}
</style>