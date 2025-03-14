# Swiper Select Viewport

## Описание проекта

Этот проект реализует функциональность кастомного выбора чекбоксов с использованием класса `CheckboxSelection` и интерактивного слайдера на основе `Swiper.js`. Приложение автоматически инициализирует несколько экземпляров `CheckboxSelection` с различными параметрами и настраивает `Swiper` для удобной навигации по элементам.

## Основные технологии

- **TypeScript**
- **Swiper.js** (для слайдера)
- **Кастомный класс `CheckboxSelection`** (для работы с чекбоксами)

## Установка и запуск

1. Склонируйте репозиторий:

   ```sh
   git clone https://github.com/your-repository/swiper-select-viewport.git
   cd swiper-select-viewport
   ```

2. Установите зависимости:

   ```sh
   npm install
   ```

3. Запустите локальный сервер (при наличии конфигурации):

   ```sh
   npm start
   ```

## Файловая структура

```
swiper-select-viewport/
│── src/
│   ├── main.ts  # Главный файл, инициализирующий Swiper и CheckboxSelection
│   ├── modules/
│   │   ├── checkbox-selection.ts  # Класс для работы с чекбоксами
│── public/
│── README.md  # Документация проекта
│── package.json
│── tsconfig.json
```

## Использование

### 1. `CheckboxSelection`
Этот класс позволяет создавать кастомные чекбоксы.

Пример использования:

```ts
new CheckboxSelection('#test-1', {
    label: 'Тематика экскурсии',
    dataSource: [
        { id: 'all', value: '-1', label: 'Все' },
        { id: '1', value: '1', label: 'Спортивные' },
        { id: '2', value: '2', label: 'Популярные' }
    ]
});
```

### 2. Swiper.js
Используется для прокрутки элементов. Настройки:

```ts
const swiper = new Swiper('#swiper', {
    modules: [FreeMode],
    spaceBetween: 30,
    slidesPerView: 'auto',
    freeMode: true
});
```

Обработчик кликов на слайды:

```ts
swiper.slides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
        const slideRect = slide.getBoundingClientRect();
        const swiperRect = swiper.el.getBoundingClientRect();

        if (slideRect.left < swiperRect.left || slideRect.right > swiperRect.right) {
            swiper.slideTo(index);
        }
    });
});
```

## Контакты

Если у вас есть вопросы или предложения, создайте issue в репозитории.

---
**Автор:** Сергей (Stark)