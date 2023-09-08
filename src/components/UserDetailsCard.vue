<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <span>
    <!-- The activator element -->
    <slot :mouseenter="mouseenter" :mouseleave="mouseleave" />
    <!-- The user detail tooltip / card -->
    <v-card
      v-if="user"
      v-show="showCard != 0 && showCard === user.id"
      class="user-details pa-2 align-left"
      :light="light"
      @mouseenter="mouseenterCard"
      @mouseleave="mouseleaveCard"
    >
      <div v-if="user">
        <div class="text-center">
          <strong>{{ user.login }}</strong>
        </div>
        <v-divider></v-divider>
        <div v-if="user.firstName && user.name">
          {{ user.firstName }} {{ user.name }}
        </div>
        <div v-if="user.email" v-text="user.email" />
        <div v-if="'active' in user">
          <span v-if="user.active" v-html="$t('users.active')" />
          <span v-else v-html="$t('users.inactive')" />
        </div>
        <div v-if="'blocked' in user">
          <span v-if="user.blocked">{{
            $t('users.blocked') + ': ' + user.blockingReason
          }}</span>
          <span v-else v-html="$t('users.notBlocked')" />
        </div>
        <div v-if="canEditUser(user) && showEdit">
          <v-btn
            block
            color="primary"
            @click="showEditUserForm = true"
            class="ml-auto"
            >{{ $t('edit') }}</v-btn
          >
        </div>
      </div>
      <div v-else v-html="$t('users.noUserInformationAvailable')" />
    </v-card>

    <!-- The user edit dialog -->
    <v-dialog v-model="showEditUserForm" persistent max-width="40em">
      <UserEditCard
        :user="user"
        :exit-edit-user-form="() => (showEditUserForm = false)"
        :attributesToModify="canEditAttribute"
        :showRoles="false"
      ></UserEditCard>
    </v-dialog>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { debounce } from 'lodash-es';
import { mdiHome } from '@mdi/js';

import { FETCH_SINGLE_ACDB, GET_ACDB } from '../store/acdb';
import { CurrentUser, GET_CURRENT_USER } from '../store/users';

import UserEditCard from '@/components/UserEditCard.vue';

export default Vue.extend({
  name: "UserDetailsCard",
  components: {
    UserEditCard,
  },
  props: [
    'user',
    'showEdit',
    'enterDelay',
    'leaveDelay',
    // shared props btw UserDetails instances
    'timeoutId',
    'showCard',
    'light',
  ],
  data() {
    return {
      mdiHome,
      showEditUserForm: false,
      // timeoutId: 0 as any
    };
  },
  methods: {
    mouseenter(id: number) {
      if (this.timeoutId !== 0) {
        clearInterval(this.timeoutId);
        this.$emit('update:timeoutId', 0);
      }

      debounce(() => {
        this.$emit('update:showCard', id);
      }, this.enterDelay)();
    },
    mouseleave(id: number) {
      const t = setTimeout(() => {
        this.$emit('update:showCard', 0);
      }, this.leaveDelay);

      this.$emit('update:timeoutId', t);
    },
    mouseenterCard() {
      clearInterval(this.timeoutId);
      this.$emit('update:timeoutId');
    },
    mouseleaveCard() {
      const t = setTimeout(() => {
        this.$emit('update:showCard', 0);
        this.$emit('update:timeoutId', 0);
      }, this.leaveDelay);
    },
    canEditUser(user: CurrentUser) {
      // Has the user the permission to update own profile
      return !!this.getAcdb('update', 'ownUser').hasAccess;
    },
    canEditAttribute() {
      // If the current user wants to update it's own information
      // Then check if the attribute to modify is in the user or in the own user's attributes that can be modified
      return this.getAcdb('update', 'ownUser').filteringAttributes;
    },
  },
  async beforeMount() {
    await this.$store.dispatch(FETCH_SINGLE_ACDB, {
      accessType: 'update',
      resourceName: 'ownUser',
    });
  },
  computed: {
    ...mapGetters({
      getAcdb: GET_ACDB,
      currentUser: GET_CURRENT_USER,
    }),
  },
});
</script>

<style lang="scss" scoped>
.user-details {
  position: absolute;
  z-index: 1;
  cursor: pointer;
}
</style>