<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-card max-width="600" class="mx-auto" flat>
    <h1 class="text-center">
      {{ $t("resources.resources") }}
    </h1>
    <v-divider></v-divider>
    <v-container fluid>
      <v-data-table
        :items="filteredResourcesName"
        item-key="id"
        :sort-by="['name']"
        :footer-props="{ 'items-per-page-text': $t('itemsPerPageLabel') }"
        hide-default-header
        :hide-default-footer="hasResources()"
        :items-per-page="itemsPerPage"
      >
        <template v-slot:top>
          <v-text-field
            v-model="search"
            :prepend-icon="mdiMagnify"
            :label="searchLabel"
            single-line
            hide-details
            clearable
            @change="filterSearchResources"
            @keydown="filterResourcesOnKey"
            @click:clear="clearSearch"
          ></v-text-field>
        </template>
        <template v-slot:item="{ item }">
          <v-container>
            <v-row>
              <v-col cols="11">
                <h2>{{ item.name }}</h2>
              </v-col>
              <v-col cols="1">
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      v-on="on"
                      @click="displayResourcePrivileges(item.name)"
                    >
                      {{ mdiInformationOutline }}
                    </v-icon>
                  </template>
                  <span>{{
                    $t("resources.privileges", { resourceName: item.name })
                  }}</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-container>
          <v-divider></v-divider>
        </template>
        <template v-slot:no-results>
          <div class="footer">{{ $t("resources.noInformationAvailable") }}</div>
        </template>
        <template v-slot:no-data>
          <div class="footer">{{ $t("resources.noInformationAvailable") }}</div>
        </template>
      </v-data-table>

      <v-dialog
        v-model="isResourcePrivilegesDisplayed"
        class="ma-2"
        max-width="30.9em"
        scrollable
      >
        <v-card class="pa-2">
          <v-card-title>{{ $t("resources.privilegesRessource") }}</v-card-title>
          <v-card-text style="max-height: 50em;">
            <v-textarea
              v-model="resourcePrivileges"
              auto-grow
              readonly
              outlined
              no-resize
              dense
            />
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="hideResourcePrivileges">{{
              $t("close")
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import { mdiMagnify, mdiInformationOutline } from "@mdi/js";

import {
  FETCH_FILTERED_RESOURCES_NAME,
  GET_FILTERED_RESOURCES_NAME,
  FETCH_AND_RETURN_RESOURCE_PRIVILEGES_YAML,
} from "@/store/acdb";
import i18n from "@/i18n";

export default Vue.extend({
  name: "UserPrivilageTable",
  mounted() {
    this.fetchFilteredResourcesName();
  },
  data() {
    return {
      search: "",
      mdiMagnify,
      mdiInformationOutline,
      filteredResourcesName: [] as any[],
      isResourcePrivilegesDisplayed: false,
      resourceName: "",
      resourcePrivileges: "",
      itemsPerPage: 5,
    };
  },
  methods: {
    ...mapActions({
      fetchFilteredResourcesName: FETCH_FILTERED_RESOURCES_NAME,
      fetchAndReturnResourcePrivilegesYAML: FETCH_AND_RETURN_RESOURCE_PRIVILEGES_YAML,
    }),
    async displayResourcePrivileges(resourceName: string) {
      this.resourceName = resourceName;
      this.resourcePrivileges = await this.fetchAndReturnResourcePrivilegesYAML(
        resourceName
      );
      this.isResourcePrivilegesDisplayed = true;
    },
    hideResourcePrivileges() {
      this.resourceName = "";
      this.resourcePrivileges = "";
      this.isResourcePrivilegesDisplayed = false;
    },
    filterSearchResources(newFilterSearch: string) {
      this.filterResources(newFilterSearch);
    },
    filterResources(filterSearch: string) {
      this.fetchFilteredResourcesName(filterSearch);
    },
    filterResourcesOnKey(event: any) {
      if (["Tab", "Enter"].includes(event.key))
        this.filterResources(this.search);
    },
    clearSearch() {
      this.search = "";
      this.filterResources(this.search);
    },
    hasResources() {
      return this.filteredResourcesName.length === 0;
    },
  },
  computed: {
    ...mapGetters({
      getFilteredResourcesName: GET_FILTERED_RESOURCES_NAME,
    }),
    searchLabel: () => i18n.t("search"),
  },
  watch: {
    getFilteredResourcesName: function(
      newResourcesName: string[],
      oldResourcesName: string[]
    ) {
      this.filteredResourcesName = newResourcesName.map(
        (resourceName, index) => {
          return { id: index, name: resourceName };
        }
      );
    },
  },
});
</script>
