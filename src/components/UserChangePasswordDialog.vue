<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-container fluid>
    <!-- Update password by admin -->
    <v-dialog
      v-if="permission === 'user'"
      v-model="show"
      @click:outside.stop="cancel"
      @keydown.esc="cancel"
      :persistent="isLoading"
      max-width="420px"
    >
      <!-- Reset password form (for any user) -->
      <v-card v-if="!isSuccess" outlined>
        <v-card-title>{{ $t('users.resetPassword.title') }}</v-card-title>
        <v-card-text v-if="!isSuccess" class="pb-0">
          <p>
            {{
              $t('users.resetPassword.text', {
                login: user.login,
              })
            }}
          </p>
          <v-form v-model="isValid" ref="resetPasswordForm">
            <v-text-field
              v-model="newPassword"
              ref="resetPasswordInput"
              :loading="isLoading"
              :disabled="isLoading"
              :rules="textFieldRules"
              :label="$t('users.newPassword')"
              autocomplete="new-password"
              outlined
            ></v-text-field>
          </v-form>
        </v-card-text>
        <!-- Actions: update password (reset) / cancel -->
        <v-card-actions class="mx-4 pt-0 mb-2">
          <v-row>
            <v-col>
              <v-btn
                color="primary"
                :disabled="isLoading || !isValid"
                @click="reset"
                block
                >{{ $t('reset') }}</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                color="primary"
                @click="cancel"
                @focus="onCancelFocus"
                :disabled="isLoading"
                block
                >{{ $t('cancel') }}</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>

      <!-- Success response -->
      <v-card v-else outlined>
        <v-card-title>{{ successTitle }}</v-card-title>
        <v-card-text class="pb-0">
          <v-textarea
            ref="textToCopy"
            hide-details="auto"
            :auto-grow="true"
            :readonly="true"
            :value="successText"
            :hint="copiedToClipboard"
            outlined
          >
            <template v-slot:append>
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" v-on="on" icon @click="textToCopy">
                    <v-icon>{{ mdiContentCopy }}</v-icon>
                  </v-btn>
                </template>
                <span>{{
                  $t('users.resetPassword.successTextarea.copyUserMessage')
                }}</span>
              </v-tooltip>
            </template>
          </v-textarea>
        </v-card-text>
        <!-- Actions: close -->
        <v-card-actions class="mx-4 mb-2">
          <v-btn color="primary" @click="cancel" block>{{ $t('close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Update own password -->
    <v-dialog
      v-else-if="permission === 'ownUser'"
      v-model="show"
      @click:outside.stop="cancel"
      @keydown.esc="cancel"
      :persistent="isLoading"
      max-width="420px"
    >
      <v-form
        v-model="isValid"
        ref="changePasswordForm"
        @submit.prevent="change"
        id="change-password"
      >
        <v-card v-if="!isSuccess">
          <v-card-title>{{ $t('users.changePassword.title') }}</v-card-title>
          <v-card-text class="pb-0">
            <!-- Hidden username text field: accessibility -->
            <v-text-field
              v-show="false"
              autocomplete="username"
              :value="user.login"
            ></v-text-field>

            <v-text-field
              v-model="oldPasswordModel"
              :label="oldPasswordLabel"
              :rules="textFieldRules"
              :type="oldPasswordToggle ? 'text' : 'password'"
              :append-icon="oldPasswordToggle ? mdiEyeOff : mdiEye"
              @click:append="oldPasswordToggle = !oldPasswordToggle"
              tabindex="1"
              autocomplete="current-password"
              outlined
            ></v-text-field>
            <v-text-field
              v-model="passwordModel"
              :label="passwordLabel"
              :rules="textFieldRules"
              :type="passwordToggle ? 'text' : 'password'"
              :append-icon="passwordToggle ? mdiEyeOff : mdiEye"
              @click:append="passwordToggle = !passwordToggle"
              @input="onInputConfirmPassword"
              tabindex="2"
              autocomplete="new-password"
              outlined
            ></v-text-field>
            <v-text-field
              v-model="confirmPasswordModel"
              :label="confirmPasswordLabel"
              :rules="textFieldRules"
              :error-messages="confirmPasswordError"
              :type="confirmPasswordToggle ? 'text' : 'password'"
              :append-icon="confirmPasswordToggle ? mdiEyeOff : mdiEye"
              @click:append="confirmPasswordToggle = !confirmPasswordToggle"
              @input="onInputConfirmPassword"
              tabindex="3"
              autocomplete="new-password"
              outlined
            ></v-text-field>
          </v-card-text>
          <v-card-actions class="mx-4 pt-0">
            <v-row>
              <v-col>
                <v-btn
                  type="submit"
                  color="primary"
                  :disabled="isLoading || !isValid"
                  tabindex="4"
                  block
                  form="change-password"
                  >{{ $t('users.changePassword.validate') }}</v-btn
                >
              </v-col>
              <v-col>
                <v-btn
                  color="primary"
                  @click="cancel"
                  :disabled="isLoading"
                  tabindex="5"
                  block
                  >{{ $t('cancel') }}</v-btn
                >
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { mdiContentCopy, mdiEye, mdiEyeOff } from '@mdi/js';

import { FETCH_SINGLE_ACDB, GET_ACDB } from '../store/acdb';
import { ADD_NOTIFICATION } from '../store/notifications';
import {
  UPDATE_USER,
  GET_CURRENT_USER,
  UPDATE_USER_PASSWORD,
} from '../store/users';

import i18n from '@/i18n';
import { TranslateResult } from 'vue-i18n';

function mandatoryRule(value: string) {
  return !!value || i18n.t('mandatoryField');
}

interface Data {
  // icons
  mdiContentCopy: string;
  mdiEye: string;
  mdiEyeOff: string;
  // common data
  isLoading: boolean;
  isSuccess: boolean;
  isValid: boolean;
  // copy to clipboard
  clipboardText: string | TranslateResult;
  clipboardTimeout: null | number | any;
  copiedToClipboard: string | TranslateResult | null;
  // reset password
  newPassword: string | null;
  successTitle: string | TranslateResult;
  // change own password
  oldPasswordModel: string;
  oldPasswordToggle: boolean;
  passwordModel: string;
  passwordToggle: boolean;
  confirmPasswordModel: string;
  confirmPasswordToggle: boolean;
  confirmPasswordError: string | TranslateResult | null;
  textFieldRules: Function[];
}

export default Vue.extend({
  name: "UserChangePasswordDialog",
  props: ['user', 'show'],
  data(): Data {
    return {
      // icons
      mdiEye,
      mdiEyeOff,
      mdiContentCopy,
      // common data
      isLoading: false,
      isSuccess: false,
      isValid: false,
      // copy to clipboard
      clipboardText: this.$i18n.t('clipboardCopied'),
      clipboardTimeout: null,
      copiedToClipboard: '',
      // reset password
      newPassword: '',
      successTitle: i18n.t('users.resetPassword.successfullyReset'),
      // change own password
      oldPasswordModel: '',
      oldPasswordToggle: false,
      passwordModel: '',
      passwordToggle: false,
      confirmPasswordModel: '',
      confirmPasswordToggle: false,
      confirmPasswordError: '',
      textFieldRules: [mandatoryRule],
    };
  },
  beforeMount() {
    // Make sure the right to update the users are fetched and in the store
    if (this.getAcdb('update', 'user') === undefined)
      this.fetchSingleAcdb('update', 'user');
    if (this.getAcdb('update', 'ownUser') === undefined)
      this.fetchSingleAcdb('update', 'ownUser');
  },
  methods: {
    ...mapActions({
      fetchSingleAcdb: FETCH_SINGLE_ACDB,
      updateUser: UPDATE_USER,
    }),
    /**
     * Reset the user password identified by userId.
     * @returns {void|Error} An error or an empty response.
     */
    async reset(): Promise<void> {
      try {
        this.isLoading = true;

        /** The HTTP request is triggered from a vuex action
         *
         * @param userId The user id
         * @param newPassword The new password
         * @param isOwnUser (optional) If the currentUser = selected User
         */
        await this.$store.dispatch(UPDATE_USER_PASSWORD, {
          userId: this.user.id,
          newPassword: this.newPassword,
          isOwnUser: false,
        });

        this.isSuccess = true;
        this.isLoading = false;
        this.$store.commit(ADD_NOTIFICATION, {
          message: this.successTitle,
          color: 'success',
        });
      } catch (error) {
        this.$store.commit(ADD_NOTIFICATION, {
          message: error,
          color: 'error',
        });
        // To stop the modal from loading in any case.
      } finally {
        this.isLoading = false;
      }
    },
    /**
     * Update the user own password.
     * @returns {void|Error} An error or an empty response.
     */
    async change(): Promise<void> {
      try {
        this.isLoading = true;

        await this.$store.dispatch(UPDATE_USER_PASSWORD, {
          currentPassword: this.oldPasswordModel,
          newPassword: this.passwordModel,
          isOwnUser: true,
        });

        this.$store.commit(ADD_NOTIFICATION, {
          message: 'passwordSuccessfullyChanged',
          color: 'success',
        });
        this.isLoading = false;
        this.cancel(null);
      } catch (error) {
        console.log('error', error);
        this.$store.commit(ADD_NOTIFICATION, {
          message: error,
          color: 'error',
        });
      } finally {
        this.isLoading = false;
      }
    },
    /**
     * The cancel method is responsible of closing the modal and set the
     * variables in their initial state, the action can be triggered by:
     *
     *  - clicking a button,
     *  - clicking outside the dialog,
     *  - releasing the ESC key
     *
     * The cancel method can be executed only if the page isn't loading.
     */
    cancel(value: any): void {
      if (this.permission === 'user' && !this.isSuccess)
        (this.$refs.resetPasswordForm as any).reset();
      if (this.permission === 'ownUser' && !this.isSuccess)
        (this.$refs.changePasswordForm as any).reset();
      if (!this.isLoading) {
        this.$emit('update:show');
        // reset password
        if (this.permission === 'user' && !this.isSuccess)
          (this.$refs.resetPasswordForm as any).reset();

        this.isSuccess = this.isLoading = false;
        this.copiedToClipboard = '';
        this.newPassword = '';

        // change own password
        if (this.permission === 'ownUser' && !this.isSuccess)
          (this.$refs.changePasswordForm as any).reset();

        this.confirmPasswordModel = '';
        this.confirmPasswordError = '';

        this.oldPasswordToggle = this.passwordToggle = this.confirmPasswordToggle = false;
      }
    },
    /**
     * Copy text in area (input or textarea) in the clipboard.
     *
     * Display a hint for 5sec to inform that the text is correctly copied.
     *
     * TODO: create a generic version of this function and export it in the "utils"
     */
    textToCopy(): void {
      if (this.clipboardTimeout !== null) clearTimeout(this.clipboardTimeout);
      const textarea = this.$refs.textToCopy as any;
      const text = textarea.$el.querySelector('textarea');
      text.focus();
      text.select();
      document.execCommand('copy');
      (document.getSelection() as Selection).removeAllRanges();
      this.copiedToClipboard = this.clipboardText;
      const self = this;

      this.clipboardTimeout = setTimeout(
        () => (self.copiedToClipboard = ''),
        5000,
      );
    },
    /**
     * Check if the confirm password equal the password,
     * - Equal: return null
     * - Not equal: return an error message
     *
     * @param {string} value The data payload of the Event input
     */
    onInputConfirmPassword(value: string): void {
      this.confirmPasswordError = '';

      // one of the fields is not filled, nothing to do
      if (this.confirmPasswordModel === '' || this.passwordModel === '') return;

      this.confirmPasswordError =
        this.confirmPasswordModel === this.passwordModel
          ? null
          : i18n.t('users.changePassword.confirmPasswordError');
    },
    onCancelFocus(value: string): void {
      if (this.permission === 'user' && !this.isSuccess)
        (this.$refs.resetPasswordForm as any).reset();
    },
  },
  computed: {
    ...mapGetters({
      getAcdb: GET_ACDB,
      currentUser: GET_CURRENT_USER,
    }),
    successText() {
      const localePath = 'users.resetPassword.successTextarea';
      const { firstName, name, email, login } = this.user;
      const newPassword = this.newPassword;

      // add "as string otherwise Vetur extension and Vue trigger an error"
      let text = i18n.t(`${localePath}.user`, {
        firstName,
        name,
        login,
      }) as string;
      text += '\n' + i18n.t(`${localePath}.email`, { email });
      text += '\n\n' + i18n.t(`${localePath}.resetText`);
      text += '\n\n' + i18n.t(`${localePath}.newPassword`, { newPassword });
      text += '\n\n' + i18n.t(`${localePath}.resetNote`);

      return text;
    },
    /** Determine which form to display, a form for editing the own user or any use. */
    permission(): string | null {
      let ownUserAcdb = this.getAcdb('update', 'ownUser');
      let isSameUser = this.user.id === this.currentUser.id;
      if (ownUserAcdb.hasAccess && isSameUser) return 'ownUser';

      let anyUserAcdb = this.getAcdb('update', 'user');
      if (anyUserAcdb.hasAccess) return 'user';

      return null;
    },
    oldPasswordLabel() {
      return i18n.t('users.changePassword.oldPassword');
    },
    passwordLabel() {
      return i18n.t('users.newPassword');
    },
    confirmPasswordLabel() {
      return i18n.t('users.changePassword.confirmPassword');
    },
  },
});
</script>