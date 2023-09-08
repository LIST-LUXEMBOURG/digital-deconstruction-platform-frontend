<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-container fluid>
    <v-row>
      <v-col v-if="projects.length > 0" cols="auto" class="mr-auto">
        <v-btn color="primary" @click="toggleDisplay()">
          <v-icon left v-if="displayAsList">{{ mdiViewList }}</v-icon>
          <v-icon left v-else>{{ mdiViewGrid }}</v-icon>
          {{ displayAsList ? 'List' : 'Grid' }}
        </v-btn>
      </v-col>
      <v-col cols="auto" v-show="canCreateProject" class="ml-auto">
        <v-btn color="primary" @click="onCreate()">
          {{ $t('projects.createNewProject') }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="displayAsList" justify="center">
      <ProjectManagementTable/>
    </v-row>
    <v-row v-else>
      <ProjectManagementCard/>
    </v-row>
  </v-container>
</template>

<script lang="ts">

import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { mdiPlusCircleOutline, mdiViewList, mdiViewGrid } from '@mdi/js';
import { FETCH_SINGLE_ACDB, GET_ACDB } from '@/store/acdb';
import { GET_PROJECTS } from '@/store/project';
import ProjectManagementCard from '@/components/ProjectManagementCard.vue';
import ProjectManagementTable from '@/components/ProjectManagementTable.vue';

export default Vue.extend({
  name: 'ProjectManagementView',
  components: {
    ProjectManagementCard,
    ProjectManagementTable,
  },
  data() {
    return {
      mdiPlusCircleOutline,
      mdiViewGrid,
      mdiViewList,
      createProjectDialog: false,
      currentStep: 1,
      canCreateProject: false,
      displayAsList: false,
    };
  },
  methods: {
    ...mapActions({
      fetchSingleAcdb: FETCH_SINGLE_ACDB,
    }),
    onCreate() {
      this.$router.push({ name: 'Project' });
    },
    toggleDisplay() {
      this.displayAsList = !this.displayAsList;
    },
    goForwardInStepper() {
      if ((this as any).currentStep < 4) (this as any).currentStep++;
    },
    goBackwardInStepper() {
      if ((this as any).currentStep > 1) (this as any).currentStep--;
      else (this as any).createProjectDialog = false;
    },
    canCreateProject_() {
      let res = this.getAcdb('create', 'project').hasAccess;
      return res;
    },
  },
  computed: {
    ...mapGetters({
      getAcdb: GET_ACDB,
      projects: GET_PROJECTS,
    }),
  },
  async beforeMount() {
    await (this as any).fetchSingleAcdb({
      accessType: 'create',
      resourceName: 'project',
    });
    this.canCreateProject = (this as any).canCreateProject_();
  },
});

</script>