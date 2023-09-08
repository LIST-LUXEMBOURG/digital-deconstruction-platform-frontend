<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
    <v-card>
        <v-list dense>
          <v-list-item
            @click="displayUpsertDocumentDialog()"
            :disabled="!canUpdateProjectDocument()"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ $t('edit') }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            @click="downloadProjectDocument()"
            :disabled="!canDownloadProjectDocument()"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ $t('download') }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            @click="displayDeleteDocumentDialog()"
            :disabled="!canDeleteProjectDocument()"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ $t('delete') }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: "DocumentOptionMenu",
    props:{
        displayUpsertDocumentDialog: {
            type: Function,
            required: true
        },
        downloadProjectDocument: {
            type: Function,
            required: true
        },
        displayDeleteDocumentDialog: {
            type: Function,
            required: true
        },
        canUpdateProjectDocument: {
            type: Function,
            required: true
        },
        canDownloadProjectDocument: {
            type: Function,
            required: true
        },
        canDeleteProjectDocument: {
            type: Function,
            required: true
        }
    }
})
</script>