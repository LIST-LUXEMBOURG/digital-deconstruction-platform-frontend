<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-card>
    <v-card-title>
      BIM Model Configuration
    </v-card-title>
    <v-form ref="form" v-model="valid">
      <v-card-text>
        <div>
          The <b>Client ID</b> and <b>Client secret</b> can be found in
          <a href="https://forge.autodesk.com/en/docs/" target="_blank">
            Autodesk API
          </a>
        </div>
        <br />
        <div>
          For security reasons the following information will not be shared
          again in the application.
        </div>
        <v-text-field
          :label="$t('projects.bimModel.clientId')"
          :rules="required()"
          v-model="form.clientId"
          required
        ></v-text-field>
        <v-text-field
          :label="$t('projects.bimModel.clientSecret')"
          :rules="required()"
          v-model="form.clientSecret"
          type="password"
          autocomplete="cs"
          required
        ></v-text-field>
        <v-row>
          <v-col cols="8">
            <v-text-field
              :label="$t('projects.bimModel.urn')"
              :rules="required()"
              v-model="form.urn"
              autocomplete="cs"
              required
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              :items="zones"
              :label="$t('projects.bimModel.zone')"
              v-model="form.zone"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn :disabled="!valid" @click="verifyAutodeskCredentials()"
              >Verify</v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeDialog()">
          {{ $t('cancel') }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import Vue from 'vue';
import i18n from '@/i18n';
import { mapActions, mapGetters } from 'vuex';
import {
  SAVE_AUTODESK_CREDENTIALS,
  GET_CURRENT_PROJECT,
  GET_AUTODESK_ACCESS_TOKEN,
} from '@/store/project';
import { GET_CURRENT_USER } from '@/store/users';
import { FETCH_MULTIPLE_ACDB } from '@/store/acdb';

export default {
  name: "ReverseModelConfigurationDialog",
  props: {
    closeDialog: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      valid: false,
      form: {
        clientId: '',
        clientSecret: '',
        urn: '',
        zone: 'US',
      },
      zones: ['US', 'EU'],
    };
  },

  methods: {
    ...mapActions({
      saveAutodeskCredentials: SAVE_AUTODESK_CREDENTIALS,
      fetchMultipleAcdb: FETCH_MULTIPLE_ACDB,
    }),

    required() {
      return [v => !!v || this.$i18n.t('requiredField')];
    },

    async verifyAutodeskCredentials() {
      const res = await this.saveAutodeskCredentials({
        projectId: this.currentProject.id,
        clientId: this.form.clientId,
        clientSecret: this.form.clientSecret,
        urn: this.form.urn,
        zone: this.form.zone,
      });
      if (
        res &&
        'message' in res &&
        res.message === 'autodeskCredentialsNotFound'
      )
        return;

      this.closeDialog();
      this.$refs.form.reset();
    },
  },

  computed: {
    ...mapGetters({
      currentUser: GET_CURRENT_USER,
      currentProject: GET_CURRENT_PROJECT,
      autodeskAccessToken: GET_AUTODESK_ACCESS_TOKEN,
    }),
    isCreationMode() {
      return (
        !this.autodeskAccessToken && !this.autodeskAccessToken.access_token
      );
    },
    getActionName() {
      if (this.isCreationMode) return i18n.t('save');
      return i18n.t('update');
    },
  },
};
</script>

<style>
</style>