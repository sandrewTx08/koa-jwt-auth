# koa-jwt-auth

## How to start?

### Requirements

- [x] Recent [Docker](https://www.docker.com/) version.

### Installing

1. Clone repository.

   - Example: `git clone https://github.com/sandrewTx08/koa-jwt-auth.git`

2. Browse to repository.

   - Example: `cd koa-jwt-auth/`

3. Create a `.env` file on [api](./api/) folder with [environment](#environment) variables.

   - File example:

   ```
   JWT_ACCESS_TOKEN_EXP=8 hour
   JWT_ACCESS_TOKEN=YWNjZXNzX3Rva2VuCg==
   JWT_REFRESH_TOKEN_EXP=1 week
   JWT_REFRESH_TOKEN=cmVmcmVzaF90b2tlbgo=
   ```

4. Build and run containers.
   - Example: `docker-compose up -d --build`

### Environment

| Variable                | Description               |
| ----------------------- | ------------------------- |
| `JWT_ACCESS_TOKEN_EXP`  | Access token expire age.  |
| `JWT_ACCESS_TOKEN`      | Access token secret.      |
| `JWT_REFRESH_TOKEN_EXP` | Refresh token expire age. |
| `JWT_REFRESH_TOKEN`     | Refresh token secret.     |

---

# API

## Authorization

1. After [login](/USER.md#login) copy token.
2. Set copied token on header.
   - Example: `Authorization : Bearer xxx.xxx.xxx`
3. Send request to main [route](#routes).

```cmd
curl --location --request GET 'localhost:8080/' \
--header 'Authorization: Bearer xxx.xxx.xxx'
```

## Routes

| Method   | Endpoint                           | Description        |
| -------- | ---------------------------------- | ------------------ |
| `GET`    | [/](#authorization)                | Main route.        |
| `POST`   | [/v1/login](/USER.md#login)        | Authenticate user. |
| `POST`   | [/v1/register](/USER.md#register)  | Create a new user. |
| `GET`    | [/v1/user](/USER.md#find-all)      | Find all users.    |
| `GET`    | [/v1/user/`id`](/USER.md#find-one) | Find user by ID.   |
| `PATCH`  | [/v1/user/`id`](/USER.md#update)   | Update user by ID. |
| `DELETE` | [/v1/user/`id`](/USER.md#delete)   | Delete user by ID. |
