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
        <v-form ref="selfRegistrationForm" v-model="valid">
          <v-card v-if="isSuccess !== true">
            <v-card-title>
              {{ $t('selfRegistration.title') }}
            </v-card-title>
            <v-card-subtitle>
              {{ $t('selfRegistration.sub-title') }}
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text>
              <v-text-field
                name="firstName"
                type="text"
                v-model="newUser.firstName"
                outlined
                :label="newUserFirstNameLabel"
                :rules="rules.firstName"
                @keyup.enter="submit"
                dense
              >
              </v-text-field>
              <v-text-field
                name="name"
                type="text"
                v-model="newUser.name"
                outlined
                :label="newUserNameLabel"
                :rules="rules.name"
                @keyup.enter="submit"
                dense
              >
              </v-text-field>
              <v-text-field
                name="login"
                type="text"
                v-model="newUser.login"
                outlined
                :label="newUserLoginLabel"
                :rules="rules.login"
                @keyup.enter="submit"
                dense
              >
              </v-text-field>
              <v-text-field
                name="email"
                type="email"
                v-model="newUser.email"
                outlined
                :label="newUserEmailLabel"
                :rules="rules.email"
                @keyup.enter="submit"
                dense
              >
              </v-text-field>
              <p v-html="$t('selfRegistration.text')"></p>
            </v-card-text>
            <v-card-actions>
              <v-row>
                <v-col>
                  <v-btn
                    color="primary"
                    block
                    @click="submit"
                    :disabled="!valid"
                    :loading="isLoading"
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
import { SignIn } from '@/router/routes';
import i18n from '@/i18n';
import { UserToCreate } from '../store/users/types';
import { mapMutations } from 'vuex';
import { ADD_NOTIFICATION } from '../store/notifications';

import { mdiCheckCircle } from '@mdi/js';

// get forbidden char for an email address
function getForbiddenChar(v: string) {
  // split the string into an array of chars
  const chars = v.split('');
  // filter illegal chars
  const array = chars.filter((char) => !/^[a-zA-Z0-9_\.@-]*$/g.test(char));
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
function requiredRule(value: string) {
  return !!value || i18n.t('requiredField');
}

export default Vue.extend({
  name: 'SelfRegistration',
  data: () => {
    return {
      mdiCheckCircle,
      newUser: {} as UserToCreate,
      valid: false,
      isLoading: false,
      rules: {
        firstName: [(v: string) => requiredRule(v)],
        name: [(v: string) => requiredRule(v)],
        login: [(v: string) => requiredRule(v)],
        email: [(v: string) => requiredRule(v), (v: string) => emailRule(v)],
      },
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
    toHome() {
      this.$router.push({
        name: SignIn.name,
        params: { lang: this.$i18n.locale },
      });
    },
    async submit() {
      this.isLoading = true;

      /** 30 sec  timeout */
      // TODO notify the user that the error is a timeout error
      //const t_id = setTimeout(() => (this.isLoading = false), 30000);

      try {
        this.isSuccess = await this.$http.users.requestSelfRegistration(
          Object.assign({}, this.newUser),
        );
        if (this.isSuccess === false) {
          this.addNotification({
            message: this.$t('selfRegistration.loginOrEmailAlreadyUsed'),
            color: 'error',
          });
        } else {
          this.alert.message = this.$i18n
            .t('selfRegistration.emailSuccessfullySent', {
              email: this.newUser.email,
            })
            .toString();
          return;
        }

        // TODO notify user that (s)he as a new email
      } catch (error) {
        switch (error.messageCode) {
          case 'cannotSendEmail':
            this.addNotification({
              color: 'error',
              message: this.$i18n
                .t(error.messageCode, { email: this.newUser.email })
                .toString(),
            });
            break;
          default:
            this.addNotification({
              color: 'error',
              message: this.$i18n.t(error.message).toString(),
            });
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
  computed: {
    newUserFirstNameLabel() {
      return this.$i18n.t('users.firstName');
    },
    newUserNameLabel() {
      return this.$i18n.t('users.name');
    },
    newUserLoginLabel() {
      return this.$i18n.t('users.login');
    },
    newUserEmailLabel() {
      return this.$i18n.t('users.email');
    },
  },
  watch: {
    '$i18n.locale'() {
      (this.$refs.selfRegistrationForm as any).validate();
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
