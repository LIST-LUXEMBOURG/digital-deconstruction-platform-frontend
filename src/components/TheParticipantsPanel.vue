<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-form ref="addProjectParticipants" v-model="valid" class="my-5">
    <v-card v-show="!isEqual(currentProject, {})" outlined>
      <v-card-text>
        <v-container fluid>
          <v-row justify="space-between">
            <slot name="addProjectParticipantsFormTitle">
              {{ $t('projects.usersAndRoles') }}
            </slot>
          </v-row>
          <!-- Row to display the project owner -->
          <v-row
            v-if="currentProject.owner !== undefined"
            class="mx-auto"
            justify="space-around"
          >
            <v-col cols="3">
              <span v-if="!canChooseProjectAttribute('owner')" class="px-10">
                {{ displayUser(currentProject.owner.id) }}
              </span>
              <v-select
                v-else
                v-model="currentProject.owner"
                item-value="id"
                :items="allUsers"
                :item-text="formatUserForSelect"
                @change="updateProjectOwner(currentProject.owner.id)"
                class="px-10"
                dense
              ></v-select>
            </v-col>
            <v-col cols="3">
              <span class="px-10">{{ displayEmail(currentProject.owner.id) }}</span>
            </v-col>
            <v-col cols="3">
              <span class="px-10">{{ $t('projects.participants.owner') }}</span>
            </v-col>
            <v-col cols="1"></v-col>
          </v-row>
          <v-row
            v-for="(participant, index) in participantsList"
            class="mx-auto"
            justify="space-around"
            :key="index"
          >
            <!-- Add participant details in the list on select -->
            <v-col cols="3">
              <span class="px-10"
                >{{ participant.firstName }} {{ participant.name }}</span
              >
            </v-col>
            <v-col cols="3">
              <span class="px-10">{{ participant.email }}</span>
            </v-col>
            <v-col cols="3">
              <v-select
                v-if="
                  canAddParticipant() &&
                  (getAcdb(
                    'update',
                    'projectParticipant',
                  ).filteringAttributes.includes('role') ||
                    getAcdb(
                      'update',
                      'ownProjectParticipant',
                    ).filteringAttributes.includes('role'))
                "
                v-model="participant.role"
                :items="['Guest', 'Contributor']"
                @change="updateParticipantRole(participant)"
                class="px-10"
                dense
                :rules="required()"
              ></v-select>
              <span v-else class="px-10">{{ participant.role }}</span>
            </v-col>
            <v-col cols="1">
              <v-icon
                v-if="canRemoveParticipant()"
                color="primary"
                @click="removeParticipant(participant.id)"
              >
                {{ mdiTrashCan }}
              </v-icon>
            </v-col>
          </v-row>
          <v-row
            class="mx-auto"
            justify="space-around"
            v-show="canAddParticipant()"
          >
            <v-col cols="3">
              <v-select
                v-model="newParticipant.id"
                item-value="id"
                :items="allUsers"
                :item-text="formatUserForSelect"
                @change="updateNewParticipantInfo(newParticipant.id)"
                class="px-10"
                dense
                :rules="userAlreadySelected"
              ></v-select>
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="newParticipant.email"
                class="px-10"
                dense
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-select
                v-model="newParticipant.role"
                :items="['Guest', 'Contributor']"
                class="px-10"
                dense
                :rules="required()"
              ></v-select>
            </v-col>
            <v-col cols="1">
              <v-icon
                color="primary"
                @click="addParticipant(newParticipant.id, newParticipant.role)"
                :disabled="
                  !newParticipant.id ||
                  !newParticipant.role ||
                  newParticipant.role === ' '
                "
                >{{ mdiAccountPlus }}</v-icon
              >
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-row class="py-4" align="center" justify="center">
          <slot name="cancelBtn"> </slot>
          <slot name="nextBtn"> </slot>
        </v-row>
      </v-card-actions>
    </v-card>
    <v-card v-show="isEqual(currentProject, {})" outlined>
      <v-card-text>
        {{ $t('projects.participants.noProjectSelected') }}
      </v-card-text>
    </v-card>
  </v-form>
</template>
<script lang="ts">
import Vue from 'vue';
import { mdiTrashCan, mdiAccountPlus } from '@mdi/js';
import { mapActions, mapGetters } from 'vuex';
import {
  GET_CURRENT_USER,
  GET_FILTERED_USERS,
  FETCH_AND_RETURN_USER_BY_ID,
  FETCH_FILTERED_USERS,
} from '@/store/users';
import { FETCH_MULTIPLE_ACDB, GET_ACDB } from '@/store/acdb';
import {
  ADD_PARTICIPANT_TO_PROJECT,
  GET_CURRENT_PROJECT,
  UPDATE_PROJECT,
  FETCH_ONE_PROJECT,
  FETCH_PARTICIPANTS_LIST_FROM_CURRENT_PROJECT,
  REMOVE_PARTICIPANT_FROM_PROJECT,
  Participant,
  GET_CURRENT_PROJECT_PARTICIPANTS,
  UPDATE_PARTICIPANT_FROM_PROJECT,
} from '@/store/project';

import { User } from '@/plugins/httpClient/users';
import { filter, forEach, isEqual } from 'lodash';

