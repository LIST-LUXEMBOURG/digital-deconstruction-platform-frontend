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
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>{{ $t('users.id') }}</th>
              <th>{{ $t('users.login') }}</th>
              <th>{{ $t('users.connectionTime') }}</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in allConnectedUsers" :key="user.login">
              <td>{{ user.userId }}</td>
              <td>{{ user.login }}</td>
              <td class="text-right">
                {{ user.connectionDuration }}
              </td>
              <td>
                <UserDetailsCard
                  :showEdit="false"
                  :user="
                    currentUser && currentUser.id === user.userId
                      ? currentUser
                      : null
                  "
                  :enterDelay="enterDelay"
                  :leaveDelay="leaveDelay"
                  :showCard.sync="showCard"
                  :timeoutId.sync="timeoutId"
                  @update:showCard="updateShowCard"
                  @update:timeoutId="updateTimeoutId"
                  v-slot="{ mouseenter, mouseleave }"
                >
                  <v-icon
                    @mouseenter.stop="onmouseenter(mouseenter, user.userId)"
                    @mouseleave.stop="mouseleave(user.userId)"
                    color="primary"
                    >{{ mdiInformationOutline }}</v-icon
                  >
                </UserDetailsCard>
              </td>
              <td>
                <v-icon @click="userToDisconnect = user">{{
                  mdiLogout
                }}</v-icon>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-row>
    <!-- Dialogs -->

    <UserForceDisconnect
      v-if="userToDisconnect"
      :user.sync="userToDisconnect"
      @update:user="userToDisconnect = null"
    ></UserForceDisconnect>
  </v-container>
</template>

<script lang="ts">
// node_modules
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import i18n from '@/i18n';
import { mdiInformationOutline, mdiLogout } from '@mdi/js';

// Components
import UserDetailsCard from '@/components/UserDetailsCard.vue';
import UserForceDisconnect from '@/components/UserForceDisconnect.vue';

// Store's functions
import {
  FETCH_CONNECTED_USERS,
  GET_ALL_CONNECTED_USERS,
  FETCH_AND_RETURN_USER_BY_ID,
  ListUser,
  CurrentUser,
} from '@/store/users';

export default Vue.extend({
  name: 'UsersSessionView',
  components: {
    UserDetailsCard,
    UserForceDisconnect,
  },
  data: () => {
    return {
      // icons
      mdiLogout,
      mdiInformationOutline,
      usersDetailsToDisplay: [] as ListUser[],

      userToDisconnect: null,
      showCard: 0,
      timeoutId: 0,
      currentUser: null as any | CurrentUser | ListUser | undefined,
      enterDelay: 500,
      leaveDelay: 3000,
    };
  },
  methods: {
    ...mapActions({
      fetchAndReturnUserById: FETCH_AND_RETURN_USER_BY_ID,
    }),
    async fetchAndStoreUserById(userId: number) {
      const userIndex = this.usersDetailsToDisplay.findIndex(
        user => user.id === userId,
      );

      // If the user is already in the usersDetailsToDisplay
      // then delete it
      if (userIndex !== -1) this.usersDetailsToDisplay.splice(userId, 1);

      // Add the user in the usersDetailsToDisplay
      this.usersDetailsToDisplay.push(
        (await this.fetchAndReturnUserById(userId)) as ListUser,
      );
    },
    getUserDetailsToDisplay(userId: number): ListUser | undefined {
      const user = this.usersDetailsToDisplay.find(
        (user: ListUser) => user.id === userId,
      );
      return user;
    },
    updateShowCard(value: number) {
      this.showCard = value;
    },
    updateTimeoutId(value: number) {
      this.timeoutId = value;
    },
    async onmouseenter(func: Function, userId: number) {
      await this.fetchAndStoreUserById(userId);
      this.currentUser = this.getUserDetailsToDisplay(userId);
      func(userId);
    },
  },
  computed: {
    ...mapGetters({
      allConnectedUsers: GET_ALL_CONNECTED_USERS,
    }),
    ...mapActions({
      fetchConnectedUsers: FETCH_CONNECTED_USERS,
    }),
  },
  mounted() {
    this.fetchConnectedUsers;
  },
});
</script>