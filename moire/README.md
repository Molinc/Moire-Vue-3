# moire

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## НОВЫЕ ВОЗМОЖНОСТИ

### Валютная маска

Используем маску `v-money3` (см. <https://www.npmjs.com/package/v-money3>). Места применения: компонент `BaseInputCurrency`, место использования компонентов - фильтры `ProductFilter.vue`. Порядок использования:

1. добавляем библиотеку `import { Money3Directive, unformat } from 'v-money3'` (можно также использовать функцию `format` - она позволит применить маску к числовому значению);
2. в data-блоке компонента создаем переменную config (в нашем случае priceConfig), где указываем параметры форматирования. Данная конфигурация используется как в элементе `<input>`, так и в качестве параметра в функциях `format`/`unformat`;
3. подключаем директиву `directives: { money3: Money3Directive }` в компоненте;
4. в шаблоне для инпута добавляем атрибут `v-money3="priceConfig"`, а для атрибута модели в обязательном порядке проставляем модификатор `lazy`: `v-model.lazy="currentPriceFrom"`;

### Новые спиннеры

Используем библиотеку epic-spinners, позволяющую без труда использовать несколько видов спиннеров для Vue 3. Применяются во всех местах, где идет AJAX-загрузка данных. Система спиннеров включает базовый компонент `@/components/base/spinners/BaseSpinner.vue`, миксин из папки `@/mixins/baseSpinnerMixin.js` с полным списком используемых параметров, а также компоненты непосредственных спиннеров различных типов, в частности, `SpinnerRhomuses.vue` и `SpinnerSpring.vue`. Порядок использования:

1. добавляем компонент с финальной версией спиннера, например, `import SpinnerSpring from '@/components/base/spinners/SpinnerSpring.vue'`;
2. добавляем импортированный компонент в список компонентов `components: { SpinnerSpring }`;
3. в шаблоне создаем блок типа `<SpinnerSpring />` со списком атрибутов:
  3.1. флаг видимости (когда компонент будет отображаться): `:visible="true/false"`;
  3.2. размер в текстовом формате: `size="..."`, где используются значения `tiny`/`small`/`medium`/`large`/`huge`;
  3.3. цвет (необязательный): `color="blue/#21f3ed"`, при отсутствии которого выставляется цвет по умолчанию (розовый, цвет primary-кнопок на сайте);

###
