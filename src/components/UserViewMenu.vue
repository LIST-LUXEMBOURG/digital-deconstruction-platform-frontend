<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
    <v-menu location="end">
        <template v-slot:activator="{ on }">
            <v-btn text large v-on="on"> <v-icon>{{ mdiAccount }}</v-icon> {{ connectedUser.firstName }} </v-btn>
        </template>
        <v-card>
            <v-card-text>
                <b> User: </b> {{ connectedUser.firstName }} {{ connectedUser.name }}
                <br>
                <b> Login: </b> {{ connectedUser.login }}
                <br>
                <b> Email: </b>  {{ connectedUser.email }}
                <br>
                <b> Active: </b>  {{ connectedUser.active }}
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="disconnect">
                Sign out<v-icon>{{ mdiLogout }}</v-icon>
              </v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>

<script lang="ts">

import Vue from 'vue';
import { CurrentUser } from '@/store/users';
import { mdiLogout, mdiAccount } from '@mdi/js';
import { mapActions } from 'vuex';
import { SIGN_OUT } from '@/store/auth';

export default Vue.extend({
  name: 'UserPopUp',
  props:{
    connectedUser: {
      required:true,
      type: Object as () => CurrentUser,
      default(){ return {} as CurrentUser }
    },
  },
  data() {
    return {
      mdiAccount,
      mdiLogout
    };
  },
  methods: {
    ...mapActions({
      logout: SIGN_OUT,
    }),
    disconnect() {
      this.logout(null);
      this.$router.push({
        name: 'sign in',
        params: { lang: this.$i18n.locale },
      });
    },
  }
});
</script>

<style lang="scss" scoped>
.user-details {
  position: absolute;
  z-index: 1;
  cursor: pointer;
}
</style>