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
      3D Scan Configuration
    </v-card-title>
    <v-form ref="form" v-model="valid">
      <v-card-text>
        <v-text-field
          v-if="canChoose3DConfigAttribute('scanUrl')"
          :label="$t('projects.scan3d.scanUrl')"
          v-model="project3DScanConfigPayload.scanUrl"
          :rules="rules.requiredValidUrl"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          :disabled="!valid || !hasPayloadChanged"
          @click="submit3DScanConfig()"
        >
          {{ getActionName }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeUpsert3DScanConfigForm()">
          {{ $t('cancel') }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
    
<script lang="ts">
import Vue from 'vue';
import i18n from '@/i18n';
import { mapGetters, mapActions } from 'vuex';
import { GET_CURRENT_USER } from '@/store/users';
import {
  GET_CURRENT_PROJECT,
  GET_CURRENT_PROJECT_PARTICIPANTS,
  Project3dScanConfig,
  CREATE_PROJECT_3D_SCAN_CONFIG,
  UPDATE_PROJECT_3D_SCAN_CONFIG,
} from '@/store/project';
import { GET_ACDB } from '@/store/acdb';
import { concat, uniq, find, clone } from 'lodash-es';
export default Vue.extend({
  name: "ScanModelConfigurationCard",
  props: {
    project3DScanConfig: {
      type: Object as () => Project3dScanConfig,
      required: true,
    },
    closeUpsert3DScanConfigForm: {
      type: Function,
      required: true,
    },
  },
  data: () => {
    return {
      project3DScanConfigPayload: {} as Project3dScanConfig,
      valid: false,
      rules: {
        requiredValidUrl: [
          (v: string) => !!v || i18n.t('mandatoryField'),
          (v: string) => (/^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm).test(v) || i18n.t('invalidUrl')
        ],
      },
    };
  },
  methods: {
    ...mapActions({
      createProject3DScanConfig: CREATE_PROJECT_3D_SCAN_CONFIG,
      updateProject3DScanConfig: UPDATE_PROJECT_3D_SCAN_CONFIG
    }),
    canChoose3DConfigAttribute(attribute: string): boolean {
      if (this.isCreationMode)
        return (this as any).canCreate3DConfigAttribute().includes(attribute);

      return (this as any).canUpdate3DConfigAttribute().includes(attribute);
    },
    canCreate3DConfigAttribute() {
      const currentUser = this.currentUser;
      const currentParticipant = find(
        this.getProjectParticipants,
        participant => participant.userId === currentUser.id,
      );

      let attributes: string[] = this.getAcdb('create', 'project3DScanConfig')
        .filteringAttributes;

      if (this.currentProject.owner === this.currentUser.id) {
        attributes = concat(
          attributes,
          this.getAcdb('create', 'ownProject3DScanConfig').filteringAttributes,
        );
      }

      if (currentParticipant !== undefined) {
        attributes = concat(
          attributes,
          this.getAcdb('create', 'participatingProject3DScanConfig')
            .filteringAttributes as string[],
        );
      }

      return uniq(attributes);
    },
    canUpdate3DConfigAttribute() {
      const currentUser = this.currentUser;
      const currentParticipant = find(
        this.getProjectParticipants,
        participant => participant.userId === currentUser.id,
      );

      let attributes: string[] = this.getAcdb('update', 'project3DScanConfig')
        .filteringAttributes;

      if (this.currentProject.owner === this.currentUser.id)
        attributes = concat(
          attributes,
          this.getAcdb('update', 'ownProject3DScanConfig').filteringAttributes,
        );

      if (currentParticipant !== undefined)
        attributes = concat(
          attributes,
          this.getAcdb('update', 'participatingProject3DScanConfig')
            .filteringAttributes,
        );

      return uniq(attributes);
    },
    async submit3DScanConfig() {
      if (this.isCreationMode) {
        await (this as any).createProject3DScanConfig({...this.project3DScanConfigPayload, projectId: this.currentProject.id});
      } else {
        await (this as any).updateProject3DScanConfig({...this.project3DScanConfigPayload, projectId: this.currentProject.id});
      }
      this.closeUpsert3DScanConfigForm();
    },
  },
  computed: {
    ...mapGetters({
      currentUser: GET_CURRENT_USER,
      currentProject: GET_CURRENT_PROJECT,
      getProjectParticipants: GET_CURRENT_PROJECT_PARTICIPANTS,
      getAcdb: GET_ACDB,
    }),
    isCreationMode() {
      return !this.project3DScanConfig.id;
    },
    getActionName() {
      if (this.isCreationMode)
        return i18n.t('projects.scan3d.upload3DScanConfig');
      return i18n.t('save');
    },
    hasPayloadChanged() {
      if (this.isCreationMode) {
        return true;
      } else {
        const isSameScanUrl =
          this.project3DScanConfigPayload.scanUrl ==
          this.project3DScanConfig.scanUrl;

        return !isSameScanUrl;
      }
    },
  },
  watch: {
    project3DScanConfig: {
      immediate: true,
      handler: async function() {
        this.project3DScanConfigPayload = clone(this.project3DScanConfig);
      },
    },
  },
});
</script>