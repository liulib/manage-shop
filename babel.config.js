const productionPlugin = []
// 判断是否是生产环境，决定是否加入插件
if (process.env.NODE_DEV === 'production') {
  productionPlugin.push('transform-remove-console')
}
module.exports = {
  presets: [['@babel/preset-env', { modules: false }]],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    '@babel/plugin-transform-runtime',
    ...productionPlugin
  ]
}
