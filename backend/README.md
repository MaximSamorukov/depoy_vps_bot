# Messages CRUD API

REST API для управления сообщениями, реализованный на Node.js, Express и TypeScript.

## Стек технологий

- Node.js
- Express.js
- TypeScript
- Zod (валидация)
- Swagger (API документация)
- In-memory хранилище (в будущем будет заменено на PostgreSQL)

## Установка

```bash
npm install
```

## Запуск

Разработка с hot-reload:

```bash
npm run dev
```

Сборка и запуск в production:

```bash
npm run build
npm start
```

## API Endpoints

Все эндпоинты доступны по префиксу `/api/messages`:

| Метод | Эндпоинт      | Описание           |
|-------|---------------|--------------------|
| GET   | /messages     | Получить все сообщения |
| GET   | /messages/:id | Получить сообщение по ID |
| POST  | /messages     | Создать сообщение  |
| PUT   | /messages/:id | Обновить сообщение |
| DELETE| /messages/:id | Удалить сообщение  |

## Swagger документация

После запуска сервера документация доступна по адресу:
http://localhost:3000/api-docs

## Структура проекта

```
src/
├── index.ts                    # Точка входа
├── app.ts                      # Express приложение
├── config/                     # Конфигурация
│   ├── index.ts               # Переменные окружения
│   └── swagger.ts             # Настройки Swagger
├── controllers/                # Обработчики запросов
│   └── messages.controller.ts
├── services/                   # Бизнес-логика
│   └── messages.service.ts
├── repositories/               # Слой доступа к данным
│   ├── messages.repository.interface.ts
│   └── in-memory-messages.repository.ts
├── routes/                     # Маршруты
│   └── messages.routes.ts
├── models/                     # Модели данных
│   └── message.model.ts
└── middleware/                 # Middleware
    ├── validation.ts          # Валидация Zod
    └── error-handler.ts       # Обработка ошибок
```

## Переменные окружения

- `PORT` - порт сервера (по умолчанию 3000)
- `NODE_ENV` - окружение (development/production)

## Скрипты

- `npm run dev` - запуск в режиме разработки
- `npm run build` - сборка TypeScript
- `npm start` - запуск собранного приложения
- `npm run lint` - проверка кода
- `npm run lint:fix` - исправление ошибок линтинга
- `npm run format` - форматирование кода
