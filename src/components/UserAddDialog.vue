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
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
    @keydown.esc="cancelAddUser"
  >
    <v-card outlined class="py-10">
      <v-card-title class="ma-auto">{{ $t("newUserAccount") }}</v-card-title>
      <v-card-text>
        <v-form ref="addUserForm" :lazy-validation="lazy" v-model="formValid" class="ma-auto">
          <v-container fluid class="fill-height">
            <v-row align="center" justify="center">
              <v-col cols="10" lg="6">
                <!-- User login -->
                <div>
                  <v-text-field
                    id="login"
                    v-if="canAddAttribute('login')"
                    :label="$t('users.login')"
                    v-model="user.login"
                    :rules="loginRules"
                    :error-messages="loginErrorMessages"
                    @focus="loginErrorMessages = ''"
                    outlined
                    dense
                  ></v-text-field>
                </div>
                <!-- User firstname -->
                <div>
                  <v-text-field
                    v-if="canAddAttribute('firstName')"
                    :label="$t('users.firstName')"
                    v-model="user.firstName"
                    :rules="firstNameRules"
                    outlined
                    dense
                  ></v-text-field>
                </div>
                <!-- User name -->
                <div>
                  <v-text-field
                    v-if="canAddAttribute('name')"
                    :label="$t('users.name')"
                    v-model="user.name"
                    :rules="nameRules"
                    outlined
                    dense
                  ></v-text-field>
                </div>
                <!-- User email -->
                <div>
                  <v-text-field
                    v-if="canAddAttribute('email')"
                    :label="$t('users.email')"
                    v-model="user.email"
                    :rules="emailRules"
                    outlined
                    dense
                  ></v-text-field>
                </div>
                <!-- User email -->
                <div>
                  <v-text-field
                    v-if="canAddAttribute('password')"
                    :label="$t('users.password')"
                    v-model="user.password"
                    :rules="passwordRules"
                    outlined
                    dense
                  ></v-text-field>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <!-- active -->
        <div class="d-flex">
          <div class="ma-auto">
            <v-switch
              v-if="canAddAttribute('active')"
              :label="actif ? $t('users.active') : $t('users.inactive')"
              v-model="actif"
              @change="activeChanged"
            ></v-switch>
          </div>
          <!-- blocked -->
          <div class="ma-auto">
            <v-switch
              v-if="canAddAttribute('blocked')"
              :label="$t('users.blocked')"
              v-model="user.blocked"
              outlined
              dense
            ></v-switch>
          </div>
        </div>
        <!-- blockingReason  -->
        <v-expand-transition>
          <v-textarea
            v-if="user.blocked && canAddAttribute('blockingReason')"
            :label="$t('users.blockingReason')"
            v-model="user.blockingReason"
            outlined
            no-resize
            auto-grow
          />
        </v-expand-transition>
      </v-card-text>
      <!-- Actions -->
      <v-card-actions v-if="canAddUser(user)">
        <div class="ml-auto">
          <v-btn color="primary" @click="save" :disabled="!formValid" class="ma-2">{{ $t("save") }}</v-btn>
          <v-btn color="primary" @click="cancelAddUser" class="ma-2">
            {{
            $t("cancel")
            }}
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";

import { ListUser, ADD_USER } from "../store/users";
import { GET_ACDB, FETCH_SINGLE_ACDB } from "../store/acdb";
import { GET_CURRENT_USER } from "../store/users";
import i18n from "@/i18n";
import { filter, uniq } from "lodash-es";

function getForbiddenChar(v: string) {
  return (
    uniq(filter(v, char => !/^[a-zA-ZÀ-ÿ0-9, ,',.,+,@,-]*$/g.test(char)))
      // add ", " between illegal characters
      .join(", ")
  );
}

export default Vue.extend({
  name: "UserAddDialog",
  props: {
    exitAddUserForm: {
      type: Function,
      required: false
    },
    attributesToAdd: {
      type: Array || undefined,
      required: false
    },
    show: {
      type: Boolean,
      required: true
    }
  },
  data: () => {
    return {
      user: {} as ListUser,
      formValid: false,
      lazy: false,
      actif: true,
      errorMessage: "",
      loginErrorMessages: "",
      loginRules: [
        (v: string) => !!v || i18n.t("mandatoryField"),
        (v: string) =>
          /^[a-zA-ZÀ-ÿ0-9, ,',.,+,@,-]*$/g.test(v) ||
          i18n.t("forbiddenCharacters", { forbiddenChar: getForbiddenChar(v) })
      ],
      firstNameRules: [
        (v: string) => !!v || i18n.t("mandatoryField"),
        (v: string) =>
          /^[a-zA-ZÀ-ÿ0-9, ,',.,+,@,-]*$/g.test(v) ||
          i18n.t("forbiddenCharacters", { forbiddenChar: getForbiddenChar(v) })
      ],
      nameRules: [
        (v: string) => !!v || i18n.t("mandatoryField"),
        (v: string) =>
          /^[a-zA-ZÀ-ÿ0-9, ,',.,+,@,-]*$/g.test(v) ||
          i18n.t("forbiddenCharacters", { forbiddenChar: getForbiddenChar(v) })
      ],
      emailRules: [
        // The email must fullfill the regexp or be an empty string (or null), otherwise it triggers the error msg
        (v: string | null | undefined) =>
          v === null ||
          v === undefined ||
          /.+@.+\..+/.test(v as string) ||
          (v as string).length === 0 ||
          i18n.t("invalidEmail"),
        (v: string) =>
          /^[a-zA-ZÀ-ÿ0-9, ,',.,+,@,-]*$/g.test(v) ||
          i18n.t("forbiddenCharacters", { forbiddenChar: getForbiddenChar(v) })
      ],
      passwordRules: [(v: string) => !!v || i18n.t("mandatoryField")]
    };
  },
  beforeMount() {
    // Make sure the right to update the users are fetched and in the store
    if (this.getAcdb("create", "user") === undefined)
      this.fetchSingleAcdb("create", "user");
  },
  methods: {
    ...mapActions({
      fetchSingleAcdb: FETCH_SINGLE_ACDB,
      addUser: ADD_USER
    }),
    activeChanged(value: boolean) {
      this.user.active = value;
    },
    canAddUser(user: ListUser) {
      return this.getAcdb("create", "user").hasAccess === true;
    },
    canAddAttribute(attributeName: string) {
      if (this.attributesToAdd && this.attributesToAdd.length !== 0) {
        // If the current user wants to update it's own information
        return this.attributesToAdd.includes(attributeName);
      }
    },
    async save() {
      try {
        await this.addUser(this.user);
        this.loginErrorMessages = "";
        (this.$refs.addUserForm as any).reset();
        this.exitAddUserForm();
      } catch (error) {
        this.errorMessage = error;
        this.loginErrorMessages = this.$t(
          `users.${this.errorMessage}`
        ).toString();
      }
    },
    cancelAddUser() {
      this.loginErrorMessages = "";
      (this.$refs.addUserForm as any).reset();
      this.actif = true;
      this.exitAddUserForm();
    }
  },
  computed: {
    ...mapGetters({
      getAcdb: GET_ACDB,
      currentUser: GET_CURRENT_USER
    })
  },
  watch: {
    "$i18n.locale"() {
      this.loginErrorMessages = this.$t(
        `users.${this.errorMessage}`
      ).toString();
    },
    show: function(newVal, oldVal) {
      if (newVal === true && this.$refs.addUserForm) {
        this.user = {} as ListUser;
        (this.$refs.addUserForm as any).reset();
        (this.$refs.addUserForm as any).resetValidation();
      }
    }
  }
});
</script>
