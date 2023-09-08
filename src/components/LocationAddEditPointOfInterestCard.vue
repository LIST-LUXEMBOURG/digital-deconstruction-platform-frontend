<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->
 
 <template>
  <v-card>
    <v-form v-model="isPOIOk">
      <v-card-title>{{ $t('projects.location.pointOfInterest') }}</v-card-title>

      <v-card-text>
        <v-text-field 
            v-model="pointOfInterest"
            :rules="rules.requiredValidUrl"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="primary" @click="closePOIForm">
          {{ $t('cancel') }}
        </v-btn>

        <v-btn
          :disabled="!isPOIOk || !havePOIChanged"
          color="primary"
          @click="saveCoordinates"
        >
          {{ $t('save') }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '@/i18n';
import { mapGetters, mapActions } from 'vuex';
import {
  GET_CURRENT_PROJECT,
  UPDATE_LOCATION_FROM_PROJECT,
} from '@/store/project';
export default Vue.extend({
  name: "LocationAddEditPointOfInterestCard",
  props: {
    location: {
      required: true,
      type: Object,
    },
    closePOIForm: {
      required: true,
      type: Function,
    },
  },
  data: () => {
    return {
      isPOIOk: false,
      pointOfInterest: '',
      rules: {
        requiredValidUrl: [
          (v: string) => !!v || i18n.t('mandatoryField'),
          (v: string) =>
            /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm.test(
              v,
            ) || i18n.t('invalidUrl'),
        ],
      },
    };
  },
  created() {
    (this as any).pointOfInterest = this.location.pointOfInterest;
  },
  methods: {
    ...mapActions({
      updateLocation: UPDATE_LOCATION_FROM_PROJECT,
    }),
    async saveCoordinates() {
      await (this as any).updateLocation({
        id: (this as any).location.id,
        projectId: this.currentProject.id,
        pointOfInterest: (this as any).pointOfInterest,
      });

      (this as any).closePOIForm();
    },
  },
  computed: {
    ...mapGetters({
      currentProject: GET_CURRENT_PROJECT,
    }),
    havePOIChanged: function() {
      return this.location.pointOfInterest !== (this as any).pointOfInterest;
    },
  },
});
</script>