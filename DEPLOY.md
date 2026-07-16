# Развёртывание на VPS

## Предварительные требования

- Docker и Docker Compose установлены на VPS
- Nginx установлен на VPS
- Домен настроен на ваш VPS

## Шаг 1: Подготовка

### 1.1. Создайте файл `.env` в корне проекта:
```bash
cp .env.example .env
```

Отредактируйте `.env` и укажите ваш `BOT_TOKEN` от Telegram.

### 1.2. Склонируйте проект на VPS:
```bash
git clone <your-repo> /path/to/deploy_test_app_1
cd /path/to/deploy_test_app_1
```

## Шаг 2: Настройка Nginx

### 2.1. Скопируйте пример конфигурации:
```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/deploy_test_app
```

### 2.2. Отредактируйте конфигурацию:
```bash
sudo nano /etc/nginx/sites-available/deploy_test_app
```

Замените:
- `your-domain.com` на ваш домен
- `/path/to/deploy_test_app_1` на реальный путь к проекту

### 2.3. Включите сайт:
```bash
sudo ln -s /etc/nginx/sites-available/deploy_test_app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2.4. (Опционально) Настройте SSL через Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Шаг 3: Запуск приложения

### На VPS (production):

```bash
# Запуск всех сервисов включая frontend
docker-compose --profile production up --build -d
```

### Локально (разработка):

Смотрите секцию "[Локальная разработка](#локальная-разработка)" ниже.

---

## Локальная разработка

### Гибридный режим (рекомендуется)

Backend, bot и база данных в Docker, frontend запускается локально с hot reload:

```bash
# Терминал 1: Docker (backend + bot + postgres)
docker-compose up -d

# Терминал 2: Frontend локально
cd frontend
npm install          # первый раз
npm run dev          # запуск Vite dev server

# Результат:
# - Frontend: http://localhost:3000 (Vite + hot reload)
# - Backend: http://localhost:5000
# - API запросы: http://localhost:3000/api/messages → proxy на backend
```

**Преимущества:**
- ✅ Hot module reload (HMR) работает
- ✅ Быстрая итерация при разработке
- ✅ Vite dev server с ошибками в реальном времени

### Production режим (Docker)

Все сервисы в контейнерах, включая frontend:

```bash
# Запуск с frontend в production режиме
docker-compose --profile production up --build -d

# Проверка статуса
docker-compose ps
docker-compose logs -f frontend

# Результат:
# - Frontend: http://localhost:3000 (собранный build)
# - Backend: http://localhost:5000
# - Bot: запущен
# - PostgreSQL: internal network
```

**Когда использовать:**
- Тестирование production-like среды
- Развёртывание на VPS
- Проверка Docker конфигурации

---

## Шаг 4: Проверка

### При локальной разработке:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/messages
- **API Docs**: http://localhost:5000/api-docs

### На VPS (production):
- **Frontend**: http://your-domain.com
- **Backend API**: http://your-domain.com/api/messages
- **API Docs**: http://your-domain.com/api-docs
- **Bot**: Запустится автоматически при наличии токена

## Полезные команды

### Разработка
```bash
# Запуск backend + bot + db (frontend НЕ запускается)
docker-compose up -d

# Остановка всех сервисов
docker-compose down
```

### Production
```bash
# Запуск всех сервисов включая frontend
docker-compose --profile production up --build -d

# Перезапуск всех сервисов
docker-compose --profile production restart

# Просмотр логов
docker-compose logs -f backend
docker-compose logs -f bot
docker-compose --profile production logs -f frontend
```

### Общие
```bash
# Пересборка и запуск
docker-compose up --build -d

# Доступ к базе данных
docker-compose exec postgres psql -U app -d appdb

# Остановка и очистка
docker-compose down --volumes  # удалит также volumes
```

## Структура проекта

```
deploy_test_app_1/
├── backend/          # Express API (порт 5000)
├── frontend/         # React + Vite (сборка в dist/)
├── bot/              # Telegram bot (Telegraf)
├── docker-compose.yml
├── nginx.conf.example
├── DEPLOY.md
└── .env
```

## Обновление приложения

### На VPS (production):
```bash
git pull
docker-compose --profile production up --build -d
```

### Локально (разработка):
```bash
git pull
docker-compose up -d  # только backend/bot/db
# Frontend перезапустится автоматически через npm run dev
```

## Troubleshooting

### Frontend не запускается с profiles

Убедитесь, что используете правильный флаг:
```bash
# Правильно
docker-compose --profile production up --build -d

# Неправильно (frontend не запустится)
docker-compose up -d
```

### Frontend не видит backend при локальной разработке

Проверьте, что backend запущен в Docker:
```bash
docker-compose ps
```

Proxy в Vite настроен на `http://localhost:5000` — убедитесь, что порт 5000 доступен.

### Как переключиться между режимами?

```bash
# Из разработки в production
docker-compose down
docker-compose --profile production up --build -d

# Из production в разработку
docker-compose down
docker-compose up -d  # frontend запускается локально через npm run dev
```

### Frontend не обновляется после сборки

Убедитесь, что volume правильно настроен:
```bash
docker-compose --profile production up frontend --build
ls -la frontend/dist/
```

### Backend недоступен через nginx

Проверьте логи:
```bash
docker-compose logs backend
sudo tail -f /var/log/nginx/error.log
```

### Bot не запускается

Проверьте токен в `.env`:
```bash
docker-compose logs bot
```
