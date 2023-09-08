<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-menu>
    <!-- The diplayed lang and also the list trigger -->
    <template v-slot:activator="{ on }">
      <v-btn text large v-on="on">{{ $i18n.locale.toUpperCase() }}</v-btn>
    </template>
    <!-- The list of languages -->
    <v-list>
      <v-list-item
        v-for="lang in languages"
        :key="lang"
        @click="switchLang(lang)"
      >
        <v-list-item-title>{{ lang.toUpperCase() }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>


<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'TheAppLangagueSwitcher',
  props: {
    langs: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      test: null,
      languages: this.langs.length ? this.langs : this.$i18n.availableLocales,
    };
  },

  methods: {
    switchLang(lang) {
      const currentLang = this.$i18n.locale;

      // stop condition, no need to refresh the page.
      if (lang === currentLang) return;

      const regex = /^\/[a-z]{2}/;

      const replacedPath = this.$route.path.replace(regex, `/${lang}`);
      this.$router.push(replacedPath);
    },
  },
});
</script>