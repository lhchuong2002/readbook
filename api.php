<?php
header('Content-Type: application/json');

$mysqli = new mysqli("localhost", "root", "", "news_portal");
$mysqli->set_charset("utf8mb4");

// Nếu có id => trả về chi tiết bài viết
if (isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $stmt = $mysqli->prepare("SELECT id, title, description, image_url, link, published_at, source, category FROM articles WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode($row);
    } else {
        echo json_encode(['error' => 'Không tìm thấy bài viết.']);
    }
    exit;
}

// Nếu không có id => trả về danh sách
$result = $mysqli->query("SELECT id, title, description, image_url, link, published_at, source, category FROM articles ORDER BY published_at DESC LIMIT 100");

$articles = [];
while ($row = $result->fetch_assoc()) {
    $articles[] = $row;
}

echo json_encode($articles);
