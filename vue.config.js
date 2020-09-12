module.exports = {
  "transpileDependencies": [
    "vuetify"
  ]
}

module.exports = {
  devServer: {
    port: 80,
    host: '192.168.1.2'
  }
}

module.exports = {
  //...
  configureWebpack: {
    devServer: {
      host: '10.1.1.1'
    }
  }
};