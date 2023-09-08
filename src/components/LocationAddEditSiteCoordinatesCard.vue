<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->
 
 <template>
  <v-card>
    <v-form>
      <v-card-title>{{ $t('projects.location.siteCoordinates') }}</v-card-title>

      <v-card-text>
        <v-text-field v-model="siteCoordinates"></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="primary" @click="closeCoordinatesForm">
          {{ $t('cancel') }}
        </v-btn>

        <v-btn
          :disabled="!areCoordinatesOk || !haveCoordinatesChanged"
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
import { mapGetters, mapActions } from 'vuex';
import { GET_CURRENT_PROJECT, UPDATE_LOCATION_FROM_PROJECT } from '@/store/project';
export default Vue.extend({
  name: "LocationAddEditSiteCoordinatesCard",
  props: {
    location: {
      required: true,
      type: Object,
    },
    closeCoordinatesForm: {
      required: true,
      type: Function,
    },
  },
  data: () => {
    return {
      siteCoordinates: '',
    };
  },
  created() {
    (this as any).siteCoordinates = this.location.coordinate;
  },
  methods: {
    ...mapActions({
      updateLocation: UPDATE_LOCATION_FROM_PROJECT,
    }),
    async saveCoordinates() {
      await (this as any).updateLocation({
        id: (this as any).location.id,
        projectId: this.currentProject.id,
        coordinate: (this as any).siteCoordinates,
      });

      (this as any).closeCoordinatesForm();
    },
  },
  computed: {
    ...mapGetters({
      currentProject: GET_CURRENT_PROJECT,
    }),
    areCoordinatesOk: function() {
      if ((this as any).siteCoordinates === '') return true;

      const wgs84RegExp = /^-?\d+\.*\d*,\s*-?\d+\.*\d*/gi;
      return wgs84RegExp.test((this as any).siteCoordinates);
    },
    haveCoordinatesChanged: function() {
      return this.location.coordinate !== (this as any).siteCoordinates;
    },
  },
});
</script>