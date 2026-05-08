# Auth Backend (Express + MongoDB + JWT)

Готовый backend на Node.js/Express с регистрацией, логином и получением сессии через JWT.

## Стек

- Node.js + Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Хеширование паролей (`bcrypt`)
- Docker + Docker Compose

## Структура

```text
src/
  config/
    db.js
  controllers/
    authController.js
  middleware/
    authMiddleware.js
  models/
    User.js
  routes/
    authRoutes.js
  app.js
  server.js
```

## Быстрый старт (локально)

1. Установить зависимости:

```bash
npm install
```

2. Создать `.env` из примера:

```bash
cp .env.example .env
```

3. Запустить MongoDB (локально или в Docker), затем backend:

```bash
npm run dev
```

## Запуск через Docker Compose

1. Создать `.env`:

```bash
cp .env.example .env
```

2. Запустить сервисы:

```bash
docker compose up --build
```

После запуска:
- backend: `http://localhost:3000`
- mongo: `mongodb://localhost:27017`

## API

### POST `/register`

Регистрация пользователя.

Тело запроса:

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "12345678",
  "gender": "male",
  "birthDate": "1999-10-10"
}
```

`username` или `email` обязателен (можно передать оба).

Ответ:

```json
{
  "token": "jwt_token",
  "user": {
    "id": "mongo_id",
    "username": "john_doe",
    "email": "john@example.com",
    "gender": "male",
    "birthDate": "1999-10-10T00:00:00.000Z"
  }
}
```

### POST `/login`

Вход по `username` или `email` + `password`.

Тело запроса:

```json
{
  "email": "john@example.com",
  "password": "12345678"
}
```

Ответ:

```json
{
  "token": "jwt_token"
}
```

При ошибке авторизации: `401 Unauthorized`.

### GET `/getSession`

Требует `Authorization: Bearer <token>`.

Возвращает пользователя без пароля.

Пример ответа:

```json
{
  "user": {
    "_id": "mongo_id",
    "username": "john_doe",
    "email": "john@example.com",
    "gender": "male",
    "birthDate": "1999-10-10T00:00:00.000Z",
    "createdAt": "2026-05-08T10:00:00.000Z",
    "updatedAt": "2026-05-08T10:00:00.000Z",
    "__v": 0
  }
}
```

## Проверка health

`GET /health` -> `{ "status": "ok" }`

## Публикация на GitHub

```bash
git init
git add .
git commit -m "feat: add auth backend with express, jwt, mongodb and docker"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```
