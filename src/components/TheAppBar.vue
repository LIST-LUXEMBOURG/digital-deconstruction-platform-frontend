<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-app-bar color="appbar" app dark dense>
    <v-app-bar-nav-icon 
      @click="updateDrawer" 
      aria-label="menu"
    >
      <v-img
        max-width="2em"
        src="@/assets/logo.png"
      ></v-img>
    </v-app-bar-nav-icon>
    <v-app-bar-title class="align-center d-flex">
      {{ title }}
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <v-btn x-large v-if="isUserConnected && project && project.id" text>
      {{ project.fullName }}
    </v-btn>
    <v-spacer></v-spacer>
    <div v-if="isUserConnected" class="d-flex align-center" style="height: 48px">
        <v-btn text @click="onBack()">
           <v-icon>{{ mdiArrowLeftCircle }}</v-icon>Projects
        </v-btn>
      <UserViewMenu
        :connectedUser="currentUser">
      </UserViewMenu>
    </div>
    <v-btn text large v-if="!isUserConnected" @click="connect">
      <v-icon>{{ mdiLogin }}</v-icon>
    </v-btn>
    <TheAppLangagueSwitcher style="height: 48px"></TheAppLangagueSwitcher>
  </v-app-bar>
</template>

<script>
// node_modules
import Vue from 'vue';
import { mdiMenu, mdiAccount, mdiLogout, mdiLogin, mdiArrowLeftCircle } from '@mdi/js';
import { mapGetters } from 'vuex';

// Components
import TheAppLangagueSwitcher from '@/components/TheAppLanguageSwitcher.vue';

// Store
import UserViewMenu from '@/components/UserViewMenu.vue';
import { TOGGLE_DRAWER } from '@/store/app';
import { GET_AUTHENTICATION } from '@/store/auth';
import { GET_CURRENT_USER } from '../store/users';
import {
  GET_CURRENT_PROJECT,
} from '@/store/project';

import '@/theme/export.scss';

export default Vue.extend({
  name: 'TheAppBar',
  components: { TheAppLangagueSwitcher, UserViewMenu },
  data() {
    return {
      mdiMenu,
      mdiAccount,
      mdiLogout,
      mdiLogin,
      mdiArrowLeftCircle,
      title: 'Digital DeConstruction',
      hover: false,
    };
  },
  methods: {
    updateDrawer() {
      this.$store.commit(TOGGLE_DRAWER, true);
    },
    connect() {
      this.$router.push({
        name: 'sign in',
        params: { lang: this.$i18n.locale },
      });
    },
    onBack() {
      this.$router.push('projectsManagement');
    },
  },
  computed: {
    ...mapGetters({
      isUserConnected: GET_AUTHENTICATION,
      currentUser: GET_CURRENT_USER,
      project: GET_CURRENT_PROJECT
    }),
  },
});
</script>


<style lang="scss">
.v-app-bar-title__content {
  min-width: 520px;
}
</style>