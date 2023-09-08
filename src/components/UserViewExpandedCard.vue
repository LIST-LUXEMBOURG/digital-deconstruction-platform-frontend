<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->
 
 <template>
  <v-card outlined>
    <v-card-text>
      <div v-if="user">
        <div v-if="user.login">
          <strong>{{ user.login }}</strong>
          <hr />
        </div>
        <span v-if="user.firstName && user.name"
          >{{ user.firstName }} {{ user.name }}</span
        >
        <br />
        <span v-if="user.email">{{ user.email }}</span>
        <div v-if="'active' in user">
          <span v-if="!user.active">{{ $t('users.inactive') }}</span>
          <span v-else>{{ $t('users.active') }}</span>
        </div>
        <div v-if="'blocked' in user">
          <span v-if="user.blocked"
            >{{ $t('users.blocked') }}: {{ user.blockingReason }}</span
          >
          <span v-else>{{ $t('users.notBlocked') }}</span>
        </div>
        <template v-show="user.roles !== undefined && canReadUserAssignment()">
          <v-divider />
          <div>
            <strong>{{ $t('role.roles') }} : </strong>
            <span v-for="(role, index) in roles">
              <v-tooltip bottom max-width="480px">
                <template v-slot:activator="{ on }">
                  <span v-on="on">{{ role.longName }}</span>
                  <span v-show="index !== roles.length - 1">, </span>
                </template>
                <span v-show="!!role.description">{{ role.description }}</span>
                <span v-show="!role.description">{{
                  $t('role.noDescription')
                }}</span>
              </v-tooltip>
            </span>
          </div>
          <div v-if="canEditUser(user)" class="d-flex justify-end">
            <v-btn
              color="primary"
              @click="selectUserToEdit(user)"
              class="ma-2"
              >{{ $t('users.edit') }}</v-btn
            >
          </div>
        </template>
      </div>
      <div v-else>{{ $t('users.noUserInformationAvailable') }}</div>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
import { ListUser, GET_CURRENT_USER, GET_FILTERED_USERS } from '@/store/users';
import { mapGetters, mapActions } from 'vuex';
import { GET_ACDB } from '@/store/acdb';
import { Role, FETCH_USER_ROLES } from '@/store/roles';
import { find } from 'lodash-es';

export default Vue.extend({
  name: "UserViewExpandedCard",
  props: {
    userId: {
      type: Number,
      required: true,
    },
    selectUserToEdit: {
      type: Function,
      required: true,
    },
  },
  async created() {
    await this.fetchUserRoles(this.user.id);
  },
  data() {
    return {
      roles: [] as Role[] | undefined
    };
  },
  methods: {
    ...mapActions({
      fetchUserRoles: FETCH_USER_ROLES
    }),
    canReadUserAssignment() {
      return this.getAcdb('read', 'roleAssignment').hasAccess;
    },
    canEditUser(user: ListUser) {
      return (
        this.getAcdb('update', 'user').hasAccess === true ||
        (this.getAcdb('update', 'ownUser').hasAccess === true &&
          this.currentUser.id === user.id)
      );
    },
    random() {
      return Math.floor(Math.random() * 100);
    }
  },
  computed: {
    ...mapGetters({
      getAcdb: GET_ACDB,
      currentUser: GET_CURRENT_USER,
      filteredUsers: GET_FILTERED_USERS
    }),
    user: function(): ListUser {
      return find(this.filteredUsers, user => user.id === this.userId);
    }
  },
  watch: {
    user: {
      deep: true,
      immediate: true,
      handler: async function() {
        await this.fetchUserRoles(this.user.id);
        this.roles = this.user.roles;
      }
    },
    filteredUsers: {
      deep: true,
      immediate: true,
      handler: function() {
        this.roles = find(this.filteredUsers, user => user.id === this.userId).roles || [];
      }
    }
  }
});
</script>