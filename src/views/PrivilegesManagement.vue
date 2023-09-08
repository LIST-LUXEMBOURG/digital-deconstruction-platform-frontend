<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
    <v-container fluid>
        <v-row>
            <v-col v-show="canReadRolePrivileges.hasAccess">
                <UserEditRoleList/>
            </v-col>
            <v-col v-show="canReadResourcePrivileges.hasAccess">
                <UserPrivilageTable/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

import UserEditRoleList from "@/components/UserEditRoleList.vue";
import UserPrivilageTable from "@/components/UserPrivilageTable.vue";
import { FETCH_MULTIPLE_ACDB, GET_ACDB } from '@/store/acdb';

export default Vue.extend({
    name: "PrivilegesManagement",
    components: {
        UserEditRoleList,
        UserPrivilageTable
    },
    data() {
        return {
            canReadRolePrivileges: false,
            canReadResourcePrivileges: false,
        }
    },

    async beforeMount(){
        await this.multipleAcdb([
            {accessType: "read", resourceName: "rolePrivileges"},
            {accessType: "read", resourceName: "resourcePrivileges"}
        ]);

        this.canReadRolePrivileges = this.acdb("read", "rolePrivileges");
        this.canReadResourcePrivileges = this.acdb('read', 'resourcePrivileges');
    },
    methods: {
        ...mapActions({
            multipleAcdb: FETCH_MULTIPLE_ACDB
        })
    },
    computed: {
        ...mapGetters({
            acdb: GET_ACDB
        }),
    },
})
</script>