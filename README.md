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


##############################################################################################################
########## Тестирование  User Service (http://localhost:8080)
# GET - получить всех пользователей
Invoke-RestMethod -Uri "http://localhost:8080" -Method Get

# GET - получить конкретного пользователя
Invoke-RestMethod -Uri "http://localhost:8080/1" -Method Get

# POST - создать нового пользователя
$body = @{
    name = "Alice Cooper"
    email = "alice@example.com"
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8080" -Method Post -Body $body -ContentType "application/json"

# PUT - обновить существующего пользователя
$body = @{
    name = "John Updated"
    email = "john.updated@example.com"
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8080/1" -Method Put -Body $body -ContentType "application/json"

# DELETE - удалить пользователя
Invoke-RestMethod -Uri "http://localhost:8080/1" -Method Delete

##############################################################################################################
С кодом ошибок


# GET - получить всех пользователей
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -Method Get
    Write-Host "Status Code: $($response.StatusCode) - Success"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__) - Error"
    Write-Host "Error: $($_.Exception.Message)"
}

# GET - получить конкретного пользователя
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/1" -Method Get
    Write-Host "Status Code: $($response.StatusCode) - Success"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__) - Error"
    Write-Host "Error: $($_.Exception.Message)"
}

# POST - создать нового пользователя
$body = @{
    name = "Alice Cooper"
    email = "alice@example.com"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Status Code: $($response.StatusCode) - Created"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__) - Error"
    Write-Host "Error: $($_.Exception.Message)"
}

# PUT - обновить существующего пользователя
$body = @{
    name = "John Updated"
    email = "john.updated@example.com"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/1" -Method Put -Body $body -ContentType "application/json"
    Write-Host "Status Code: $($response.StatusCode) - Updated"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__) - Error"
    Write-Host "Error: $($_.Exception.Message)"
}

# DELETE - удалить пользователя
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/1" -Method Delete
    Write-Host "Status Code: $($response.StatusCode) - Deleted"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__) - Error"
    Write-Host "Error: $($_.Exception.Message)"
}
##############################################################################################################

##########Тестирование  Task Service (http://localhost:3000)
##############################################################################################################
# GET - получить все задачи
Invoke-RestMethod -Uri "http://localhost:3000/tasks" -Method Get

# GET - получить конкретную задачу
Invoke-RestMethod -Uri "http://localhost:3000/tasks/1" -Method Get

# POST - создать новую задачу
$body = @{
    title = "New Important Task"
    userId = 1
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/tasks" -Method Post -Body $body -ContentType "application/json"

# POST - создать новую задачу
$body = @{
    title = "New 2 Important Task"
    userId = 2
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/tasks" -Method Post -Body $body -ContentType "application/json"

# PUT - обновить существующую задачу
$body = @{
    status = "completed"
    title = "Updated Task Title"
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/tasks/1" -Method Put -Body $body -ContentType "application/json"

# DELETE - удалить задачу
Invoke-RestMethod -Uri "http://localhost:3000/tasks/1" -Method Delete

##############################################################################################################
С кодом ошибок

# GET - получить все задачи
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/tasks" -Method Get
    Write-Host "Status Code: $($response.StatusCode) - Success"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__) - Error"
    Write-Host "Error: $($_.Exception.Message)"
}

# GET - получить конкретную задачу
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/tasks/1" -Method Get
    Write-Host "Status Code: $($response.StatusCode) - Success"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__) - Error"
    Write-Host "Error: $($_.Exception.Message)"
}

# POST - создать новую задачу
$body = @{
    title = "New Important Task"
    userId = 1
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/tasks" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Status Code: $($response.StatusCode) - Created"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__) - Error"
    Write-Host "Error: $($_.Exception.Message)"
}

# PUT - обновить существующую задачу
$body = @{
    status = "completed"
    title = "Updated Task Title"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/tasks/1" -Method Put -Body $body -ContentType "application/json"
    Write-Host "Status Code: $($response.StatusCode) - Updated"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__) - Error"
    Write-Host "Error: $($_.Exception.Message)"
}

# DELETE - удалить задачу
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/tasks/1" -Method Delete
    Write-Host "Status Code: $($response.StatusCode) - Deleted"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__) - Error"
    Write-Host "Error: $($_.Exception.Message)"
}

##############################################################################################################


##Вывести все сети docker
docker network ls
##Проверить сеть
docker network inspect task-user-network(сеть)

# Запуск контейнера
docker run [опции] IMAGE
docker run -d --name my-container -p 8080:80 nginx

# Список контейнеров
docker ps          # запущенные
docker ps -a       # все контейнеры

# Остановка/запуск/перезапуск
docker stop CONTAINER
docker start CONTAINER
docker restart CONTAINER

# Удаление контейнера
docker rm CONTAINER
docker rm -f CONTAINER  # принудительное удаление

# Список образов
docker images

# Загрузка образа
docker pull IMAGE

# Создание образа
docker build -t NAME:TAG .

# Удаление образа
docker rmi IMAGE

# История слоев образа
docker history IMAGE

# Список сетей
docker network ls

# Создание сети
docker network create NETWORK

# Подключение контейнера к сети
docker network connect NETWORK CONTAINER

# Информация о сети
docker network inspect NETWORK

# Просмотр логов
docker logs CONTAINER
docker logs -f CONTAINER  # следить за логами

# Выполнение команды в контейнере
docker exec -it CONTAINER COMMAND
docker exec -it container_name bash

# Информация о контейнере
docker inspect CONTAINER

# Создание тома
docker volume create VOLUME

# Список томов
docker volume ls

# Информация о томе
docker volume inspect VOLUME

# Удаление тома
docker volume rm VOLUME

# Информация о Docker
docker info

# Очистка неиспользуемых ресурсов
docker system prune
docker system prune -a  # включая неиспользуемые образы

# Использование дискового пространства
docker system df

# Вход в реестр
docker login [OPTIONS] [SERVER]

# Отправка образа в реестр
docker push NAME:TAG

# Выход из реестра
docker logout [SERVER]