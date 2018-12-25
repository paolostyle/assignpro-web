const { DefinePlugin } = require('webpack');

module.exports = {
  configureWebpack: {
    plugins: [
      new DefinePlugin({
        WEBPACK_BUILD_DATE: JSON.stringify(new Date().toISOString())
      })
    ]
  },
  lintOnSave: false,
  pluginOptions: {
    i18n: {
      locale: 'pl',
      fallbackLocale: 'pl',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
};
