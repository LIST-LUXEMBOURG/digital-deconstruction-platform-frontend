/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

// node_modules
import Vue from 'vue';
import Vuex, { GetterTree, MutationTree, StoreOptions } from 'vuex';
import VuexPersistence from 'vuex-persist';
import { acdbModule } from './acdb';
import { appModule } from './app';
import { authModule, SET_LOGOUT_REASON } from './auth';
import { notificationsModule } from './notifications';
import { rolesModule } from './roles';
import { projectsModule } from './project';
import { viewerModule } from './viewer';
import { IS_LOADING, RootState, SET_LOADING } from './types';
import { usersModule } from './users';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence<RootState>({
  storage: window.sessionStorage,
  filter: mutation => mutation.type !== SET_LOGOUT_REASON,
  reducer: state => {
    const {
      appModule,
      acdbModule,
      authModule,
      usersModule,
      rolesModule,
      projectsModule,
      viewerModule,
    } = state as any;

    const { elements, ...otherProjectsState } = projectsModule;
    return {
      appModule,
      acdbModule,
      authModule,
      usersModule,
      rolesModule,
      projectsModule: {
        ...otherProjectsState,
      },
      viewerModule,
    };
  },
});

const mutations: MutationTree<RootState> = {
  [SET_LOADING](state, bool: boolean) {
    state.isLoading = bool;
  },
};

const getters: GetterTree<RootState, RootState> = {
  [IS_LOADING]: state => state.isLoading,
};

const store: StoreOptions<RootState> = {
  state: {
    version: '0.1.0',
    isLoading: false,
  },
  mutations,
  getters,
  modules: {
    appModule,
    acdbModule,
    authModule,
    notificationsModule,
    usersModule,
    rolesModule,
    projectsModule,
    viewerModule,
  },
  plugins: [vuexLocal.plugin],
};

export default new Vuex.Store<RootState>(store);
