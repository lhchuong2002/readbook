<?php
$conn = new mysqli("localhost", "root", "", "news_portal");
$conn->set_charset("utf8mb4");

// Lấy bài mới nhất
$result = $conn->query("SELECT title, image_url FROM articles ORDER BY published_at DESC LIMIT 1");

if ($row = $result->fetch_assoc()) {
    echo "<h2>" . htmlspecialchars($row['title']) . "</h2>";
    echo "<img src='" . htmlspecialchars($row['image_url']) . "' alt='Ảnh bài viết' style='max-width:400px'>";
} else {
    echo "Không có dữ liệu.";
}
?>
