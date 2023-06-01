# Интернет-магазин Moire

Проект интернет-магазина Moire, выполненный на фреймворке Vue 3.

Цель проекта: отработка навыков создания проектов с использованием фреймворка Vue 3.

Включает в себя:

1. Главную страницу, представляющую из себя каталог товаров с возможностью фильтрации списка;
2. Страницу товара, переход на которую возможен по клику товара из каталога;
3. Корзину с возможностью изменения содержимого;
4. Страницу оформления заказа;
5. Страницу сформированного заказа.

Доступен для ознакомления на gh-pages по [ссылке](ishuvaloff.github.io/moire-vue3/#/).

## Установка проекта

`npm install`

### Компиляция и запуск в режиме разработки

`npm run serve`

### Компиляция и финальная сборка

`npm run build`

### Запуск линтера

`npm run lint`

### Кастомные конфигурации

See [Configuration Reference](https://cli.vuejs.org/config/).

## Возможности проекта

Изначально проект собирался на фреймворке Vue версии 2, однако впоследствии был прокачан до версии 3 с использованием новых возможностей фреймворка. Некоторые особенности сборки:

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

### Скролл страницы при маршрутизированных переходах

Скролл страницы настраивается в `router/index.js` в следующем порядке:

1. создается маршрутизатор (роутер) функцией `createRouter` (если требуется убрать лишних хэш, историю добавляем через `createWebHistory`);
2. внутри в качестве параметра указываем функцию `scrollBehavior`;
3. отмотку страницы в самый верх (`position: { top: 0, left: 0 }`) производим только в случае, если нет сохраненной ранее позиции по данной странице и если страница перехода отличается от покидаемой страницы;
4. в остальных случаях создаем переменную `position: { top: savedPosition.top, left: savedPosition.left, behavior: 'smooth' }`, в которой указываем left, top и флаг плавной прокрутки до нужного места behavior;
5. сам скролл к созданной позиции производим через таймаут, т.к. требуется, чтобы все нужные элементы DOM отрендерились (например, грид с элементами может не прогрузиться полностью и отмотка вниз до нужного места не совершится - окажется слишком маленькой);

### Передача дополнительных параметров при маршрутизации (не включенных в params в маршрутах)

Не нашел лучшего варианта, кроме как передавать параметры (например, настройки фильтра для каталога при возврате из хлебных крошек или передача выбранного цвета при открытии карточки товара из каталога) через объект `query: {}` в параметре `<router-link :to="{ name: 'product', params: { id: product.id }, query: { color } }"/>`. В этом случае при открытии страницы все параметры из query превращаются в параметры url, а конкретно в данном случае в строку <http://localhost:8080/product/7?color=81> (к примеру). Далее переданный параметр можно всегда прочесть с помощью обращения к `this.$route.query.color`.

Компонент хлебных крошек (`@/components/base/BaseBreadcrumbs.vue`) отображает js-способ маршрутизации. Данный компонент взят из одноименного проекта на Vue 2, но с изменениями:

1. переход назад по хлебным крошкам со страницы товара (см. `@/views/ProductView.vue`) подразумевает выход на Каталог с предустановкой фильтров;
2. во Vue 3 больше нельзя передавать параметры в блоке `params: {...}`, если эти параметры не предусмотрены в маршрутизаторе router;
3. для этого требуется использовать объект `query: {...}`, который запишет передаваемые параметры в url-адрес, и затем извлекать из него данные после перехода на нужную страницу;
4. при изменении значения категории в фильтре (да и не только категории, в перспективе и других фильтров) следует изменять параметры в адресной строке без перезагрузки страницы. Делается это с помощью функции маршрутизатора (роутера) replace: `this.$router.replace({ query: {categoryId: ... } })`;

Аналогично выполнен переход из каталога (конкретно из `@/components/products/ProductItem.vue`) в карточку товара (`@/views/ProductView.vue`). Здесь показывается html-способ маршрутизации, а в качестве объекта query передается выбранный еще в каталоге цвет товара.
