# Habit Tracker

Трекер привычек: React + Vite (фронт) и Express + MongoDB (API). Отмечайте привычки на сегодня, смотрите streak и heatmap за 30 дней.

## Стек

| Часть | Технологии |
|-------|------------|
| Frontend | React 19, Vite, чистый CSS |
| Backend | Express, Mongoose |
| БД | MongoDB (локально или [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)) |

## Структура

```
tracker/
├── client/          # UI → http://localhost:5173
├── server/          # API → http://localhost:3001
├── render.yaml      # Деплой на Render (рекомендуется)
└── README.md
```

## Локальный запуск

### 1. MongoDB

- **Локально:** установите MongoDB и используйте `mongodb://localhost:27017/habit-tracker`
- **Облако:** создайте бесплатный кластер в [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) → Database → Connect → скопируйте connection string

### 2. Переменные окружения

**`server/.env`** (скопируйте из `server/.env.example`):

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/habit-tracker
PORT=3001
CLIENT_URL=http://localhost:5173
```

**`client/.env`** (опционально, по умолчанию API на `localhost:3001`):

```env
VITE_API_URL=http://localhost:3001
```

### 3. Запуск

Терминал 1 — API:

```bash
cd server
npm install
npm run dev
```

Терминал 2 — фронт:

```bash
cd client
npm install
npm run dev
```

Откройте **http://localhost:5173**.

Проверка API: **http://localhost:3001/api/health** → `{"status":"ok"}`.

---

## Деплой в прод

На Render и Railway **нет встроенной MongoDB** — нужен **MongoDB Atlas** (бесплатный tier M0).

| Платформа | Оценка | Что деплоится |
|-----------|--------|----------------|
| **[Render](https://render.com)** | Проще для этого проекта | API + статический фронт из одного `render.yaml` |
| **[Railway](https://railway.app)** | Удобно для одного API | Обычно только backend; фронт — отдельно |

**Рекомендация: Render** — один Blueprint поднимает и API, и статику, бесплатный Static Site.

### Render (пошагово)

1. Залейте репозиторий на GitHub.
2. [render.com](https://render.com) → **New** → **Blueprint** → выберите репозиторий.
3. Render прочитает `render.yaml` и создаст два сервиса: `habit-tracker-api` и `habit-tracker-web`.
4. В **MongoDB Atlas**: Network Access → **Allow Access from Anywhere** (`0.0.0.0/0`) для Render.
5. Задайте переменные в Dashboard (для каждого сервиса):

**Сервис `habit-tracker-api`:**

| Переменная | Значение |
|------------|----------|
| `MONGODB_URI` | Строка подключения Atlas |
| `CLIENT_URL` | URL фронта, например `https://habit-tracker-web.onrender.com` |

**Сервис `habit-tracker-web`:**

| Переменная | Значение |
|------------|----------|
| `VITE_API_URL` | URL API **без** `/api`, например `https://habit-tracker-api.onrender.com` |

6. Сначала задеплойте API, скопируйте его URL → укажите в `VITE_API_URL` фронта и в `CLIENT_URL` API → **Redeploy** оба сервиса.

> `VITE_*` подставляется **на этапе сборки**. После смены `VITE_API_URL` нужен **Manual Deploy** фронта.

### Railway (только API)

1. [railway.app](https://railway.app) → **New Project** → **GitHub Repo**.
2. **Root Directory:** `server`.
3. Variables:

```env
MONGODB_URI=mongodb+srv://...
CLIENT_URL=https://ваш-фронт.onrender.com
```

4. Сгенерируется домен вида `https://xxx.up.railway.app` — его укажите как `VITE_API_URL` при сборке фронта (Render Static, Vercel и т.д.).

В репозитории есть `server/railway.toml` с healthcheck на `/api/health`.

### Фронт отдельно (Vercel / Netlify / Render Static)

```bash
cd client
npm install
VITE_API_URL=https://ваш-api.onrender.com npm run build
```

Опубликуйте папку `client/dist`. Не забудьте `CLIENT_URL` на API = URL вашего фронта.

---

## API

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/api/health` | Проверка сервера |
| `GET` | `/api/habits` | Список привычек + streak |
| `POST` | `/api/habits` | `{ name, emoji, color, frequency }` |
| `DELETE` | `/api/habits/:id` | Удалить привычку |
| `GET` | `/api/entries?habitId=&month=2026-05` | Записи (фильтры опциональны) |
| `POST` | `/api/entries` | `{ habitId, date, completed }` |

---

## Скрипты

| Команда | Где | Назначение |
|---------|-----|------------|
| `npm run dev` | `server/` | API с hot-reload |
| `npm start` | `server/` | API для продакшена |
| `npm run dev` | `client/` | Vite dev-server |
| `npm run build` | `client/` | Сборка в `dist/` |

---

## Частые проблемы

- **CORS error** — `CLIENT_URL` на API должен **точно** совпадать с URL фронта (с `https://`, без слэша в конце).
- **Failed to fetch** — проверьте `VITE_API_URL` и что API отвечает на `/api/health`.
- **MongoDB connection** — в Atlas включён доступ с `0.0.0.0/0`, логин/пароль в URI URL-encoded.
- **Пустой фронт после деплоя** — пересоберите фронт после установки `VITE_API_URL`.

## Лицензия

MIT
