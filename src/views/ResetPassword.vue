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
      <v-col cols="12" sm="6" md="3">
        <!-- Alert: result of the request -->
        <v-alert
          class="black--text"
          v-if="isSuccess !== null"
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

        <!-- Reset password formulaire: submit the provided email -->
        <v-form ref="resetPassword" v-model="valid">
          <v-card v-show="isSuccess === null">
            <v-card-title>{{ $t('forgotPassword.title') }}</v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pb-0">
              <div>{{ $t('forgotPassword.text') }}</div>
              <v-text-field
                name="email"
                type="email"
                v-model.lazy="email"
                outlined
                autocomplete="email"
                :label="emailLabel"
                :rules="emailRules"
                :validate-on-blur="true"
                @keyup.enter="submit"
              ></v-text-field>
              <div>{{ $t('forgotPassword.clickOk') }}</div>
            </v-card-text>
            <!-- Submit button & go to the main page button -->
            <v-card-actions class="pt-0 px-4 pb-4">
              <v-row>
                <v-col>
                  <v-btn
                    color="primary"
                    block
                    @click="submit"
                    :disabled="!valid"
                    :loading="isLoading"
                    >{{ $t('ok') }}</v-btn
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
import { SignIn } from '@/router/routes';
import i18n from '@/i18n';
import { GenericResponse } from '../plugins/httpClient';
import { mapMutations } from 'vuex';
import { ADD_NOTIFICATION } from '../store/notifications';
// icons
import { mdiAlertCircle, mdiCheckCircle } from '@mdi/js';

// get forbidden char for an email address
function getForbiddenChar(v: string) {
  // split the string into an array of chars
  const chars = v.split('');
  // filter illegal chars
  const array = chars.filter(char => !/^[a-zA-Z0-9_\.@-]*$/g.test(char));
  // remove duplicates and group items as a string (item are separated by "coma")
  const result = Array.from(new Set(array)).join(', ');
  return result;
}
function emailRule(value: string | null | undefined) {
  /**
   * match:
   * 1) letters, digits, hyphen, point and underscore.
   * 2) the @ character
   * 3) at least one letter followed by an optional hyphen
   * 4) at least one letter followed by a point
   * 5) between 2 and 3 letters
   */
  const regex = new RegExp(
    /[a-zA-Z0-9_.-]{2,}@[a-zA-Z]{1,}-?[a-zA-Z]{1,}\.[a-zA-Z]{2,3}$/,
  );

  if (!value) return i18n.t('invalidEmail') as string;

  // check if the value as the right format
  let res: boolean = regex.test(value.toLowerCase());

  // check if the value as forbidden chars
  let forbiddenChar = getForbiddenChar(value);

  // forbidden chars
  if (forbiddenChar !== '')
    return i18n.t('forbiddenCharacters', {
      forbiddenChar: `"${forbiddenChar}"`,
    }) as string;
  // invalid format
  if (!res) return i18n.t('invalidEmail') as string;

  return true;
}
export default Vue.extend({
  data() {
    return {
      mdiAlertCircle,
      mdiCheckCircle,
      email: null,
      valid: false,
      emailRules: [(v: string) => emailRule(v)],
      isLoading: false,
      isTimeout: false,
      isSuccess: null,
      alert: {
        type: 'warning',
        message: '',
      },
    };
  },
  methods: {
    ...mapMutations({
      addNotification: ADD_NOTIFICATION,
    }),
    async submit() {
      this.isLoading = true;

      /** 30 sec timeout */
      const t_id = setTimeout(() => {
        this.isLoading = false;
        this.isTimeout = true;
        this.addNotification({
          color: 'error',
          message: this.$i18n.t('timeout').toString(),
        });
      }, 30000);

      try {
        // submit the email and the frontend server url
        this.isSuccess = await this.$http.auth
          .requestResetPassword(this.email, window.location.origin)
          .then(GenericResponse);

        /**
         * if the response is false and there is no timeout,
         * inform the user that the provided email is wrong (no user with this specific email)
         */
        if (this.isSuccess === false && !this.isTimeout) {
          // notify no user known with the provided Email
          this.addNotification({
            color: 'error',
            message: this.$i18n
              .t('forgotPassword.undefinedEmail', { email: this.email })
              .toString(),
          });
        } else if (this.isSuccess === true && !this.isTimeout) {
          /**
           * if the response is true
           * inform the user that he/she must have received an email to reset his/her password.
           */

          this.alert.type = 'success';
          this.alert.message = this.$i18n
            .t('forgotPassword.instructionByEmail', { email: this.email })
            .toString();
          return;
        }
      } catch (e) {
        switch (e.messageCode) {
          case 'userNotFound':
            this.addNotification({
              color: 'error',
              message: this.$i18n
                .t('forgotPassword.undefinedEmail', { email: this.email })
                .toString(),
            });
            break;
          case 'cannotSendEmail':
            this.addNotification({
              color: 'error',
              message: this.$i18n
                .t(e.messageCode, { email: this.email })
                .toString(),
            });
            break;
          default:
            this.addNotification({
              color: 'error',
              message: this.$i18n.t(e.message).toString(),
            });
        }
      } finally {
        clearTimeout(t_id);
        this.isTimeout = false;
        this.isLoading = false;
      }
    },
    toHome() {
      this.$router.push({
        name: SignIn.name,
        params: { lang: this.$i18n.locale },
      });
    },
  },
  computed: {
    emailLabel() {
      return this.$i18n.t('users.email');
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
