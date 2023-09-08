<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <div>
    <v-alert
      v-model="showAlert"
      v-if="logoutReason"
      class="mx-auto my-5"
      :type="logoutReason.type"
      dismissible
      max-width="40em"
      >{{ $t(`login.${logoutReason.action}`) }}</v-alert
    >
    <v-container fluid class="centered">
      <v-row class="mx-auto" justify="center">
        <v-col cols="12" sm="6" md="4">
          <v-card>
            <v-card-title>{{ $t('login.signIn') }}</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-form ref="form" v-model="valid">
                <!-- Login -->
                <v-text-field
                  name="username"
                  v-model.lazy="username.model"
                  :placeholder="Username"
                  :prepend-inner-icon="username.icon"
                  :rules="UsernameRules"
                  @keyup.enter="validate"
                  @input="username.errorMsg = ''"
                  outlined
                  autocomplete="username"
                  :error-messages="username.errorMsg"
                />
                <!-- Password -->
                <v-text-field
                  name="password"
                  v-model.lazy="password.model"
                  :placeholder="Password"
                  :prepend-inner-icon="password.icon"
                  :rules="PasswordRules"
                  :append-icon="password.show ? mdiEye : mdiEyeOff"
                  :type="password.show ? 'text' : 'password'"
                  @click:append="password.show = !password.show"
                  @keyup.enter="validate"
                  @input="password.errorMsg = ''"
                  outlined
                  autocomplete="password"
                  :error-messages="password.errorMsg"
                />
              </v-form>
            </v-card-text>
            <v-card-actions class="pt-0 px-4 pb-4">
              <v-container fluid class="pb-0">
                <v-row>
                  <!-- Validate button -->
                  <v-col cols="12" class="pt-0">
                    <v-btn
                      color="primary"
                      :disabled="!valid"
                      @click="validate"
                      :dark="valid"
                      block
                      >{{ $t('validate') }}</v-btn
                    >
                  </v-col>
                </v-row>
                <v-row>
                  <v-divider class="pt-1"></v-divider>
                  <v-col cols="2" align-self="center" class="text-center">
                    <v-icon>{{ mdiLockQuestion }}</v-icon>
                  </v-col>
                  <v-col
                    cols="10"
                    class="d-flex flex-column align-center pt-1 text-center"
                  >
                    <div>
                      {{ $t('forgotPassword.forgot') }}
                    </div>
                    <div>
                      <a @click="forgotPassword">{{
                        $t('forgotPassword.clickHere')
                      }}</a>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-divider class="pt-1"></v-divider>
                  <v-col cols="2" align-self="center" class="text-center">
                    <v-icon>{{ mdiAccountPlus }}</v-icon>
                  </v-col>
                  <v-col
                    cols="10"
                    class="d-flex flex-column align-center pt-1 text-center"
                  >
                    <div>
                      {{ $t('selfRegistration.self-register') }}
                    </div>
                    <div>
                      <a @click="selfRegistration">{{
                        $t('selfRegistration.clickHere')
                      }}</a>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// icons
import {
  mdiEmail,
  mdiEye,
  mdiEyeOff,
  mdiFormTextboxPassword,
  mdiLockQuestion,
  mdiAccountPlus,
} from '@mdi/js';
// store
import { mapGetters } from 'vuex';
import { GET_INITIAL_ROUTE } from '@/store/app';
import {
  SIGN_IN_USERNAME_PASSWORD,
  GET_LOGOUT_REASON,
  SET_LOGOUT_REASON,
} from '@/store/auth';
// route
import { ResetPassword, SelfRegistration } from '@/router/routes';

export default {
  name: 'SignIn',
  data() {
    return {
      // icons
      mdiEye,
      mdiEyeOff,
      mdiLockQuestion,
      mdiAccountPlus,
      // is the form validated?
      valid: false,
      // form fields
      username: {
        model: undefined,
        // placeholder: Computed value i18n key
        icon: mdiEmail,
        errorMsg: '',
      },
      password: {
        model: undefined,
        // placeholder: Computed value i18n key
        icon: mdiFormTextboxPassword,
        show: false,
        errorMsg: '',
      },
      alert: true,
    };
  },
  methods: {
    async validate() {
      this.username.errorMsg = '';
      this.password.errorMsg = '';

      if (this.$refs.form.validate()) {
        try {
          await this.$store.dispatch(SIGN_IN_USERNAME_PASSWORD, {
            login: this.username.model,
            password: this.password.model,
          });

          this.$router.push({ name: 'projectsManagement' });
          
          return;
        } catch (error) {
          if (error instanceof TypeError) {
            this.username.model = '';
            this.password.model = '';
            this.loginError = { messageCode: 'authFailed' };

            this.username.errorMsg = this.$t(
              `login.${this.loginError.messageCode}`,
            );
            this.password.errorMsg = this.$t(
              `login.${this.loginError.messageCode}`,
            );
          } else if (error.statusCode !== 403) {
            this.username.model = '';
            this.password.model = '';

            this.loginError = error;

            // Traduce the eventual error kept in the SignIn view
            this.username.errorMsg = this.$t(
              `login.${this.loginError.messageCode}`,
            );
            this.password.errorMsg = this.$t(
              `login.${this.loginError.messageCode}`,
            );
          }
        }
      }
    },
    forgotPassword() {
      this.$router.push({
        name: ResetPassword.name,
        params: { lang: this.$i18n.locale },
      });
    },
    selfRegistration() {
      this.$router.push({
        name: SelfRegistration.name,
        params: { lang: this.$i18n.locale },
      });
    },
  },
  computed: {
    ...mapGetters({
      initialRoute: GET_INITIAL_ROUTE,
      logoutReason: GET_LOGOUT_REASON,
    }),

    // These variables are defined as computed to ensure that the i18n works properly
    Username() {
      return this.$t('login.login');
    },
    Password() {
      return this.$t('login.password');
    },
    UsernameRules() {
      return [(v) => !!v || this.$t('login.loginRequired')];
    },
    PasswordRules() {
      return [(v) => !!v || this.$t('login.passwordRequired')];
    },

    showAlert: {
      get() {
        return this.alert;
      },
      set(value) {
        if (value === false) this.$store.commit(SET_LOGOUT_REASON, null);
        this.alert = value;
      },
    },
  },
  watch: {
    /**
     * Workarounds to translate the error message below each input field when i18n changes
     *
     * First keep the value of the username.model and password.model
     * Then replace them by "space" or by "undefined".
     * Finaly, in a timeout function, update username.model and password.model with their old value
     *
     * The timeout is important, that will delegates the mutation of username.model and
     * password.model to the "next tick".
     */
    '$i18n.locale'() {
      // store locally the value before replacing the obj.model value
      const u = this.username.model;
      const p = this.password.model;
      // assign a temporary value to the obj.model
      this.username.model = !!u ? ' ' : undefined;
      this.password.model = !!p ? ' ' : undefined;
      const self = this;
      // replace the obj.model value with the old one contains in "u" and "p"
      window.setTimeout(() => {
        self.username.model = u;
        self.password.model = p;
      }, 50);

      // Traduce the eventual error kept in the SignIn view
      if (this.loginError && 'messageCode' in this.loginError) {
        this.username.errorMsg = this.$t(
          `login.${this.loginError.messageCode}`,
        );
        this.password.errorMsg = this.$t(
          `login.${this.loginError.messageCode}`,
        );
      }
    },
  },
};
</script>

<style lang="scss">
// Some adjustements for the form

// eye icon on the password field
.v-input__icon.v-input__icon--append button svg {
  height: 24px !important;
}

.centered {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

.v-divider {
  min-width: 100%;
}
</style>