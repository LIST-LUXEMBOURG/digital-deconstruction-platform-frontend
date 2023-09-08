<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
    <v-card class="pa-4">
        <v-textarea 
            v-model="modifiedRole.description" 
            no-resize 
            solo 
            flat
        ></v-textarea>
        <v-row>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                :disabled="!canSave"
                @click.stop="saveModifications"
                class="ma-2"
            >{{ $t("save") }}</v-btn>
            <v-btn
                color="primary"
                @click.stop="quitEditMode"
                class="ma-2"
            >{{ $t("cancel") }}</v-btn>
        </v-row>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'
import { isEqual } from "lodash-es";

import { Role } from "@/store/roles/types"
import { UPDATE_ROLE } from '@/store/roles'

export default Vue.extend({
    name: "UserEditRoleCard",

    props: {
        role: {
            type: Object as () => Role,
            required: true
        },
        roleIndex: {
            type: Number,
            required: true
        },
        quitEditMode: {
            type: Function,
            required: true
        }
    },
    beforeMount() {
        this.modifiedRole = Object.assign({}, this.role);
    },
    data() {
        return {
            canSave: false,
            modifiedRole: {} as Role
        }
    },
    methods: {
        ...mapActions({
            updateRole: UPDATE_ROLE
        }),
        async saveModifications() {
            const {id, description} = this.modifiedRole;
            await this.updateRole({id, description});
            this.quitEditMode();
        }
    },
    watch: {
        modifiedRole: {
            deep: true,
            handler(_newModifiedRole, _oldModifiedRole) {
                this.canSave = !isEqual(this.role, this.modifiedRole);
            }
        }
    }
})
</script>