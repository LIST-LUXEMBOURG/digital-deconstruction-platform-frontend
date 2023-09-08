<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
    <v-dialog v-model="dialogEnabled" max-width='700px' @click:outside="$emit('poiListDialogClosed')" @keydown.esc="$emit('poiListDialogClosed')">
        <v-card>
            <v-card-title class="justify-center">Points of Interest</v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="6">
                    <v-text-field 
                        clearable
                        type="text"
                        :clear-icon=mdiCloseCircle
                        v-model="searchValue"
                        label="search"
                        :append-outer-icon="mdiSearchWeb"
                        @click:append-outer="searchPois"
                        @keyup.enter="searchPois">
                    </v-text-field>
                    </v-col>
                    <v-col cols="3">
                    <v-select
                        v-model="searchProperty"
                        flat
                        hide-details
                        :items="searchQueryProperties"
                        prepend-inner-icon="mdi-magnify"
                        label="Sort by">
                    </v-select>
                    </v-col>
                    <v-col cols="3">
                    <v-select
                        v-model="searchQuery.direction"
                        flat
                        hide-details
                        :items="searchQueryDirections"
                        prepend-inner-icon="mdi-magnify"
                        label="Sort by">
                    </v-select>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-data-iterator :items="pointsOfInterest">
                <div v-for="poi in pointsOfInterest" :key="poi.name">
                <PointOfInterestView :poi="poi"/>
                </div>
            </v-data-iterator>
        </v-card>
    </v-dialog>
</template>


<script lang="ts">

import Vue from 'vue';

import { mapGetters } from 'vuex';
import PointOfInterestViewCard from '@/components/PointOfInterestViewCard.vue';
import { mdiSearchWeb, mdiCloseCircle } from '@mdi/js';
import { GET_CURRENT_PROJECT, FETCH_POINTS_OF_INTEREST, GET_POINTS_OF_INTEREST } from '@/store/project';

export default Vue.extend({
  name: 'PointsOfInterestListViewDialog',
  components: { PointOfInterestViewCard },
  props: {
    dialogEnabled: {
      required: true,
      default: false,
    }
  },
  data: () => ({
    // the model for searching data across POIs
    searchValue: '',
    searchProperty: 'name',
    searchQuery: {
        size: 10,
        name: '',
        description:'',
        weblink:'',
        property: "name",
        direction: "ascending"
    } as any,
    // icons
    mdiSearchWeb,
    mdiCloseCircle,
    // sample data
    searchQueryProperties: [
        'name', 'description', 'weblink'
    ],
    searchQueryDirections: [
        'ascending', 'descending'
    ],
  }),
  async created() {
    // fetch classifications
    let query = {
        size: 5,
        property: "name",
        direction: "ascending",
        name: '',
        description: '',
        weblink: ''
    };
    await this.$store.dispatch(FETCH_POINTS_OF_INTEREST, { projectId: this.currentProject.id, query });
  },
  computed: {
    ...mapGetters({
      currentProject: GET_CURRENT_PROJECT,
      pointsOfInterest: GET_POINTS_OF_INTEREST
    })
  },
  methods: {
    async searchPois(){
        let payload = { query: this.searchQuery, projectId: this.currentProject.id }
        await this.$store.dispatch(FETCH_POINTS_OF_INTEREST, payload);
    },
  },
  watch: {
    searchValue(newValue, oldValue) {
        if (newValue === null) this.searchQuery[this.searchProperty] = '';
        else this.searchQuery[this.searchProperty] = newValue;
    },
    searchProperty(newValue, oldValue) {
        this.searchQuery[newValue] = this.searchValue;
        this.searchQuery[oldValue] = '';
    }
  }
});
</script>