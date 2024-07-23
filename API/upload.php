<?php
// Allow CORS
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $file = $_FILES['file'];
    $filename = $file['name'];
    $uploadDir = 'uploads/';

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $file_extension = pathinfo($filename, PATHINFO_EXTENSION); 
    $allowedExtensions = ['xkt'];
    if (!in_array($file_extension, $allowedExtensions)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file type']);
        exit;
    }

    if ($file['error'] !== UPLOAD_ERR_OK) {
        http_response_code(500);
        echo json_encode(['error' => 'File upload error']);
        exit;
    }

    $destination = $uploadDir . basename($file['name']);
    if (move_uploaded_file($file['tmp_name'], $destination)) {
        // echo json_encode(['message' => 'File uploaded successfully']);
        echo json_encode([
            'message' => 'File uploaded successfully',
            'filePath' => "http://localhost/" . $destination,
            'fileName' => basename($destination),
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to move uploaded file']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded']);
}
