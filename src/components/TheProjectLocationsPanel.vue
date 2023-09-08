<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-container fluid>
    <v-card outlined>
      <v-row class="mb-2 ml-2 mr-2 mt-6">
      <v-col cols="6">
        <v-treeview
          :items="formatedProjectLocations"
          item-children="subdivisions"
          item-key="id"
          open-all
          hoverable
          rounded
          transition
          :open="openItems"
          @update:open="setOpenItems"
        >
          <!-- Icons -->
          <template v-slot:prepend="{ item /*, open */ }">
            <v-icon color="primary">
              {{ icons[item.type] }}
            </v-icon>
          </template>
          <!-- Location name -->
          <template v-slot:label="{ item /*, open*/ }">
            <div
              v-if="!!item.name && item.name !== '' && !isEditingMode(item)"
            >
              {{ item.name }}
            </div>
            <v-text-field
              ref="locationToSave"
              autofocus
              v-else
              v-model="locationToEdit.name"
              :error-messages="textfieldError"
              @blur="onBlurItemName($event, item)"
            ></v-text-field>
          </template>
          <!-- Delete location -->
          <template v-slot:append="{ item /*, open */ }">
            <v-icon
              v-if="!!item.pointOfInterest && item.pointOfInterest !== ''"
              @click="displayPointOfInterset(item)"
              color="primary"
              style="margin: 0 4px !important"
            >
              {{ mdiEyeOutline }}
            </v-icon>
            <v-icon
              v-if="!!item.coordinate && item.coordinate !== ''"
              @click="displayOpenStreetMapWithCoordinates(item)"
              color="primary"
              style="margin: 0 4px !important"
            >
              {{ mdiEarth }}
            </v-icon>
            <v-icon
              v-if="
                (!item.subdivisions || item.subdivisions.length === 0) &&
                  !!item.name &&
                  item.name !== '' &&
                  item.type !== 'project' &&
                  !doesLocationHaveDocuments(item.id) &&
                  canDeleteLocation()
              "
              @click="removeLocation(item)"
              color="primary"
              style="margin: 0 4px !important"
            >
              {{ mdiTrashCan }}
            </v-icon>
            <v-menu>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-if="item.type !== 'project'"
                    icon
                    color="primary"
                    v-bind="attrs"
                    v-on="on"
                    @click="showContextMenu($event, item)"
                  >
                  <v-icon>
                    {{ mdiDotsVertical }}
                  </v-icon>
                </v-btn>
              </template>
              <LocationAddEditMenu
                :location="selectedLocation"
                :addLocationInTree="addLocationInTree"
                :removeLocationInTree="removeLocationInTree"
                :setLocationInEditMode="setLocationInEditMode"
                :canCreateLocation="canCreateLocation()"
                :canDeleteLocation="canDeleteLocation()"
                :canUpdateLocation="canUpdateLocation()"
              >
              </LocationAddEditMenu>
            </v-menu>
          </template>
        </v-treeview>
      </v-col>
      <!-- Iframe street view -->
      <v-col>
        <v-row align="center" class="text-h5 mx-2">
                    <v-badge :color="openStreetMap.name ? 'success' : 'error'" dot>
              <p v-if="openStreetMap.name">{{ openStreetMap.name }}</p>
              <p v-else>No site selected</p>
          </v-badge>
          <v-spacer></v-spacer>
          <v-btn v-if="canCreateLocation()" color="primary" @click="addSite()">
            <v-icon>{{ mdiPlus }}</v-icon>
          </v-btn>
        </v-row>
        <v-row v-show="openStreetMap.src">
          <v-col>
          <v-responsive :aspect-ratio="16 / 9" ref="openStreetMap">
            <iframe
              width="100%"
              height="100%"
              frameborder="0"
              scrolling="no"
              marginheight="0"
              marginwidth="0"
              :src="openStreetMap.src"
            >
            </iframe>
          </v-responsive>
          <small><a :href="openStreetMap.extendSrc" target="_blank">View Larger Map</a></small>
          </v-col>
        </v-row>
      </v-col>
      </v-row>
    </v-card>

  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import i18n from '@/i18n';
import {
  mdiDecagram,
  mdiMapMarker,
  mdiHomeVariant,
  mdiOfficeBuilding,
  mdiFloorPlan,
  mdiTrashCan,
  mdiEarth,
  mdiDotsVertical,
  mdiEyeOutline,
  mdiPlus
} from '@mdi/js';

