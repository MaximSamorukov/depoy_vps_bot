# Подключение Frontend к Backend

## Архитектура приложения

### Контейнеризация

Frontend и Backend работают в **разных контейнерах**:

```yaml
# docker-compose.yml
backend:
  build: ./backend
  ports:
    - "5000:5000"
  networks:
    - internal    # доступ к PostgreSQL
    - public      # доступ извне

frontend:
  build: ./frontend
  ports:
    - "3000:3000"
  networks:
    - public      # только публичная сеть
  depends_on:
    - backend
```

### Сетевая конфигурация

```
┌─────────────────────────────────────────────────────┐
│                  Docker Network: public             │
│                                                     │
│  ┌──────────────┐         ┌──────────────┐         │
│  │   Frontend   │ ──────▶ │   Backend    │         │
│  │   :3000      │         │   :5000      │         │
│  │  Container   │         │  Container   │         │
│  └──────────────┘         └──────┬───────┘         │
└─────────────────────────────────┼──────────────────┘
                                  │
┌─────────────────────────────────┼──────────────────┐
│        Docker Network: internal │                  │
│                                 ▼                  │
│                        ┌──────────────┐            │
│                        │  PostgreSQL  │            │
│                        │    :5432     │            │
│                        └──────────────┘            │
└────────────────────────────────────────────────────┘
```

---

## Контексты выполнения API URL

### 1. Локальная разработка (без Docker)

```bash
# .env в корне проекта
VITE_API_URL=http://localhost:5000/api
```

**Почему работает:**
- Frontend запущен через Vite dev server на `localhost:3000`
- Backend запущен через Node.js на `localhost:5000`
- Оба процесса на **одной машине** → `localhost` корректно резолвится

### 2. Docker Compose (локально и на VPS)

```yaml
# docker-compose.yml - переопределение переменной
frontend:
  environment:
    - VITE_API_URL=http://backend:5000/api
```

**Почему `localhost` НЕ работает:**
- `localhost` внутри контейнера frontend = сам контейнер frontend
- Backend находится в **другом контейнере**
- Docker Compose автоматически создаёт DNS-запись по имени сервиса → `backend`

**Почему `backend:5000` работает:**
- Docker Compose создаёт внутреннюю DNS-систему
- Контейнеры могут обращаться друг к другу по имени сервиса
- Оба контейнера в сети `public` → могут общаться

### 3. Production (внешний доступ)

```bash
VITE_API_URL=https://api.yourdomain.com
```

Используется полный внешний URL для доступа через интернет.

---

## Проблема текущей конфигурации

### Текущий `.env` (корень проекта)

```bash
BOT_TOKEN=...
NODE_ENV=development
VITE_API_URL=http://localhost:5000/api  # ❌ Проблема для Docker
```

### Почему это проблема

1. **Vite environment variables "вшиваются" в код на этапе build**
   - Значение `VITE_API_URL` компилируется в бандл
   - Изменить его после сборки нельзя

2. **В Docker используется тот же `.env`**
   - При сборке frontend контейнера берётся значение из `.env`
   - `localhost` внутри контейнера = сам контейнер, а не backend

3. **Результат:**
   ```
   Frontend container пытается обратиться к localhost:5000
   → localhost = этот же контейнер (порт 5000 не слушается)
   → Connection refused
   → API запросы не работают
   ```

---

## Решение

### Вариант 1: Переопределение в docker-compose.yml (рекомендуется)

**Преимущества:**
- Один `.env` файл для локальной разработки
- Явная конфигурация для Docker
- Не нужно создавать дополнительные файлы

**Реализация:**

```yaml
# docker-compose.yml
frontend:
  profiles:
    - production
  build: ./frontend
  ports:
    - "3000:3000"
  environment:
    - NODE_ENV=${NODE_ENV:-development}
    - VITE_API_URL=http://backend:5000/api  # ← Переопределяет .env
  depends_on:
    - backend
  networks:
    - public
  command: sh -c "if [ \"$NODE_ENV\" = \"production\" ]; then npm run build && npx serve dist -l 3000; else npm run dev -- --host 0.0.0.0 --port 3000; fi"
```

