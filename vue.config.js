module.exports = {
  transpileDependencies: ["vuetify", "vuex-persist"],
  devServer: {
    disableHostCheck: true
  },
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true
    }
  },

  pwa: {
    name: "Vue FESK"
  },

  configureWebpack: {
    devtool: 'source-map'
  }
};
