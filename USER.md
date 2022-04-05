# User

## Register

```cmd
curl --location --request POST 'localhost/v1/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "user_001",
    "password": "mypassword",
    "email": "user_001@email.com"
}'
```

## Login

```cmd
curl --location --request POST 'localhost/v1/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "user_001",
    "password": "mypassword"
}'
```

## Find all

```cmd
curl --location --request GET 'localhost/v1/user'
```

## Find one

```cmd
curl --location --request GET 'localhost/v1/user/55464a1c-b29e-11ec-b909-0242ac120002'
```

## Update

```cmd
curl --location --request PATCH 'localhost/v1/user/55464a1c-b29e-11ec-b909-0242ac120002' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "user_002",
    "password": "mypassword2",
    "email": "user_002@email.com"
}'
```

## Delete

```cmd
curl --location --request DELETE 'localhost/v1/user/55464a1c-b29e-11ec-b909-0242ac120002'
```
