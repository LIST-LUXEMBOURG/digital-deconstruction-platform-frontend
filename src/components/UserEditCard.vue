<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-card outlined>
    <!-- Title -->
    <v-card-title class="mx-auto py-4">{{
      $t('users.editUser', { login: user.login })
    }}</v-card-title>
    <!-- Body: Login / Firstname / Lastname / Email / password btn / (in)actived / (un)blocked -->
    <v-card-text>
      <v-row>
        <!-- No user information -->
        <v-col v-if="!user">
          <div>{{ $t('users.noUserInformationAvailable') }}</div>
        </v-col>
        <!-- Edit user form -->
        <v-col v-else>
          <v-form ref="editUserForm" v-model="formValid" class="mx-auto">
            <v-row justify="center">
              <v-col cols="10" lg="6">
                <!-- login / firstname / name / email -->
                <div v-for="field in fields" :key="field.index">
                  <!-- Edit mode -->
                  <v-text-field
                    v-if="canEditAttribute(field.name)"
                    :id="field.name"
                    v-model="modifiedUser[field.name]"
                    :label="$t(`users.${field.name}`)"
                    :rules="field.rules"
                    :error-messages="field.error"
                    @focus="field.error = ''"
                    outlined
                    dense
                  />
                  <!-- Display mode -->
                  <span v-else>
                    <strong>{{ user.login }}</strong>
                    <hr />
                  </span>
                </div>

                <!-- Update password button -->
                <div v-if="canEditUser && canEditAttribute('password')">
                  <v-btn
                    color="primary"
                    @click.stop="showPasswordDialog = true"
                  >
                    {{
                      permission === 'ownUser'
                        ? $t('users.changePassword.title')
                        : $t('users.resetPassword.title')
                    }}
                  </v-btn>
                  <UserChangePasswordDialog
                    :user="user"
                    :show.sync="showPasswordDialog"
                    @update:show="showPasswordDialog = false"
                  />
                </div>
                <!-- Update Role button -->
                <div v-if="canReadUserRoles && showRoles">
                  <v-btn color="primary" @click.stop="onChangeRoles(user)">{{
                    $t('role.changeRoles')
                  }}</v-btn>
                  <UserEditRoleDialog
                    v-if="canReadUserRoles"
                    :user="user"
                    :show.sync="showEditUserRoles"
                    :selectedRoles.sync="selectedRoles"
                    @update:show="value => (showEditUserRoles = value)"
                    @update:selectedRoles="value => (selectedRoles = value)"
                  />
                </div>
                <!-- (in)actived / (un)blocked -->
                <div class="d-flex">
                  <!-- Is user active ? -->
                  <div v-if="'active' in user" class="mx-auto">
                    <!-- Edit mode -->
                    <v-switch
                      v-if="canEditAttribute('active')"
                      v-model="modifiedUser.active"
                      :label="
                        modifiedUser.active
                          ? $t('users.active')
                          : $t('users.inactive')
                      "
                      outlined
                      dense
                    ></v-switch>
                    <!-- Display mode -->
                    <div v-else>
                      <span>{{
                        user.active ? $t('users.inactive') : $t('users.active')
                      }}</span>
                    </div>
                  </div>
                  <!-- Is user blocked ? -->
                  <div v-if="'blocked' in user" class="mx-auto">
                    <!-- Edit mode -->
                    <v-switch
                      v-if="canEditAttribute('blocked')"
                      v-model="modifiedUser.blocked"
                      :input-value="Boolean"
                      :false-value="false"
                      :label="
                        modifiedUser.blocked
                          ? $t('users.blocked')
                          : $t('users.notBlocked')
                      "
                      outlined
                      dense
                    ></v-switch>
                    <!-- Display mode -->
                    <div v-else>
                      <span>{{
                        user.blocked
                          ? $t('users.blocked')
                          : $t('users.notBlocked')
                      }}</span>
                    </div>
                  </div>
                </div>
                <v-textarea
                  v-show="
                    modifiedUser.blocked === true &&
                      canEditAttribute('blockingReason')
                  "
                  v-model="modifiedUser.blockingReason"
                  :label="$t('users.blockingReason')"
                  outlined
                  no-resize
                  auto-grow
                />
                <!-- Display mode -->
                <span
                  v-show="
                    !(
                      modifiedUser.blocked === true &&
                      canEditAttribute('blockingReason')
                    ) &&
                      modifiedUser.blockingReason !== undefined &&
                      modifiedUser.blockingReason !== ''
                  "
                  >{{
                    $t('users.blockingReason') + ': ' + user.blockingReason
                  }}</span
                >
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </v-card-text>
    <!-- Actions -->
    <v-card-actions v-if="user && canEditUser(user)" class="pa-4">
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="saveModifications"
        :disabled="!canSave"
        class="ma-2"
        >{{ $t('save') }}</v-btn
      >
      <v-btn color="primary" @click="cancelUserEdit" class="ma-2">{{
        $t('cancel')
      }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

import { ListUser, UPDATE_USER } from "@/store/users/index";
import { GET_ACDB, FETCH_SINGLE_ACDB } from "@/store/acdb/index";
import { GET_CURRENT_USER } from '@/store/users/index';
import i18n from '@/i18n';
import { isEqual, cloneDeep } from 'lodash-es';
import { Role } from '@/store/roles/types';

// Components
import UserChangePasswordDialog from '@/components/UserChangePasswordDialog.vue';
import UserEditRoleDialog from '@/components/UserEditRoleDialog.vue';

function getForbiddenChar(value: string) {
  if (value === '' || value === null || value === undefined) return false;

  const regex = new RegExp(/[^a-zA-ZÀ-ÿ0-9 ',.@\-+]/g);
  const occurences = value.match(regex) || [];

  if (occurences.length > 0) {
    // unique values
    const result = Array.from(new Set(occurences));
    // toString: joins values with a comma
    return result.join(', ');
  }
  return false;
}

function mandatoryRule(value: string) {
  return !!value || i18n.t('mandatoryField');
}

function forbiddenCharRule(value: string) {
  return (
    !getForbiddenChar(value) ||
    i18n.t('forbiddenCharacters', {
      forbiddenChar: `"${getForbiddenChar(value)}"`,
    })
  );
}

function emailRule(value: string) {
  if (value === null || value === undefined || value === '') return true;

  const emailRegex = new RegExp(/\S{2,}@\S{2,}\.[a-z]{2,3}$/g);
  const res = emailRegex.test(value);
  if (!res) return i18n.t('invalidEmail');

  const forbiddenRegex = new RegExp(/[^a-zA-Z0-9À-ÿ,_\-.@]/g);
  const occurences = value.match(forbiddenRegex) || [];

  if (occurences.length > 0) {
    const result = Array.from(new Set(occurences)).join(', ');
    return i18n.t('forbiddenCharacters', { forbiddenChar: `"${result}"` });
  }

  return true;
}

export default Vue.extend({
  name: 'UserEditCard',
  components: {
    UserChangePasswordDialog,
    UserEditRoleDialog,
  },
  props: {
    user: {
      type: Object as () => ListUser,
      required: false,
    },
    exitEditUserForm: {
      type: Function,
      required: false,
    },
    attributesToModify: {
      type: Function,
      required: false,
    },
    showRoles: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      canSave: false,
      formValid: false,
      modifiedUser: {} as ListUser,
      showPasswordDialog: false,
      showEditUserRoles: false,
      selectedRoles: [] as string[],
      fields: [
        {
          index: 1,
          name: 'login',
          rules: [mandatoryRule, forbiddenCharRule],
          error: '',
        },
        {
          index: 2,
          name: 'firstName',
          rules: [mandatoryRule, forbiddenCharRule],
          error: '',
        },
        {
          index: 3,
          name: 'name',
          rules: [mandatoryRule, forbiddenCharRule],
          error: '',
        },
        {
          index: 4,
          name: 'email',
          rules: [emailRule],
          error: '',
        },
      ],
    };
  },
  beforeMount() {
    // Make sure the right to update the users are fetched and in the store
    if (this.getAcdb('update', 'user') === undefined)
      this.fetchSingleAcdb('update', 'user');
    if (this.getAcdb('update', 'ownUser') === undefined)
      this.fetchSingleAcdb('update', 'ownUser');
    this.modifiedUser = Object.assign({}, this.user);
  },
  mounted() {
    (this.$refs.editUserForm as any).validate();
  },
  methods: {
    ...mapActions({
      fetchSingleAcdb: FETCH_SINGLE_ACDB,
      updateUser: UPDATE_USER,
    }),
    canEditUser(user: ListUser) {
      // Has the user the permission to update any user ?
      // Or its own user ?
      return (
        this.getAcdb('update', 'user').hasAccess === true ||
        (this.getAcdb('update', 'ownUser').hasAccess === true &&
          this.currentUser.id === user.id)
      );
    },
    canEditAttribute(attributeName: string) {
      // If the current user wants to update it's own information
      return this.attributesToModify().includes(attributeName);
    },
    canReadUserRoles() {
      return this.getAcdb('read', 'roleAssignment').hasAccess;
    },
    async saveModifications() {
      let index = this.fields.findIndex(f => f.name === 'login');
      try {
        await this.updateUser(this.modifiedUser);
        this.fields[index].error = '';
        this.exitEditUserForm();
      } catch (e) {
        const error = e as any;
        this.fields[index].error = error;
      }
    },
    cancelUserEdit() {
      let index = this.fields.findIndex(f => f.name === 'login');
      this.fields[index].error = '';
      this.exitEditUserForm();
    },
    onChangeRoles(user: ListUser) {
      if ('roles' in user && user.roles !== undefined)
        this.selectedRoles = user.roles.map((r: Role) => r.longName);
      else this.selectedRoles = [];

      this.showEditUserRoles = true;
    },
  },
  computed: {
    ...mapGetters({
      getAcdb: GET_ACDB,
      currentUser: GET_CURRENT_USER,
    }),
    hasChanged(): boolean {
      return !isEqual(this.user, this.modifiedUser);
    },
    permission(): string | null {
      let ownUserAcdb = this.getAcdb('update', 'ownUser');
      let isSameUser = this.user.id === this.currentUser.id;
      if (ownUserAcdb.hasAccess && isSameUser) return 'ownUser';

      let anyUserAcdb = this.getAcdb('update', 'user');
      if (anyUserAcdb.hasAccess) return 'user';

      return null;
    },
  },
  watch: {
    user: {
      deep: true,
      handler(newUser: ListUser, oldUser) {
        this.modifiedUser = cloneDeep(newUser);
      },
    },
    modifiedUser: {
      deep: true,
      handler(_newModifiedUser, _oldModifiedUser) {
        if (!this.modifiedUser.blocked) {
          this.modifiedUser.blockingReason = '';
        }

        this.canSave = this.formValid && this.hasChanged;
      },
    },
    formValid: function(_value, _oldValue) {
      this.canSave = this.formValid && this.hasChanged;
    },
  },
});
</script>


