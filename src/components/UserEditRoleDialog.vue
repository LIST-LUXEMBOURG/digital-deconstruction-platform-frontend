<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-dialog
    v-model="show"
    max-width="480px"
    @click:outside.stop="cancel"
    :persistent="isLoading"
  >
    <v-card>
      <v-card-title>{{
        $t('role.changeRolesTitle', { login: user.login })
      }}</v-card-title>
      <v-card-text>
        <span v-for="role in roles" :key="role.id">
          <v-tooltip bottom max-width="480px">
            <template v-slot:activator="{ on }">
              <v-checkbox
                v-model="selected"
                :value="role.longName"
                :hide-details="true"
              >
                <template v-slot:label>
                  <span v-on="on">{{ role.longName }}</span>
                </template>
              </v-checkbox>
            </template>
            <span>{{ role.description }}</span>
          </v-tooltip>
        </span>
      </v-card-text>
      <v-card-actions class="px-6 pt-0">
        <v-row>
          <v-col>
            <v-btn
              color="primary"
              @click="updateUserRoles"
              :disabled="isDisabled"
              :loading="isLoading"
              v-html="$t('save')"
              block
            ></v-btn>
          </v-col>
          <v-col>
            <v-btn
              color="primary"
              @click="cancel"
              block
              v-html="$t('cancel')"
            ></v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

import {
  GET_ROLES,
  FETCH_ROLES,
  UPDATE_USER_ROLES,
} from '../store/roles';
import { Role } from '../store/roles/types';

interface Data {
  isLoading: boolean;
}

export default Vue.extend({
  name: "UserEditRoleDialog",
  props: ['show', 'user', 'selectedRoles'],
  data: (): Data => {
    return {
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      roles: GET_ROLES,
    }),
    // mutate the dialog state (show or hide)
    selected: {
      get(): string[] {
        return this.selectedRoles;
      },
      set(value) {
        this.$emit('update:selectedRoles', value);
      },
    },
    isDisabled(): boolean {

      let userRoles: string[] = [];
      if ('roles' in this.user && !!this.user.roles.length)
        userRoles = this.user.roles.map((r: Role) => r.longName);
      const isEqual: boolean =
        (this.selected as string[]).length === userRoles.length &&
        (this.selected as string[]).every((r) => userRoles.includes(r));

      // return isEmpty || isEqual;
      return isEqual;
    },
  },
  methods: {
    async updateUserRoles(): Promise<void> {
      this.isLoading = true;
      try {
        await this.$store.dispatch(UPDATE_USER_ROLES, {
          roles: this.selected,
          user: this.user,
        });
      } catch (e) {
      } finally {
        this.isLoading = false;
        this.cancel();
      }
    },
    cancel(): void {
      if (!this.isLoading) this.$emit('update:show', false);
    },
  },
  async beforeMount() {
    await this.$store.dispatch(FETCH_ROLES);
  },
});
</script>