const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  // ! название поддиректории, являющейся корневой на сайте, куда будет выложен проект (на гитхабе это moire-vue3)
  publicPath: process.env.NODE_ENV === 'production' ? '/Moire-Vue-3/' : '/',
});
