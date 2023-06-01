const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/moire-vue3/', // ! название поддиректории, являющейся корневой на сайте, куда будет выложен проект (на гитхабе это moire-vue3)
});
