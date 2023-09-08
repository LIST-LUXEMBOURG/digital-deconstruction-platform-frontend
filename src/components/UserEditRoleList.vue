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
      {{ $t('role.roles') }}
    </h1>
    <v-divider></v-divider>
    <v-container fluid>
      <div v-for="(role, index) in allRoles" :key="index">
        <v-row>
          <v-col>
            <h2>{{ role.longName }}</h2>
            <span v-if="editIndex !== index">{{ role.description }}</span>
            <UserEditRoleCard
              v-else
              class="ma-2"
              :role="role"
              :roleIndex="index"
              :quitEditMode="quitRoleEdit"
            ></UserEditRoleCard>
          </v-col>
          <v-col v-if="editIndex !== index" cols="1">
            <v-icon @click="edit(index)">{{ mdiLeadPencil }}</v-icon>
          </v-col>
          <v-col cols="1">
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-icon
                  v-on="on"
                  @click="displayRolePrivileges(role.id, undefined)"
                >
                  {{ mdiInformationOutline }}
                </v-icon>
              </template>
              <span>{{ $t('roles.privileges', { roleName: role.longName }) }}</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </div>
      <v-dialog
        class="ma-2"
        max-width="30.9em"
        v-model="isRolePrivilegesDisplayed"
        scrollable
      >
        <v-card class="pa-2">
          <v-card-title>{{ $t('roles.privilegesRole') }}</v-card-title>
          <v-card-text style="max-height: 50em">
            <v-textarea
              v-model="rolePrivileges"
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
            <v-btn color="primary" @click="hideRolePrivileges">
              {{ $t('close') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-card>
</template>

<script lang="ts">
// node_modules
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { mdiLeadPencil, mdiInformationOutline } from '@mdi/js';

import UserEditRoleCard from '@/components/UserEditRoleCard.vue';

// Store's functions
import { GET_ROLES, FETCH_ROLES } from '@/store/roles';

import { FETCH_AND_RETURN_ROLE_PRIVILEGES_YAML } from '@/store/acdb';

interface Data {
  editIndex: null | number | any;
  isRolePrivilegesDisplayed: boolean;
  mdiLeadPencil: string;
  mdiInformationOutline: string;
  rolePrivileges: null | string | any;
  offsetX: boolean;
}

export default Vue.extend({
  name: 'UserEditRoleList',

  components: {
    UserEditRoleCard,
  },
  mounted() {
    this.fetchRoles();
  },
  data(): Data {
    return {
      mdiLeadPencil,
      mdiInformationOutline,
      editIndex: null,
      isRolePrivilegesDisplayed: false,
      rolePrivileges: [],
      offsetX: true,
    };
  },
  methods: {
    ...mapActions({
      fetchRoles: FETCH_ROLES,
      fetchRolePrivileges: FETCH_AND_RETURN_ROLE_PRIVILEGES_YAML,
    }),
    quitRoleEdit() {
      this.editIndex = null;
      this.fetchRoles();
    },
    edit(index: Number) {
      this.editIndex = index;
    },
    async displayRolePrivileges(roleID: number, roleName: string) {
      this.rolePrivileges = await this.fetchRolePrivileges({
        roleID,
        roleName,
      });
      this.isRolePrivilegesDisplayed = true;
    },
    hideRolePrivileges() {
      this.rolePrivileges = '';
      this.isRolePrivilegesDisplayed = false;
    },
  },
  computed: {
    ...mapGetters({
      allRoles: GET_ROLES,
    }),
  },
});
</script>
