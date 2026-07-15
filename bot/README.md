# Telegram Bot

Простой Telegram бот на TypeScript + Telegraf.js.

## Настройка

1. Получите токен бота через [@BotFather](https://t.me/BotFather) в Telegram

2. Создайте файл `.env` в корне проекта:
```
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

## Запуск

### Development режим
```bash
npm run dev
```

### Production режим
```bash
npm run build
npm start
```

## Структура проекта

```
bot/
├── src/
│   ├── index.ts          # Точка входа
│   ├── config.ts         # Конфигурация
│   ├── bot.ts            # Инициализация бота
│   └── handlers/
│       └── start.ts      # Обработчики сообщений
├── .env                  # Переменные окружения
├── .env.example          # Пример .env
├── tsconfig.json         # Настройки TypeScript
└── package.json
```
