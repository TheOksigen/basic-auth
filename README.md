# Auth Backend (Express + JSON + JWT)
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
    "id": "user_id",
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


Пример ответа:

```json
{
  "user": {
    "_id": "user_id",
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

