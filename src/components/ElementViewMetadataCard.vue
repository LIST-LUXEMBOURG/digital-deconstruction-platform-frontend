<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
    <v-card :height='height'>
        <v-card-title>Metadata</v-card-title>
        <v-card-subtitle>
            <br>
            <v-row>
                <v-col>
                <b>Name:</b> {{ element.name }}<br>
                <b>Description:</b> {{ element.description }}<br>
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
                <v-col cols="2">
                <b>Type</b>
                </v-col>
                <v-col cols="10" v-if="elementType">
                <b>Name:</b> {{ elementType.name }}<br>
                <b>Description:</b> {{ elementType.description }}<br>
                <b>Category:</b> {{ elementType.category }}<br>
                <b>IfcType:</b> {{ elementType.ifcType }}<br>
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
                <v-col cols="2">
                <b>Identifiers</b>
                </v-col>
                <v-col cols="10">
                <b>DDC:</b> {{ element.uid }}<br>
                <b>IFC:</b> {{ element.ifcId }}<br>
                <b>Revit:</b> {{ element.revitId }}<br>
                </v-col>
            </v-row>
        </v-card-subtitle>
        <v-card-actions>
        <v-btn color="orange lighten-2" text @click="classificationExpandButtonEnabled = !classificationExpandButtonEnabled"> Classifications</v-btn>
        <v-spacer></v-spacer>
        <v-btn icon @click="classificationExpandButtonEnabled = !classificationExpandButtonEnabled">
            <v-icon>{{ classificationExpandButtonEnabled ? mdiChevronDoubleUp : mdiChevronDoubleDown }}</v-icon>
        </v-btn>
        </v-card-actions>
        <v-expand-transition>
            <div v-show="classificationExpandButtonEnabled">
                <v-divider></v-divider>
                <v-data-table

                    dense
                    :headers='classificationTabelHeaders'
                    :items='classificationEntries'
                    item-key="code"
                    hide-default-footer
                >
                </v-data-table>
            </div>
        </v-expand-transition>
    </v-card>
</template>

<script lang="ts">

import Vue from 'vue';

import { mdiChevronDoubleDown, mdiChevronDoubleUp} from '@mdi/js';

import { ClassificationEntry, ElementType } from '@/store/project';

export default Vue.extend({
  name: 'ElementViewMetadataCard',
  data: () => ({
    // icons
    mdiChevronDoubleDown,
    mdiChevronDoubleUp,
    classificationExpandButtonEnabled: true,
    classificationTabelHeaders: [
      {
        text: 'Label',
        value: 'label',
        sortable: false,
        width: "40%"
      },
      {
        text: 'Code',
        value: 'code',
        sortable: false,
        width: "30%"
      }
    ],
  }),
  props: {
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
    classificationEntries: {
        required:true,
        type: Array as () => ClassificationEntry[],
        default(){ return [] as ClassificationEntry[] }
    },
    height: {
        required: false,
        default: 520
    }
  }
});
</script>
          