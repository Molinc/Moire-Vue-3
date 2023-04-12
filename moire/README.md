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
Используем маску `v-money3` (см. https://www.npmjs.com/package/v-money3). Места применения: компонент `BaseInputCurrency`, место использования компонентов - фильтры `ProductFilter.vue`. Порядок использования:
1. добавляем библиотеку `import { Money3Directive, unformat } from 'v-money3'` (можно также использовать функцию `format` - она позволит применить маску к числовому значению);
2. в data-блоке компонента создаем переменную config (в нашем случае priceConfig), где указываем параметры форматирования. Данная конфигурация используется как в элементе `<input>`, так и в качестве параметра в функциях `format`/`unformat`;
3. подключаем директиву `directives: { money3: Money3Directive }` в компоненте;
4. в шаблоне для инпута добавляем атрибут `v-money3="priceConfig"`, а для атрибута модели в обязательном порядке проставляем модификатор `lazy`: `v-model.lazy="currentPriceFrom"`;

###
