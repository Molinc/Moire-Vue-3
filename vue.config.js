const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/Moire-Vue-3/', // ! название поддиректории, являющейся корневой на сайте, куда будет выложен проект (на гитхабе это moire-vue3)
});
