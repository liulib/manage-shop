/*
 * @Author       : liulib
 * @Date         : 2020-06-12 17:07:52
 * @LastEditors  : liulib
 * @LastEditTime : 2020-07-31 11:23:39
 */

module.exports = {
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')
      // 使用externals加载cdn
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor',
        moment: 'moment',
        AMap: 'AMap'
      })
      // 挂载参数isProd到index.html中 用它来定制首页内容
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')

      // 使用externals加载cdn
      config.set('externals', {
        AMap: 'AMap'
      })

      // 挂载参数isProd到index.html中 用它来定制首页内容
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8888',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api/private/v1'
        }
      }
    }
  }
}
