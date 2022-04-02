# Setup

## Environment

| Required | Variable              | Description               | Example              |
| -------- | --------------------- | ------------------------- | -------------------- |
| [x]      | JWT_ACCESS_TOKEN_EXP  | Access token expire age.  | 1 week               |
| [x]      | JWT_ACCESS_TOKEN      | Access token secret.      | YWNjZXNzX3Rva2VuCg== |
| [x]      | JWT_REFRESH_TOKEN_EXP | Refresh token expire age. | 8 hour               |
| [x]      | JWT_REFRESH_TOKEN     | Refresh token secret.     | cmVmcmVzaF90b2tlbgo= |

## Starting

1. `docker-compose up -d --build`

# API

## Routes

| Token | Method   | Endpoint      | Description        |
| ----- | -------- | ------------- | ------------------ |
| [X]   | `GET`    | /             | Main route.        |
| [ ]   | `POST`   | /v1/login     | Authenticate user. |
| [ ]   | `POST`   | /v1/register  | Create a new user. |
| [ ]   | `GET`    | /v1/user      | Find all users.    |
| [ ]   | `GET`    | /v1/user/`id` | Find user by ID.   |
| [ ]   | `PATCH`  | /v1/user/`id` | Update user by ID. |
| [ ]   | `DELETE` | /v1/user/`id` | Delete user by ID. |

# User

## Register

```cmd
curl --location --request POST 'localhost:8080/v1/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "user_001",
    "password": "mypassword",
    "email": "user_001@email.com"
}'
```

## Login

```cmd
curl --location --request POST 'localhost:8080/v1/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "user_001",
    "password": "mypassword"
}'
```

## Authorization

1. After login copy token.
2. Set copied token on header.
   - Example: `Authorization : Bearer xxx.xxx.xxx`

```cmd
curl --location --request GET 'localhost:8080/' \
--header 'Authorization: Bearer xxx.xxx.xxx'
```
