const path = require('path');
const { DefinePlugin, IgnorePlugin, ProvidePlugin } = require('webpack');

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        moment: path.resolve(__dirname, 'node_modules/moment'),
      }
    },
    plugins: [
      new DefinePlugin({
        WEBPACK_BUILD_DATE: JSON.stringify(new Date().toISOString())
      }),
      new IgnorePlugin(/^\.\/locale$/, /moment$/),
      new ProvidePlugin({
        introJs: ['intro.js', 'introJs']
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
    },
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  },
  productionSourceMap: false
};
