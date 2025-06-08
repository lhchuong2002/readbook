<?php
$conn = new mysqli("localhost", "root", "", "news_portal");
$conn->set_charset("utf8mb4");

function getHTML($url) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_USERAGENT => "Mozilla/5.0",
        CURLOPT_TIMEOUT => 10,
    ]);
    $html = curl_exec($ch);
    curl_close($ch);
    return $html;
}

function getRandomCategory() {
    $cats = ["Kinh tế", "Công nghệ", "Thể thao", "Giải trí"];
    return $cats[array_rand($cats)];
}

$sources = [
    ["https://vnexpress.net/rss/tin-moi-nhat.rss", "VnExpress", "//article//p"],
    ["https://zingnews.vn/rss/the-thao.rss", "ZingNews", "//div[contains(@class,'the-article-body')]//p"],
    ["https://tuoitre.vn/rss/the-thao.rss", "TuoiTre", "//div[contains(@class,'detail-content')]//p"]
];



$total = 0;

foreach ($sources as [$feedUrl, $sourceName, $contentXPath]) {
    $rss = @simplexml_load_file($feedUrl);
    if (!$rss) continue;
    $count = 0; 
    foreach ($rss->channel->item as $item) {
        if ($count >= 10) break; 
        $count++;
        $title = (string)$item->title;
        $link = (string)$item->link;
        $desc = strip_tags((string)$item->description);
        $pubDate = date('Y-m-d H:i:s', strtotime($item->pubDate ?? date("Y-m-d H:i:s")));
        $category = getRandomCategory();

        // Lấy ảnh từ description
        preg_match('/<img[^>]+src="([^"]+)"/', (string)$item->description, $imgMatch);
        $img = $imgMatch[1] ?? '';

        // Lấy nội dung chi tiết
        $html = getHTML($link);
        libxml_use_internal_errors(true);
        $doc = new DOMDocument();
        $doc->loadHTML($html);
        $xpath = new DOMXPath($doc);
        $paras = $xpath->query($contentXPath);
        $content = "";
        foreach ($paras as $p) {
            $content .= "<p>" . trim($p->nodeValue) . "</p>";
        }

        // Tránh trùng
        $check = $conn->prepare("SELECT id FROM articles WHERE link = ?");
        $check->bind_param("s", $link);
        $check->execute();
        $check->store_result();

        if ($check->num_rows == 0) {
            $stmt = $conn->prepare("INSERT INTO articles (title, description, image_url, link, published_at, source, category, content)
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssssss", $title, $desc, $img, $link, $pubDate, $sourceName, $category, $content);
            $stmt->execute();
            $total++;
        }
    }
}
echo "✅ Đã thêm $total bài viết từ RSS.";
