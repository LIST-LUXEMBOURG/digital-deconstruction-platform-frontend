<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    temporary
    hide-overlay
    :mini-variant="false"
  >
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title v-html="title"></v-list-item-title>
        <v-list-item-subtitle v-html="subtitle"></v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item
        v-for="item in items"
        :key="item.path"
        link
        :to="`/${$i18n.locale}/${item.path}`"
      >
        <v-list-item-icon>
          <v-icon color="primary">{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t(item.name) }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import Vue from 'vue';
// icons
import * as icons from '@mdi/js';

// store
import { mapGetters, mapActions } from 'vuex';
import { GET_DRAWER, TOGGLE_DRAWER } from '@/store/app';
import { GET_AUTHENTICATION } from '@/store/auth';
import {
  PrivilegesManagement,
  ProjectsManagement,
  SessionManagement,
  UserManagement,
  Welcome,
  About
} from '@/router/routes';
import { FETCH_MULTIPLE_ACDB, GET_ACDB } from '@/store/acdb';

export default Vue.extend({
  name: 'AppDrawer',
  data() {
    return {
      title: 'Digital Deconstruction',
      subtitle: 'Intereg',
      acdb: [
        {
          accessType: 'read',
          resourceName: 'sessionManagement',
        },
        {
          accessType: 'read',
          resourceName: 'userManagement',
        },
        {
          accessType: 'update',
          resourceName: 'ownUser',
        },
        {
          accessType: 'read',
          resourceName: 'privilegesManagement',
        },
        {
          accessType: 'read',
          resourceName: 'projectsManagement',
        },
        {
          accessType: 'create',
          resourceName: 'project',
        },
        {
          accessType: 'update',
          resourceName: 'project',
        },
        {
          accessType: 'update',
          resourceName: 'ownProject',
        },
        {
          accessType: 'delete',
          resourceName: 'project',
        },
      ],
      baseItems: [
        {
          id: 0,
          component: Welcome,
        },
        {
          id: 1,
          component: SessionManagement,
          accessType: 'read',
        },
        {
          id: 2,
          component: UserManagement,
          accessType: 'read',
        },
        {
          id: 3,
          component: PrivilegesManagement,
          accessType: 'read',
        },
        {
          id: 4,
          component: ProjectsManagement,
          accessType: 'read',
        },
        {
          id: 5,
          component: About,
        },
      ],
      items: [],
    };
  },
  methods: {
    ...mapActions({
      fetchMultipleAcdb: FETCH_MULTIPLE_ACDB,
    }),
    ...mapGetters({
      getAcdb: GET_ACDB,
    }),

    itemsFiltering() {
      return this.baseItems
        .map(i => {
          i.name = `routes.${i.component.meta.slug}`;
          i.path = i.component.path;
          i.icon = icons[i.component.meta.icon];
          if (i.accessType) {
            i.condition = !!this.getAcdb()(i.accessType, i.component.meta.slug)
              .hasAccess;
          }
          return i;
        })
        .filter(i => {
          if ('condition' in i) return !!i.condition;
          else return true;
        })
        .sort((a, b) => a.id - b.id);
    },
  },
  computed: {
    drawer: {
      get() {
        return this.$store.getters[GET_DRAWER];
      },
      set(value) {
        // the condition ensure that the mutation is trigger only once
        if (value !== this.$store.getters[GET_DRAWER])
          this.$store.commit(TOGGLE_DRAWER, value);
      },
    },
    ...mapGetters({
      auth: GET_AUTHENTICATION,
    }),
  },
  async created() {
    if (this.auth)
      // Making sure that the needed rights are fetched before the mounting
      await this.fetchMultipleAcdb(this.acdb);

    this.items = this.itemsFiltering();
  },

  watch: {
    auth: async function(value, oldValue) {
      if (value) {
        let stringified = JSON.stringify(this.acdb);
        let acdb = JSON.parse(stringified);
        try {
          await this.fetchMultipleAcdb(acdb);
          this.items = this.itemsFiltering();
        } catch (error) {
          this.items = this.itemsFiltering();
        }
      } else {
        this.items = [];
      }
    },
  },
});
</script>