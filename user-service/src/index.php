<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Путь к файлу для хранения данных
$dataFile = __DIR__ . '/data.json';

// Загрузка данных из файла или создание начальных данных
if (file_exists($dataFile)) {
    $users = json_decode(file_get_contents($dataFile), true);
} else {
    $users = [
        1 => ['id' => 1, 'name' => 'John Doe', 'email' => 'john@example.com'],
        2 => ['id' => 2, 'name' => 'Jane Smith', 'email' => 'jane@example.com']
    ];
}

// Получаем метод запроса
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$id = basename($path);

switch ($method) {
    case 'GET':
        if ($id && $id != 'index.php') {
            echo json_encode($users[$id] ?? ['error' => 'User not found']);
        } else {
            echo json_encode(array_values($users));
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if ($data === null) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON data']);
            break;
        }
        $id = count($users) + 1;
        $users[$id] = array_merge(['id' => $id], $data);
        // Сохраняем данные в файл
        file_put_contents($dataFile, json_encode($users));
        echo json_encode($users[$id]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($users[$id])) {
            $users[$id] = array_merge($users[$id], $data);
            // Сохраняем данные в файл
            file_put_contents($dataFile, json_encode($users));
            echo json_encode($users[$id]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
        }
        break;

    case 'DELETE':
        if (isset($users[$id])) {
            $user = $users[$id];
            unset($users[$id]);
            // Сохраняем данные в файл
            file_put_contents($dataFile, json_encode($users));
            echo json_encode($user);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
        }
        break;
}