**Как работает:**
- Локально без Docker: используется `.env` → `localhost:5000` ✅
- В Docker: переопределяется в docker-compose → `backend:5000` ✅

---

### Вариант 2: Отдельные .env файлы

**Структура:**
```
.env              # локальная разработка (localhost:5000)
.env.docker       # Docker окружение (backend:5000)
.env.example      # шаблон для разработчиков
```

**Использование:**
```bash
# Локально
docker-compose up

# Для Docker (явное указание файла)
docker-compose --env-file .env.docker up
```

**Недостатки:**
- Нужно помнить про разные файлы
- Легко запутаться

---

### Вариант 3: Относительные пути + Proxy

**Изменения в App.tsx:**
```typescript
// Вместо абсолютного URL использовать относительный путь
const API_URL = '/api';  // всегда относительный

fetch(`${API_URL}/messages`)
```

**Vite proxy (для разработки):**
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

**Production (nginx reverse proxy):**
```nginx
location /api {
    proxy_pass http://backend:5000;
}
```

**Преимущества:**
- Одна конфигурация для всех окружений
- Не нужно управлять URL

**Недостатки:**
- Требует nginx в production
- Более сложная настройка

---

## Итоговая рекомендация

**Использовать Вариант 1** — переопределение в `docker-compose.yml`:

```yaml
frontend:
  environment:
    - VITE_API_URL=http://backend:5000/api
```

**Почему:**
1. ✅ Простая реализация (одна строка)
2. ✅ Явное разделение окружений
3. ✅ Работает локально и на VPS
4. ✅ Не требует дополнительных файлов
5. ✅ Легко понять и поддерживать

---

## Проверка подключения

### Локально (без Docker)

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

Frontend должен обращаться к `http://localhost:5000/api`

### В Docker

```bash
docker-compose up
```

Frontend должен обращаться к `http://backend:5000/api`

### Тестирование

1. Открыть `http://localhost:3000`
2. Создать сообщение через форму
3. Проверить Network tab в браузере:
   - Локально: запрос на `http://localhost:5000/api/messages`
   - Docker: запрос на `http://localhost:3000/api/messages` (proxy) или `http://backend:5000/api/messages` (production build)

---

## Изменения в коде (выполненные)

### Backend

1. **ID сущности**: изменён с `uuid` (string) на автоинкремент (number)
2. **База данных**: подключена PostgreSQL через `pg` (без ORM)
3. **Репозиторий**: создан `PostgresMessagesRepository` вместо `InMemoryMessagesRepository`
4. **Миграции**: создан SQL файл для создания таблицы `messages`
5. **Конфигурация**: добавлен `DATABASE_URL` в config
6. **Graceful shutdown**: обработка SIGTERM/SIGINT для закрытия соединений

### Frontend

1. **Типы**: уже используют `id: number` (совместимо с backend)
2. **API вызовы**: используют относительные пути `/api/messages`
3. **Vite proxy**: настроен в `vite.config.ts` для разработки

---

## Структура файлов

```
deploy_test_app_1/
├── .env                          # VITE_API_URL=http://localhost:5000/api
├── docker-compose.yml            # переопределение для frontend
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── config.ts         # database.url
│   │   │   ├── database.ts       # Pool подключение
│   │   │   └── swagger.ts
│   │   ├── repositories/
│   │   │   ├── messages.repository.interface.ts
│   │   │   └── postgres-messages.repository.ts
│   │   ├── models/
│   │   │   └── message.model.ts  # id: number
│   │   ├── services/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── app.ts                # createApp()
│   │   └── index.ts              # init database, graceful shutdown
│   ├── migrations/
│   │   └── 001-create-messages-table.sql
│   └── package.json              # pg, @types/pg
└── frontend/
    ├── src/
    │   ├── App.tsx               # fetch('/api/messages')
    │   └── main.tsx
    ├── vite.config.ts            # proxy /api → localhost:5000
    └── package.json
```