import {
  GET_CURRENT_PROJECT_LOCATIONS,
  FETCH_LOCATIONS_FROM_CURRENT_PROJECT,
  GET_CURRENT_PROJECT,
  Location,
  ADD_LOCATION_TO_PROJECT,
  REMOVE_LOCATION_FROM_PROJECT,
  UPDATE_LOCATION_FROM_PROJECT,
  LIST_PROJECT_FILES,
  GET_CURRENT_PROJECT_FILES,
  FETCH_PARTICIPANTS_LIST_FROM_CURRENT_PROJECT,
  GET_CURRENT_PROJECT_PARTICIPANTS
} from '@/store/project';

import LocationAddEditMenu from '@/components/LocationAddEditMenu.vue';
import { ADD_NOTIFICATION } from '../store/notifications';
import { FETCH_MULTIPLE_ACDB, GET_ACDB } from '@/store/acdb';
import { GET_CURRENT_USER } from '@/store/users';
import { find } from 'lodash-es';
import { boundaryBox, OpenStreetMap } from '../utils';

function searchLocationTreeByName(
  location: Location,
  name: string,
): Location | null {
  if (location.name == name) return location;
  else if (location.subdivisions != null) {
    let i = 0;
    let length = location.subdivisions.length;
    let result = null;
    for (; result == null && i < length; i++) {
      result = searchLocationTreeByName(location.subdivisions[i], name);
    }
    return result;
  }
  return null;
}

