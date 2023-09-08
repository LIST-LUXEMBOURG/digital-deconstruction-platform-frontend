<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-data-table
        :items="filteredUsers"
        item-key="id"
        :expanded.sync="expanded"
        :sort-by="['name', 'firstName', 'login']"
        show-expand
        :footer-props="{ 'items-per-page-text': $t('itemsPerPageLabel') }"
        hide-default-header
        :hide-default-footer="hasUsers()"
      >
        <template v-slot:top>
          <div class="text-right" v-if="canAddUser()">
            <v-btn
              color="primary"
              @click="showAddUserForm = true"
              class="ml-auto"
            >
              <v-icon left>{{ mdiAccountPlus }}</v-icon>
              {{ $t('users.addUser') }}
            </v-btn>
          </div>
          <v-toolbar flat>
            <v-text-field
              v-model="search"
              :prepend-icon="mdiMagnify"
              :label="searchLabel"
              single-line
              hide-details
              @change="filterSearchUsers"
              @keydown="filterUsersOnKey"
              @click:clear="clearSearch"
              clearable
            ></v-text-field>
          </v-toolbar>
          <v-row class="switch">
            <v-checkbox
              v-model="activeUsers"
              :label="$t('users.active')"
              class="pa-2"
              :indeterminate="activeUsers === undefined"
            ></v-checkbox>
            <v-checkbox
              v-model="blockedUsers"
              :label="$t('users.blocked')"
              class="pa-2"
              :indeterminate="blockedUsers === undefined"
            ></v-checkbox>
          </v-row>
        </template>
        <template v-slot:item.data-table-expand="{ item, expand, isExpanded }">
          <v-row
            v-bind:class="{ active: 'active' in item && item.active === false }"
            @click="rowClick(item, expand, !isExpanded)"
          >
            <v-col cols="1">
              <v-icon v-if="item.blocked">{{ mdiLock }}</v-icon>
            </v-col>
            <v-col cols="8">
              {{ item.name }}, {{ item.firstName }}
              <span v-if="item.login">[{{ item.login }}]</span>
            </v-col>
          </v-row>
        </template>
        <template v-slot:expanded-item="{ item }">
          <UserViewExpandedCard
            :userId="item.id"
            :selectUserToEdit="selectUserToEdit"
            @update:selectedRoles="value => item.roles = value"
          >
          </UserViewExpandedCard>
        </template>
        <template v-slot:no-results>
          <div class="footer">{{ $t('users.noUserInformationAvailable') }}</div>
        </template>
        <template v-slot:no-data>
          <div class="footer">{{ $t('users.noUserInformationAvailable') }}</div>
        </template>
      </v-data-table>
    </v-row>
    <!-- Edit user -->
    <v-dialog v-model="showEditUserForm" fullscreen hide-overlay scrollable>
      <UserEditCard
        :user="editingUser"
        :exit-edit-user-form="closeEditModal"
        :attributesToModify="canEditAttribute"
        :showRoles="true"
      ></UserEditCard>
    </v-dialog>
    <!-- Create user -->
    <UserAddDialog
      :show="showAddUserForm"
      :attributesToAdd="canAddAttribute()"
      :exit-add-user-form="closeAddModal"
    ></UserAddDialog>
  </v-container>
</template>

<script lang="ts">
// node_modules
import Vue from 'vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import i18n from '@/i18n';
import { mdiMagnify } from '@mdi/js';
import { mdiLock, mdiAccountPlus } from '@mdi/js';

// import store from '@/store';

// Store's functions
import {
  FETCH_FILTERED_USERS,
  GET_FILTERED_USERS,
  GET_ACTIVE_USERS_FILTER,
  GET_BLOCKED_USERS_FILTER,
  SET_ACTIVE_USERS_FILTER,
  SET_BLOCKED_USERS_FILTER,
  ListUser,
  SET_USERS_FILTER,
  GET_USERS_FILTER,
} from '@/store/users';

import UserEditCard from '@/components/UserEditCard.vue';
import UserAddDialog from '@/components/UserAddDialog.vue';
import UserViewExpandedCard from '@/components/UserViewExpandedCard.vue';
import UserEditRoleDialog from '@/components/UserEditRoleDialog.vue';

import { GET_ACDB, FETCH_MULTIPLE_ACDB } from '../store/acdb';
import { GET_CURRENT_USER } from '../store/users';
import { cloneDeep } from 'lodash-es';

