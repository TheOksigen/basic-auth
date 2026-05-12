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

### GET `/getTodo`

Возвращает todo текущего пользователя. Пользователь определяется по JWT token.

Требует `Authorization: Bearer <token>`.

Пример ответа:

```json
{
  "todos": [
    {
      "_id": "todo_id",
      "userId": "user_id",
      "title": "Buy milk",
      "checked": false,
      "createdAt": "2026-05-12T10:00:00.000Z",
      "updatedAt": "2026-05-12T10:00:00.000Z",
      "__v": 0
    }
  ]
}
```

### POST `/sendTodo`

Создает todo для текущего пользователя. `userId` брать из body не нужно, он определяется по token.

Требует `Authorization: Bearer <token>`.

Тело запроса:

```json
{
  "title": "Buy milk",
  "checked": false
}
```

`checked` необязательный, по умолчанию `false`.

Ответ:

```json
{
  "todo": {
    "_id": "todo_id",
    "userId": "user_id",
    "title": "Buy milk",
    "checked": false,
    "createdAt": "2026-05-12T10:00:00.000Z",
    "updatedAt": "2026-05-12T10:00:00.000Z",
    "__v": 0
  }
}
```

### PATCH `/updateTodo/:id`

Обновляет todo текущего пользователя. Нельзя обновить todo другого пользователя.

Требует `Authorization: Bearer <token>`.

Тело запроса:

```json
{
  "title": "Buy bread",
  "checked": true
}
```

Можно отправить только одно поле:

```json
{
  "checked": true
}
```

Ответ:

```json
{
  "todo": {
    "_id": "todo_id",
    "userId": "user_id",
    "title": "Buy bread",
    "checked": true,
    "createdAt": "2026-05-12T10:00:00.000Z",
    "updatedAt": "2026-05-12T10:05:00.000Z",
    "__v": 0
  }
}
```

Также можно использовать `PATCH /updateTodo` и передать id в body:

```json
{
  "id": "todo_id",
  "checked": true
}
```

## Проверка health

`GET /health` -> `{ "status": "ok" }`
