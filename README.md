# Two Web Applications Lab

## Описание проекта
Проект состоит из двух микросервисов:
- User Service (PHP) - управление пользователями
- Task Service (Node.js) - управление задачами

## Структура проекта
project/
├── user-service/
│ ├── src/
│ │ ├── index.php
│ │ ├── .htaccess
│ │ └── config/
│ └── Dockerfile
├── task-service/
│ ├── src/
│ │ ├── index.js
│ │ ├── controllers/
│ │ ├── routes/
│ │ └── config/
│ ├── package.json
│ └── Dockerfile
└── README.md

## Запуск проекта

### 1. Создание Docker сети

docker network create task-user-network


### 2. Запуск User Service
cd user-service
docker build -t user-service .
docker run -d \
--name user-service \
--network task-user-network \
-p 8080:80 \
user-service

### 3. Запуск Task Service

cd task-service
docker build -t task-service .
docker run -d \ --name task-service \ --network task-user-network \ -p 3000:3000 \ -e USERS_SERVICE_URL=http://user-service \ task-service


## API Endpoints и их тестирование

### User Service (http://localhost:8080)

#### Получение всех пользователей

Invoke-RestMethod -Uri "http://localhost:8080/users" -Method Get


#### Получение конкретного пользователя

Invoke-RestMethod -Uri "http://localhost:8080/users/1" -Method Get


#### Создание пользователя

$body = @{
name = "John Doe"
email = "john@example.com"
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8080/users" -Method Post -Body $body -ContentType "application/json"


### Task Service (http://localhost:3000)

#### Получение всех задач

Invoke-RestMethod -Uri "http://localhost:3000/tasks" -Method Get


#### Получение конкретной задачи

Invoke-RestMethod -Uri "http://localhost:3000/tasks/1" -Method Get


#### Создание задачи

$body = @{
title = "New Task"
userId = 1
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/tasks" -Method Post -Body $body -ContentType "application/json"


#### Обновление задачи

$body = @{
status = "completed"
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/tasks/1" -Method Put -Body $body -ContentType "application/json"


## Управление контейнерами

### Просмотр логов

#### User Service логи
docker logs user-service

#### Task Service логи
docker logs task-service

### Остановка сервисов
docker stop user-service
docker stop task-service

### Удаление сервисов
docker rm user-service
docker rm task-service


### Удаление сети

docker network rm task-user-network


## Устранение неполадок

### 1. Проверка статуса контейнеров
docker ps


### 2. Проверка сетевых настроек
docker network inspect task-user-network


### 3. Проверка доступности сервисов
Проверка User Service
curl http://localhost:8080/health
Проверка Task Service
curl http://localhost:3000/health


### 4. Перезапуск сервисов
docker restart user-service
docker restart task-service

## Выключение системы

### Быстрое выключение всех сервисов
Остановка контейнеров
docker stop user-service task-service
Удаление контейнеров
docker rm user-service task-service
Удаление сети
docker network rm task-user-network
Опционально: удаление образов
docker rmi user-service task-service

## Важные замечания

1. Убедитесь, что порты 8080 и 3000 не заняты другими приложениями
2. При изменении портов обновите соответствующие настройки в конфигурации сервисов
3. Для работы в продакшене рекомендуется настроить SSL/TLS
4. Регулярно проверяйте логи на наличие ошибок