export default Vue.extend({
  name: 'UsersManagementView',
  components: {
    UserEditCard,
    UserAddDialog,
    UserEditRoleDialog,
    UserViewExpandedCard,
  },
  async beforeMount() {
    await (this as any).fetchMultipleAcdb([
      { accessType: 'update', resourceName: 'user' },
      { accessType: 'update', resourceName: 'ownUser' },
      { accessType: 'create', resourceName: 'user' },
      { accessType: 'read', resourceName: 'roleAssignment' },
    ]);
  },
  mounted() {
    (this as any).search = this.usersFilter;
    (this as any).filterUsers();
  },
  data() {
    return {
      search: '',
      mdiMagnify,
      mdiLock,
      mdiAccountPlus,
      expanded: [],
      editingUser: {} as ListUser,
      showEditUserForm: false,
      showAddUserForm: false,
    };
  },
  methods: {
    ...mapActions({
      fetchAllFilteredUsers: FETCH_FILTERED_USERS,
      fetchMultipleAcdb: FETCH_MULTIPLE_ACDB,
    }),
    ...mapMutations({
      toggleActiveUsersFilter: SET_ACTIVE_USERS_FILTER,
      toggleBlockedUsersFilter: SET_BLOCKED_USERS_FILTER,
      setUsersFilter: SET_USERS_FILTER,
    }),
    async filterUsers() {
      await (this as any).fetchAllFilteredUsers({
        filter: this.usersFilter,
        active: this.activeUsersFilter,
        blocked: this.blockedUsersFilter,
      });
    },
    filterUsersOnKey(event: any) {
      if (['Tab', 'Enter'].includes(event.key)) (this as any).filterUsers();
    },
    clearSearch() {
      (this as any).search = '';
      (this as any).setUsersFilter('');
      (this as any).filterUsers();
    },
    filterSearchUsers(newFilterSearch: string) {
      (this as any).setUsersFilter(newFilterSearch);

      (this as any).filterUsers();
    },
    hasUsers() {
      return this.filteredUsers.length === 0;
    },
    canEditUser(user: ListUser) {
      // Has the user the permission to update any user ?           // Or its own user ?
      return (
        this.getAcdb('update', 'user').hasAccess === true ||
        (this.getAcdb('update', 'ownUser').hasAccess === true &&
          this.currentUser.id === user.id)
      );
    },

    canAddUser() {
      // Has the user the permission to create any user ?
      return this.getAcdb('create', 'user').hasAccess;
    },
    canEditAttribute() {
      return this.currentUser.id === (this as any).editingUser.id
        ? // Then check if the attribute to modify is in the user or in the own user's attributes that can be modified
          this.getAcdb('update', 'user').filteringAttributes.concat(
            this.getAcdb('update', 'ownUser').filteringAttributes,
          )
        : // Otherwise, just check in the user's attributes that can be modified
          this.getAcdb('update', 'user').filteringAttributes;
    },
    canAddAttribute() {
      return this.getAcdb('create', 'user').filteringAttributes;
    },
    closeEditModal() {
      const expanded = cloneDeep((this as any).expanded);
      (this as any).expanded = [];
      (this as any).expanded = cloneDeep(expanded);
      (this as any).showEditUserForm = false;
      (this as any).editingUser = {} as any;
      this.$forceUpdate();
    },
    closeAddModal() {
      (this as any).showAddUserForm = false;
    },
    rowClick(user: ListUser, expand: Function, value: boolean) {
      return expand(value);
    },
    selectUserToEdit(user: ListUser) {
      (this as any).editingUser = user;
      (this as any).showEditUserForm = true;
    },
  },
  computed: {
    ...mapGetters({
      filteredUsers: GET_FILTERED_USERS,
      usersFilter: GET_USERS_FILTER,
      activeUsersFilter: GET_ACTIVE_USERS_FILTER,
      blockedUsersFilter: GET_BLOCKED_USERS_FILTER,
      currentUser: GET_CURRENT_USER,
      getAcdb: GET_ACDB,
    }),
    searchLabel: () => i18n.t('search'),
    label: () => i18n.t('itemsPerPageLabel'),
    activeUsers: {
      get: function() {
        return this.activeUsersFilter;
      },
      set: function(newValue) {
        let newFilterValue: boolean | undefined;

        if (this.activeUsers === undefined) newFilterValue = true;
        else if (this.activeUsers === true) newFilterValue = false;
        else if (this.activeUsers === false) newFilterValue = undefined;

        (this as any).toggleActiveUsersFilter(newFilterValue);
        (this as any).filterUsers();
      },
    },
    blockedUsers: {
      get: function() {
        return this.blockedUsersFilter;
      },
      set: function(newValue) {
        let newFilterValue: boolean | undefined;

        if (this.blockedUsers === undefined) newFilterValue = true;
        else if (this.blockedUsers === true) newFilterValue = false;
        else if (this.blockedUsers === false) newFilterValue = undefined;
        console.log('newFilterValue: ', newFilterValue);

        (this as any).toggleBlockedUsersFilter(newFilterValue);
        (this as any).filterUsers();
      },
    },
  },
});
</script>
<style scoped>
.active {
  text-decoration: line-through;
}
.switch {
  margin-left: 15px;
}
.footer {
  padding-left: 10px;
  text-align: left;
  border-bottom: thin solid rgba(0, 0, 0, 0.12);
}
</style>