export default Vue.extend({
  name: "TheParticipantsPanel",
  data() {
    return {
      isEqual,
      mdiTrashCan,
      mdiAccountPlus,
      valid: false,
      participantsList: [] as any[],
      newParticipant: {} as any,
    };
  },
  async created() {
    await this.fetchMultipleAcdb([
      {
        resourceName: 'projectParticipant',
        accessType: 'create',
      },
      {
        resourceName: 'projectParticipant',
        accessType: 'read',
      },
      {
        resourceName: 'projectParticipant',
        accessType: 'update',
      },
      {
        resourceName: 'projectParticipant',
        accessType: 'delete',
      },
      {
        resourceName: 'ownProjectParticipant',
        accessType: 'create',
      },
      {
        resourceName: 'ownProjectParticipant',
        accessType: 'read',
      },
      {
        resourceName: 'ownProjectParticipant',
        accessType: 'update',
      },
      {
        resourceName: 'ownProjectParticipant',
        accessType: 'delete',
      },
    ]);
    if ('id' in this.currentProject) {
      await this.fetchUsers({});
      await this.fetchProjectParticipants(this.currentProject.id);
    }
  },
  methods: {
    ...mapActions({
      fetchMultipleAcdb: FETCH_MULTIPLE_ACDB,
      fetchUsers: FETCH_FILTERED_USERS,
      fetchUserById: FETCH_AND_RETURN_USER_BY_ID,
      updateProject: UPDATE_PROJECT,
      addParticipantToProject: ADD_PARTICIPANT_TO_PROJECT,
      removeParticipantFromProject: REMOVE_PARTICIPANT_FROM_PROJECT,
      updateParticipantFromProject: UPDATE_PARTICIPANT_FROM_PROJECT,
      fetchProject: FETCH_ONE_PROJECT,
      fetchProjectParticipants: FETCH_PARTICIPANTS_LIST_FROM_CURRENT_PROJECT,
    }),
    async updateProjectOwner(ownerId: number) {
      await this.updateProject({ id: this.currentProject.id, owner: ownerId });
    },
    async addParticipant(userId: number, role: string) {
      await this.addParticipantToProject({
        userId,
        projectId: this.currentProject.id,
        role,
      });

      // a simple trick to avoid the rules to trigger.
      this.newParticipant = {
        role: ' ',
      };
    },
    async removeParticipant(userId: number) {
      await this.removeParticipantFromProject({
        userId,
        projectId: this.currentProject.id,
      });
    },
    async updateParticipantRole(participant: any) {
      await this.updateParticipantFromProject(participant);
    },
    formatUserForSelect(user: User) {
      return `${user.firstName} ${user.name}`;
    },
    getOwner() {
      const user = this.allUsers.find(
        (u) => u.id === this.currentProject.owner.id,
      );
      return user;
    },
    displayUser(userId: number): string {
      const user = this.allUsers.find((u) => u.id === userId);
      if (!user) return 'User not found';
      return `${user.firstName} ${user.name}`;
    },
    displayEmail(userId: number): string {
      const user = this.allUsers.find((u) => u.id === userId);
      if (!user) return 'User not found';
      return `${user.email}`;
    },
    getParticipantInfo(participantId: number | null) {
      return this.getAllUsers.find((user: any) => user.id === participantId);
    },
    updateNewParticipantInfo(participantId: any) {
      const participant = this.getParticipantInfo(participantId);

      Object.assign(this.newParticipant, participant);
    },
    required() {
      return [(v: any) => !!v || 'Item is required'];
    },
    canAddParticipant() {
      if (
        !isEqual(this.currentProject, {}) &&
        this.currentProject.owner === this.getCurrentUser.id
      )
        return this.getAcdb('create', 'ownProjectParticipant').hasAccess;

      return this.getAcdb('create', 'projectParticipant').hasAccess;
    },
    canRemoveParticipant() {
      if (
        !isEqual(this.currentProject, {}) &&
        this.currentProject.owner === this.getCurrentUser.id
      )
        return this.getAcdb('delete', 'ownProjectParticipant').hasAccess;

      return this.getAcdb('delete', 'projectParticipant').hasAccess;
    },
  },
  computed: {
    ...mapGetters({
      getAcdb: GET_ACDB,
      getCurrentUser: GET_CURRENT_USER,
      getAllUsers: GET_FILTERED_USERS,
      currentProject: GET_CURRENT_PROJECT,
      currentProjectParticipants: GET_CURRENT_PROJECT_PARTICIPANTS,
    }),
    canChooseProjectAttribute() {
      return (attribute: string) => {
        if (!isEqual(this.currentProject, {})) {
          if (this.currentProject.owner === this.getCurrentUser.id) {
            return (
              this.getAcdb('update', 'project').filteringAttributes.includes(
                attribute,
              ) ||
              this.getAcdb('update', 'ownProject').filteringAttributes.includes(
                attribute,
              )
            );
          }

          return this.getAcdb('update', 'project').filteringAttributes.includes(
            attribute,
          );
        }

        return false;
      };
    },
    userAlreadySelected() {
      const participantIds = this.participantsList.map(({ id }) => id);
      return [
        (v: any) =>
          filter(participantIds, (id) => id === v).length < 1 ||
          'User already selected in the list of participants',
      ];
    },
    allUsers(): User[] {
      const users: User[] = [...this.getAllUsers];
      users.sort((alice: User, bob: User) => {
        return (
          alice.firstName.localeCompare(bob.firstName) ||
          alice.name.localeCompare(bob.name)
        );
      });
      return users;
    },
  },
  watch: {
    currentProjectParticipants: function (newVal, oldVal) {
      this.participantsList = new Array<any>();

      forEach(newVal, (participant: Participant) => {
        this.participantsList.push(
          Object.assign(
            {},
            participant,
            this.getParticipantInfo(participant.userId),
          ),
        );
      });

      this.newParticipant = {};
    },
  },
});
</script>