export default Vue.extend({
  name: "TheProjectLocationsPanel",
  components: {
    LocationAddEditMenu,
  },
  data() {
    return {
      mdiTrashCan,
      mdiEarth,
      mdiEyeOutline,
      mdiDotsVertical,
      mdiPlus,
      icons: {
        project: mdiDecagram,
        site: mdiMapMarker,
        building: mdiHomeVariant,
        storey: mdiOfficeBuilding,
        space: mdiFloorPlan,
      } as any,
      formatedProjectLocations: [] as Location[],
      contextMenuDisplayed: false,
      x: 0,
      y: 0,
      selectedLocation: {} as Location,
      selectedLocationCopy: {} as Location, // a deep copy of the location
      openItems: [] as string[],
      locationToEdit: {} as Location,
      textfieldError: '',
      openStreetMap: {} as OpenStreetMap,
      locationPOI: {} as any,
    };
  },
  async created() {
    await this.fetchMultipleAcdb([
      { accessType: 'create', resourceName: 'projectLocation' },
      { accessType: 'create', resourceName: 'ownProjectLocation' },
      { accessType: 'create', resourceName: 'participatingProjectLocation' },
      { accessType: 'read', resourceName: 'projectLocation' },
      { accessType: 'read', resourceName: 'ownProjectLocation' },
      { accessType: 'read', resourceName: 'participatingProjectLocation' },
      { accessType: 'update', resourceName: 'projectLocation' },
      { accessType: 'update', resourceName: 'ownProjectLocation' },
      { accessType: 'update', resourceName: 'participatingProjectLocation' },
      { accessType: 'delete', resourceName: 'projectLocation' },
      { accessType: 'delete', resourceName: 'ownProjectLocation' },
      { accessType: 'delete', resourceName: 'participatingProjectLocation' },
    ]);

    if (
      this.getAcdb('read', 'projectLocation').hasAccess ||
      this.getAcdb('read', 'ownProjectLocation').hasAccess ||
      this.getAcdb('read', 'participatingProjectLocation').hasAccess
    ) {
      await this.fetchLocationsForProject(this.currentProject.id);
      await this.fetchFilesForProject(this.currentProject.id);
    }
    if ('id' in this.currentProject) {
      await this.fetchProjectParticipants(this.currentProject.id);
    }
  },
  methods: {
    ...mapActions({
      fetchMultipleAcdb: FETCH_MULTIPLE_ACDB,
      fetchLocationsForProject: FETCH_LOCATIONS_FROM_CURRENT_PROJECT,
      createLocation: ADD_LOCATION_TO_PROJECT,
      updateLocation: UPDATE_LOCATION_FROM_PROJECT,
      deleteLocation: REMOVE_LOCATION_FROM_PROJECT,
      fetchFilesForProject: LIST_PROJECT_FILES,
      fetchProjectParticipants: FETCH_PARTICIPANTS_LIST_FROM_CURRENT_PROJECT
    }),
    ...mapMutations({
      addNotification: ADD_NOTIFICATION,
    }),
    canCreateLocation() {
      // if owner
      if (this.currentProject.owner.id === this.getCurrentUser.id)
        return (
          this.getAcdb('create', 'ownProjectLocation').hasAccess
        );
      // if participant
      else {
        // check if the user is a participant in the current project
        let participant = this.currentProjectParticipants.find((user:any) => user.userId === this.getCurrentUser.id);
        if (participant) return (
          this.getAcdb('create', 'participatingProjectLocation').hasAccess
        );
      }
      // if everything else (admin included)
      return this.getAcdb('create', 'projectLocation').hasAccess;
    },
    canUpdateLocation() {
      // if owner
      if (this.currentProject.owner.id === this.getCurrentUser.id)
        return (
          this.getAcdb('update', 'ownProjectLocation').hasAccess
        );
      // if participant
      else {
        // check if the user is a participant in the current project
        let participant = this.currentProjectParticipants.find((user:any) => user.userId === this.getCurrentUser.id);
        if (participant) return (
          this.getAcdb('update', 'participatingProjectLocation').hasAccess
        );
      }
      // if everything else (admin included)
      return this.getAcdb('update', 'projectLocation').hasAccess;
    },
    canDeleteLocation() {
      // if owner
      if (this.currentProject.owner.id === this.getCurrentUser.id)
        return (
          this.getAcdb('delete', 'ownProjectLocation').hasAccess
        );
      // if participant
      else {
        // check if the user is a participant in the current project
        let participant = this.currentProjectParticipants.find((user:any) => user.userId === this.getCurrentUser.id);
        if (participant) return (
          this.getAcdb('delete', 'participatingProjectLocation').hasAccess
        );
      }
      // if everything else (admin included)
      return this.getAcdb('delete', 'projectLocation').hasAccess;
    },
    addSite() {
      this.formatedProjectLocations[0].subdivisions = this.formatedProjectLocations[0].subdivisions?.concat(
        [
          {
            name: '',
            type: 'site',
            parentLocation: 0, // useful to remove empty leaf
          } as Location,
        ],
      );
      this.openItems.push('0');
    },
    addLocationInTree(parentLocationId: number, type: string) {
      this.addLeafInTree(
        this.formatedProjectLocations[0],
        parentLocationId,
        type,
      );
    },
    addLeafInTree(
      location: Location,
      matchingId: number,
      type: string,
    ): Location | null {
      if (location.id === matchingId) {
        return location;
      } else if (location.subdivisions != null) {
        let i;
        let result = null;
        for (i = 0; result == null && i < location.subdivisions.length; i++) {
          result = this.addLeafInTree(
            location.subdivisions[i],
            matchingId,
            type,
          );
          if (result !== null) {
            result.subdivisions!.push({
              name: '',
              type,
              parentLocationId: matchingId,
            });
            // Open the current node in the treeview (the openItems list tolerates duplicates)
            this.openItems.push('' + result.id);
          }
        }

        // Don't return the 'result' value otherwise it will add as many inputs as leaf traveled.
        // return result;
      }
      return null;
    },
    removeLeafInTree(
      location: Location,
      matchingParentId: number,
      name: string,
    ) {
      if (location.id === matchingParentId) {
        const index = location.subdivisions!.findIndex(
          sub => sub.name === name,
        );
        if (index != -1) {
          location.subdivisions!.splice(index, 1);
          return true;
        }
        return false; // should not happen, an error occured
      } else if (location.subdivisions !== null) {
        let i = 0;
        let length = location.subdivisions!.length;
        let found = false;
        for (; found == false && i < length; i++) {
          found = this.removeLeafInTree(
            location.subdivisions![i],
            matchingParentId,
            name,
          );
        }
      }
      return false;
    },
    isEditingMode(item: Location) {
      if (this.locationToEdit !== null && 'id' in this.locationToEdit)
        return item.id === this.locationToEdit.id;
      return false;
    },
    setLocationInEditMode(location: Location) {
      this.locationToEdit = location;
      this.textfieldError = '';
    },
    async onBlurItemName(event: any, location: Location) {
      // If input value is empty: remove it, in case of edition restore the previous label (location.name)
      if (event.target.value === '' || event.target.value === null) {
        // restore the previous location name if event.target.value is empty
        if (location.id) this.editLocation(event, location);
        // Remove the leaf
        else
          this.removeLeafInTree(
            this.formatedProjectLocations[0],
            location.parentLocationId!,
            '',
          );

        return;
      }

      this.isEditingMode(location)
        ? this.editLocation(event, location)
        : this.saveNewLocation(event, location);
    },
    async saveNewLocation(event: any, location: Location) {
      if (location.type === 'site') {
        await this.createLocation({
          projectId: this.currentProject.id,
          name: event.target.value,
          type: location.type,
        });
      } else {
        await this.createLocation({
          projectId: this.currentProject.id,
          name: event.target.value,
          type: location.type,
          parentLocationId: location.parentLocationId,
        });
      }
      this.locationToEdit = {} as Location;
    },
    async editLocation(event: any, location: Location) {
      if (
        event.target.value !== this.selectedLocationCopy.name &&
        event.target.value !== ''
      ) {
        // The searchLocation... function will always return a location because the
        // "formatedProject..." object is directly modified.
        // location object and locationToEdit both have the same reference to formatedProject...
        // So, to figure out if a item exists with the same name I compare the ids of
        // nameAlreadyExists and selectedLocationCopy (a copy by value).
        const locationAlreadyExists = searchLocationTreeByName(
          this.formatedProjectLocations[0],
          event.target.value,
        );

        if (
          locationAlreadyExists!.id !== this.selectedLocationCopy.id &&
          locationAlreadyExists?.parentLocationId ===
            this.selectedLocationCopy.parentLocationId
        ) {
          location.name = this.selectedLocationCopy.name;
          this.textfieldError = i18n.t('error.locationNameConflict').toString();

          // this.locationToEdit = {} as Location;
          return;
        }
      }

      if (
        this.selectedLocationCopy.name === event.target.value ||
        event.target.value === ''
      ) {
        location.name = this.selectedLocationCopy.name;
        this.locationToEdit = {} as Location;
        return;
      }

      await this.updateLocation({
        id: location.id,
        name: location.name,
        coordinate: location.coordinate,
        // type: location.type,
        projectId: this.currentProject.id,
      });
      this.locationToEdit = {} as Location;
    },
    async removeLocation(location: Location) {
      await this.deleteLocation({
        locationId: location.id,
        projectId: this.currentProject.id,
      });
    },
    async removeLocationInTree(location: Location) {
      // set loading state: true
      await this.removeLocation(location);
      // set loading state: false
    },

    showContextMenu(event: any, location: Location) {
      event.preventDefault();
      if (location.type !== 'project') {
        this.selectedLocation = location;
        this.selectedLocationCopy = Object.assign({}, location);
        this.contextMenuDisplayed = false;
        this.x = event.clientX;
        this.y = event.clientY;
        this.$nextTick(() => {
          this.contextMenuDisplayed = true;
        });
      }
    },

    setOpenItems(openList: string[]) {
      this.openItems = openList;
    },

    openGoogleMapsWithCoordinates(location: any) {
      window.open(
        `https://google.com.sa/maps/search/${location.coordinate}`,
        '_blank',
      );
    },

    displayOpenStreetMapWithCoordinates(location: any) {
      this.closePointOfInterset();
      let { coordinate } = location;
      const clientWidth = 425;
      const clientHeight = 350;

      this.openStreetMap = {} as OpenStreetMap;
      this.openStreetMap.name = location.name;
      this.openStreetMap.width = clientWidth;
      this.openStreetMap.height = clientHeight;
      this.openStreetMap.zoom = 18;

      const [lat, lon] = coordinate.replace(' ', '').split(',');
      const bbox = boundaryBox(lat, lon, 18, clientWidth, clientHeight);

      this.openStreetMap.src =
        `https://www.openstreetmap.org/export/embed.html` +
        `?bbox=${bbox.join('%2C')}` +
        `&layer=mapnik` +
        `&marker=${lat}%2C${lon}`;

      this.openStreetMap.extendSrc =
        `https://www.openstreetmap.org/` +
        `?mlat=${lat}&mlon=${lon}` +
        `#map=${this.openStreetMap.zoom}/${lat}/${lon}&layers=N`;
    },

    closeOpenStreetMapWithCoordinates() {
      this.openStreetMap = {} as OpenStreetMap;
    },

    displayPointOfInterset(location: Location) {
      this.closeOpenStreetMapWithCoordinates();
      const { name, pointOfInterest } = location;

      this.locationPOI = {
        name, pointOfInterest
      };
    },

    closePointOfInterset() {
      this.locationPOI = {} as any;
    },

    doesLocationHaveDocuments(locationId: number): boolean {
      return find(
        this.currentProjectFiles,
        projectFile => projectFile.locationId === locationId,
      );
    },
  },
  computed: {
    ...mapGetters({
      getAcdb: GET_ACDB,
      getCurrentUser: GET_CURRENT_USER,
      currentProject: GET_CURRENT_PROJECT,
      currentProjectLocations: GET_CURRENT_PROJECT_LOCATIONS,
      currentProjectFiles: GET_CURRENT_PROJECT_FILES,
      currentProjectParticipants: GET_CURRENT_PROJECT_PARTICIPANTS,
    }),
  },
  watch: {
    currentProjectLocations: {
      deep: true,
      handler: function(newVal, oldVal) {
        this.formatedProjectLocations = [
          {
            name: this.currentProject.shortName,
            type: 'project',
            subdivisions: newVal,
            id: 0,
          },
        ];
        // If project location has a site open the root level
        if (this.formatedProjectLocations[0].subdivisions?.length)
          this.openItems.push('0');
      },
    },
  },
});
</script>