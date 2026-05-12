<?php
require __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); die('Method not allowed');
}
if (!csrf_check($_POST['csrf'] ?? '')) {
    http_response_code(403); die('Invalid CSRF token');
}
$id = (int)($_POST['id'] ?? 0);
if ($id <= 0) { http_response_code(400); die('Bad id'); }

$stmt = $pdo->prepare('DELETE FROM ts_leads WHERE id = :id');
$stmt->execute([':id' => $id]);

header('Location: index.php');
exit;
