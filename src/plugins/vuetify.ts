/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

import colors from '@/theme/export.scss';

export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg',
  },
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: colors,
    },
  },
});
