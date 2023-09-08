<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
    <v-dialog v-model="dialogEnabled" fullscreen max-width="900px" @click:outside="$emit('elementInfoDialogClosed')" @keydown.esc="$emit('elementInfoDialogClosed')">
      <v-card>
        <v-card-title class="justify-center"> <h1>Deconstruction Element Information</h1><br></v-card-title>
        <br>
        <v-row>
          <v-col cols="5" offset="1">
            <ElementViewImageCarousel v-bind:elementImages="[]" v-bind:typeImages="getElementTypeImages" v-bind:placeHolderImages="sample.images"/>
          </v-col>
          <v-col cols="5" offset="-1">
            <PointOfInterestViewCard v-if="sample.poi" v-bind:poi="sample.poi"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="5" offset="1">
            <ElementViewReuseTable v-if="element" v-bind:element="element"/>
          </v-col>
          <v-col cols="5" offset="-1">
            <ElementViewMetadataCard v-if="element" v-bind:element="element" :elementType="elementType" :classificationEntries="classificationEntries"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="5" offset="1">
            <ElementViewPropertyTable v-if="element.properties" v-bind:properties="element.properties"/>
          </v-col>
          <v-col cols="5" offset="-1">
            <ElementViewMaterialTable v-if="element.materials" v-bind:materials="element.materials"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="5" offset="1">
            <ElementViewLotTable v-if="sample.lot" v-bind:lot="sample.lot"/>
          </v-col>
          <v-col cols="5" offset="-1">
            <ElementViewCircularityTable v-bind:circularities="aggregatedCircularities"/>
          </v-col>
        </v-row>
        <v-card-actions class="justify-center">
          <v-btn color="primary" text v-on:click="$emit('elementInfoDialogClosed')">
            Close
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>


<script lang="ts">

import Vue from 'vue';
import { mapGetters } from 'vuex';

import ElementViewImageCarousel from '@/components/ElementViewImageCarousel.vue';
import PointOfInterestViewCard from '@/components/PointOfInterestViewCard.vue';
import ElementViewReuseTable from '@/components/ElementViewReuseTable.vue';
import ElementViewMetadataCard from '@/components/ElementViewMetadataCard.vue';
import ElementViewPropertyTable from '@/components/ElementViewPropertyTable.vue';
import ElementViewMaterialTable from '@/components/ElementViewMaterialTable.vue';
import ElementViewLotTable from '@/components/ElementViewLotTable.vue';
import ElementViewCircularityTable from '@/components/ElementViewCircularityTable.vue';

import { Element, Circularity, Material, ElementType } from '@/store/project/types';
import { FETCH_CIRCULARITY_DOCUMENTS, GET_CURRENT_PROJECT, SET_AGGREGATED_CIRCULARITIES, GET_AGGREGATED_CIRCULARITIES } from '@/store/project';

import ddcBanner from "@/assets/banner.jpg";

export default Vue.extend({
  name: 'ElementViewDialog',
    components: {
      ElementViewImageCarousel,
      PointOfInterestViewCard,
      ElementViewReuseTable,
      ElementViewMetadataCard,
      ElementViewPropertyTable,
      ElementViewMaterialTable,
      ElementViewLotTable,
      ElementViewCircularityTable
  },
  data: () => ({
    // temporary sample data
    sample: {
      images: [ddcBanner],
      poi: {
        image: ddcBanner,
        name: "POI - name",
        date: "POI - date",
        description: "POI - description",
        location: "POI - location",
        webLink: "POI - weblink",
      },
      lot: {
        Reference: "Lot Name [Under Development]",
        Quantity: "2",
      },
    }
  }),
  computed: {
    ...mapGetters({
      currentProject: GET_CURRENT_PROJECT,
      aggregatedCircularities: GET_AGGREGATED_CIRCULARITIES
    }),
    classificationEntries() {
      if (this.elementType && this.elementType.classificationEntries) return this.elementType.classificationEntries;
      else return [];
    },
    getElementTypeImages(){
      if (this.elementType && this.elementType.files) {
        return this.element.elementType.files;
      }
      else return [];
    },
  },
  methods: {
    async retrieveCircularityData (circularity: Circularity, origin: string): Promise<Circularity> {
      let fetchedDocuments = await this.$store.dispatch(FETCH_CIRCULARITY_DOCUMENTS, circularity);
      circularity.documents = fetchedDocuments;
      if (fetchedDocuments.length > 0) {
        circularity.hasDocuments = true;
      } else circularity.hasDocuments = false;
      circularity.origin = origin;
      return circularity;
    },
    async aggregateElementCircularities() {
      const aggregatedCircularites = [] as Circularity[];
      if (this.element.circularities) {
        this.element.circularities.forEach(async (circularity: Circularity) => {
          const appendedCircularity = await (this as any).retrieveCircularityData(circularity, "Element");
          aggregatedCircularites.push(appendedCircularity);
        });
      }
      if (this.element.elementType && this.element.elementType.circularity) {
        const appendedCircularity = await (this as any).retrieveCircularityData(this.element.elementType.circularity, "Type")
        aggregatedCircularites.push(appendedCircularity);
      }
      if (this.element.materials) {
        this.element.materials.forEach(async (material: Material) => {
          if (material.materialType && material.materialType.circularity) {
            const appendedCircularity = await (this as any).retrieveCircularityData(material.materialType.circularity, "Material")
            aggregatedCircularites.push(appendedCircularity);
          }
        });
      }
      this.$store.commit(SET_AGGREGATED_CIRCULARITIES, aggregatedCircularites);
    }
  },
  props: {
    dialogEnabled: {
      required: true,
      default: false,
    },
    element: {
      required:true,
      type: Object as () => Element,
      default(){ return {} as Element }
    },
    elementType: {
        required:true,
        type: Object as () => ElementType,
        default(){ return {} as ElementType }
    },
  },
  watch:{
    async element(newValue, oldValue){
      if (newValue.uid) (this as any).aggregateElementCircularities();
    }
  }
});

</script>