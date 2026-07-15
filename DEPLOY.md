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

### 3.1. Соберите и запустите контейнеры:
```bash
docker-compose up --build -d
```

### 3.2. Проверьте статус:
```bash
docker-compose ps
docker-compose logs -f
```

## Шаг 4: Проверка

- **Frontend**: http://your-domain.com
- **Backend API**: http://your-domain.com/api/messages
- **API Docs**: http://your-domain.com/api-docs
- **Bot**: Запустится автоматически при наличии токена

## Полезные команды

```bash
# Перезапуск всех сервисов
docker-compose restart

# Просмотр логов
docker-compose logs -f backend
docker-compose logs -f bot
docker-compose logs -f frontend

# Остановка
docker-compose down

# Пересборка и запуск
docker-compose up --build -d

# Доступ к базе данных
docker-compose exec postgres psql -U app -d appdb
```

## Структура проекта

```
deploy_test_app_1/
├── backend/          # Express API (порт 5000)
├── frontend/         # React + Vite (сборка в dist/)
├── bot/              # Telegram bot (Telegraf)
├── docker-compose.yml
├── nginx.conf.example
└── .env
```

## Обновление приложения

```bash
git pull
docker-compose up --build -d
```

## Troubleshooting

### Frontend не обновляется после сборки
Убедитесь, что volume правильно настроен:
```bash
docker-compose up frontend --build
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
