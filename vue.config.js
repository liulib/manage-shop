module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8888/api/private/v1',
        ws: true,
        changeOrigin: true
      }
    }
  }
}
