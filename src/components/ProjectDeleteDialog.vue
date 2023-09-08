<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-card>
    <v-card-title class="text-h5">
      {{
        $t('projects.deleteProject', { projectName: selectedProject.shortName })
      }}
    </v-card-title>
    <v-card-text>
      {{
        $t('projects.deleteProjectConfirmation', {
          projectName: selectedProject.shortName,
        })
      }}
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="closeDelete">{{ $t('cancel') }}</v-btn>
      <v-btn color="error" @click="deleteElementConfirm">{{ $t('ok') }}</v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">

import Vue from 'vue';
import { mapActions } from 'vuex';
import { DELETE_PROJECT } from '@/store/project';

export default Vue.extend({
  name:"ProjectDeleteDialog",
  props: [
    'selectedProject',
    'closeDeleteProjectDialog',
    'closeDeleteProjectDialogOnConfirm',
  ],
  data: () => {
    return {
      dialogDelete: false,
    };
  },
  methods: {
    ...mapActions({
      deleteProject: DELETE_PROJECT,
    }),
    closeDelete() {
      this.closeDeleteProjectDialog();
    },
    async deleteElementConfirm() {
      await this.deleteProject(this.selectedProject.id);
      await this.closeDeleteProjectDialogOnConfirm();
    },
  },
});

</script>