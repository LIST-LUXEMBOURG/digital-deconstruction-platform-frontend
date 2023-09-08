<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-container fluid class="centered">
    <v-row class="mx-auto" justify="center">
      <v-col cols="12" sm="6" md="4">
        <div v-if="isLoading">
          <v-progress-circular
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>

        <!-- Alert: result of the request -->
        <v-alert
          class="black--text"
          v-if="isSuccess === true"
          color="#4CAF50"
          dark
        >
          <v-row align="center">
            <v-icon x-large color="light-green lighten-1">{{
              mdiCheckCircle
            }}</v-icon>
            <v-col class="grow">{{ $t(alert.message) }}</v-col>
            <v-col class="shrink">
              <v-btn
                class="black--text"
                color="#8BC34A"
                @click="$router.push('/')"
                >{{ $t('mainPage') }}</v-btn
              >
            </v-col>
          </v-row>
        </v-alert>

        <!-- Alert: the token is invalid or expired -->
        <v-alert
          class="black--text"
          v-if="!user && !isLoading"
          color="#FFC107"
          dark
        >
          <v-row align="center">
            <v-icon
              class="black--text"
              x-large
              dark
              color="deep-orange accent-2"
              >{{ mdiAlertCircle }}</v-icon
            >

            <v-col class="black--text">
              <strong>{{
                $t('forgotPassword.invalidOrExpired')
              }}</strong></v-col
            >
            <v-col class="shrink">
              <v-btn
                class="black--text"
                color="deep-orange accent-2"
                @click="$router.push('/')"
                >{{ $t('mainPage') }}</v-btn
              >
            </v-col>
          </v-row>
        </v-alert>

        <!-- The reset password form (2nd step) -->
        <v-form
          v-else-if="user && !isLoading"
          ref="resetPasswordForm"
          v-model="valid"
        >
          <v-card v-show="isSuccess === null">
            <v-card-title>{{ $t('forgotPassword.formTitle') }}</v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pb-0">
              <div class="mb-2">
                <p>{{ $t('forgotPassword.formText') }}</p>
                <div class="d-flex flex-column ml-6 mb-3">
                  <strong
                    >{{ user.login }} : {{ user.firstName }} {{ user.name }}
                  </strong>
                  <strong>{{ user.email }}</strong>
                </div>
                <p>{{ $t('forgotPassword.enterNewPassword') }}</p>
              </div>
              <!-- Hidden username text field: accessibility -->
              <v-text-field
                v-show="false"
                autocomplete="username"
                :value="user.login"
              ></v-text-field>
              <v-text-field
                v-model="newPassword"
                type="password"
                autocomplete="new-password"
                :label="$t('users.newPassword')"
                :rules="[RequiredRule]"
                :append-icon="newPasswordToggle ? mdiEye : mdiEyeOff"
                :type="newPasswordToggle ? 'text' : 'password'"
                @click:append="newPasswordToggle = !newPasswordToggle"
                @input="onInputConfirmPassword"
                outlined
              ></v-text-field>
              <v-text-field
                v-model="confirmPassword"
                type="password"
                autocomplete="new-password"
                :error-messages="confirmPasswordError"
                :label="$t('users.changePassword.confirmPassword')"
                :rules="[requiredRule]"
                :append-icon="confirmPasswordToggle ? mdiEye : mdiEyeOff"
                :type="confirmPasswordToggle ? 'text' : 'password'"
                @click:append="confirmPasswordToggle = !confirmPasswordToggle"
                @input="onInputConfirmPassword"
                outlined
              ></v-text-field>
            </v-card-text>
            <v-card-actions class="pt-0 px-4 pb-4">
              <v-row>
                <v-col>
                  <v-btn
                    color="primary"
                    block
                    @click="submit"
                    :disabled="!valid"
                    :loading="isResetting"
                    >{{ $t('confirm') }}</v-btn
                  >
                </v-col>
                <v-col>
                  <v-btn
                    color="primary"
                    block
                    @click.prevent="$router.push('/')"
                    >{{ $t('cancel') }}</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

// icons
import { mdiEye, mdiEyeOff, mdiAlertCircle, mdiCheckCircle } from '@mdi/js';

import i18n from '../i18n';

export default Vue.extend({
  props: ['token'],
  data: () => {
    return {
      mdiEye,
      mdiEyeOff,
      mdiAlertCircle,
      mdiCheckCircle,
      valid: false,
      newPassword: '',
      newPasswordToggle: false,
      confirmPassword: '',
      confirmPasswordToggle: false,
      confirmPasswordError: '',
      user: null,
      // global isLoading
      isLoading: false,
      // on submit new password
      isResetting: false,
      isSuccess: null,

      alert: {
        message: '',
      },

      requiredRule: (v: string) => !!v || i18n.t('requiredField').toString(),
    };
  },
  async beforeMount() {
    this.isLoading = true;
    try {
      const res = await this.$http.auth.resetPassword(this.$route.params.token);
      this.user = res;
    } catch (error) {
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    async submit() {
      try {
        this.isResetting = true;
        this.isSuccess = await this.$http.auth.resetPasswordConfirmation({
          token: this.$route.params.token,
          password: this.newPassword,
        });

        if (this.isSuccess) {
          this.alert.message = 'forgotPassword.success';
          return;
        } else {
          this.alert.message = 'forgotPassword.invalidOrExpired';
          return;
        }
      } catch (error) {
      } finally {
        this.isResetting = false;
        (this.$refs.resetPasswordForm as any).reset();
      }
    },
    onInputConfirmPassword(value: string): void {
      this.confirmPasswordError = '';

      // one of the fields is not filled, nothing to do
      if (this.confirmPassword === '' || this.newPassword === '') return;

      this.confirmPasswordError =
        this.confirmPassword === this.newPassword
          ? ''
          : this.$i18n
              .t('users.changePassword.confirmPasswordError')
              .toString();
    },
  },
  computed: {
    RequiredRule() {
      return (v: string | null | undefined) => !!v || this.$t('requiredField');
    },
  },
});
</script>

<style lang="scss">
.centered {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
</style>
