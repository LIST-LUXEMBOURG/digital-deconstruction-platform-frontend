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
        <div v-if="isUserLoading">
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
          v-if="!user && !isUserLoading"
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

        <v-form
          v-else-if="user && !isUserLoading"
          v-model="isValid"
          ref="confirmSelfRegistration"
        >
          <v-card v-if="isSuccess !== true">
            <v-card-title>
              {{ $t('selfRegistration.confirmRegistration') }}
            </v-card-title>
            <v-card-subtitle>
              {{ $t('selfRegistration.aboutToRegisterUser') }}
            </v-card-subtitle>
            <v-card-text>
              <div class="d-flex flex-column ml-6 mb-3">
                <strong
                  >{{ $t('users.firstName') }}: {{ user.firstName }}</strong
                >
                <strong>{{ $t('users.name') }}: {{ user.name }}</strong>
                <strong>{{ $t('users.login') }}: {{ user.login }}</strong>
                <strong>{{ $t('users.email') }}: {{ user.email }}</strong>
              </div>
              <p>{{ $t('selfRegistration.toCompleteRegistration') }}</p>
              <v-text-field
                name="password"
                v-model="password"
                :label="Password"
                :prepend-inner-icon="mdiFormTextboxPassword"
                :append-icon="passwordToggle ? mdiEyeOff : mdiEye"
                @click:append="passwordToggle = !passwordToggle"
                @input="onInputConfirmPassword"
                :rules="passwordRules"
                :type="passwordToggle ? 'text' : 'password'"
                outlined
                dense
              >
              </v-text-field>
              <v-text-field
                name="passwordConfirmation"
                v-model="passwordConfirmation"
                :label="ConfirmPassword"
                :prepend-inner-icon="mdiFormTextboxPassword"
                :append-icon="confirmPasswordToggle ? mdiEyeOff : mdiEye"
                @click:append="confirmPasswordToggle = !confirmPasswordToggle"
                @input="onInputConfirmPassword"
                :rules="passwordConfirmationRules"
                :error-messages="passwordConfirmationError"
                :type="confirmPasswordToggle ? 'text' : 'password'"
                outlined
                dense
              >
              </v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-row>
                <v-col>
                  <v-btn
                    color="primary"
                    block
                    :disabled="isLoading || !isValid"
                    :loading="isLoading"
                    @click="confirmUserRegistration(user)"
                    >{{ $t('selfRegistration.register') }}</v-btn
                  >
                </v-col>
                <v-col>
                  <v-btn
                    color="primary"
                    block
                    :disabled="isLoading"
                    @click="toHome"
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
import {
  mdiFormTextboxPassword,
  mdiEyeOff,
  mdiEye,
  mdiCheckCircle,
  mdiAlertCircle,
} from '@mdi/js';

import i18n from '@/i18n';
import { SignIn } from '@/router/routes';
import { mapMutations } from 'vuex';
import { ADD_NOTIFICATION } from '../store/notifications';
import { ListUser } from '../store/users/types';

function mandatoryRule(value: string) {
  return !!value || i18n.t('mandatoryField');
}

export default Vue.extend({
  data: () => {
    return {
      mdiFormTextboxPassword,
      mdiEyeOff,
      mdiEye,
      mdiCheckCircle,
      mdiAlertCircle,
      isUserLoading: false,
      isValid: false,
      isLoading: false,
      user: {} as ListUser,
      password: '',
      passwordConfirmation: '',
      passwordToggle: false,
      confirmPasswordToggle: false,
      passwordConfirmationError: '',
      passwordRules: [mandatoryRule],
      passwordConfirmationRules: [mandatoryRule],
      isSuccess: null,
      alert: {
        message: '',
      },
    };
  },
  methods: {
    ...mapMutations({
      addNotification: ADD_NOTIFICATION,
    }),
    /**
     * Check if the confirm password equal the password,
     * - Equal: return null
     * - Not equal: return an error message
     *
     * @param {string} value The data payload of the Event input
     */
    onInputConfirmPassword(value: string): void {
      this.passwordConfirmationError = '';

      // one of the fields is not filled, nothing to do
      if (this.password === '' || this.passwordConfirmation === '') return;

      this.passwordConfirmationError =
        this.passwordConfirmation === this.password
          ? ''
          : i18n.t('users.changePassword.confirmPasswordError').toString();
    },
    toHome() {
      this.$router.push({
        name: SignIn.name,
        params: { lang: this.$i18n.locale },
      });
    },
    async confirmUserRegistration(user: ListUser) {
      try {
        this.user = user;
        this.isLoading = true;
        this.isSuccess = await this.$http.users.selfRegistrationConfirmation({
          token: this.$route.params.token,
          password: this.passwordConfirmation,
        });
        if (this.isSuccess === false) {
          this.addNotification({
            message: 'users.userLoginAlreadyUsed',
            color: 'error',
          });
        } else {
          this.alert.message = this.$i18n
            .t('selfRegistration.success', {
              login: this.user.login,
              email: this.user.email,
            })
            .toString();
          return;
        }
      } catch (error) {
        // do nothing
      } finally {
        this.isLoading = false;
      }
    },
  },
  async beforeMount() {
    this.isUserLoading = true;
    this.user = await this.$http.users.getUserToRegister({
      token: this.$route.params.token,
    });
    this.isUserLoading = false;
  },
  computed: {
    Password() {
      return i18n.t('users.newPassword');
    },
    ConfirmPassword() {
      return i18n.t('users.changePassword.confirmPassword');
    },
  },
  watch: {
    '$route.params.token': function (newToken, oldToken) {
      if (newToken !== oldToken) this.$forceUpdate();
    },
    '$i18n.locale'() {
      (this.$refs.confirmSelfRegistration as any).validate();
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
