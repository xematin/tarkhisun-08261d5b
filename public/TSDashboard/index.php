<?php
require __DIR__ . '/_bootstrap.php';

$q     = trim($_GET['q'] ?? '');
$from  = trim($_GET['from'] ?? '');
$to    = trim($_GET['to'] ?? '');
$page  = max(1, (int)($_GET['page'] ?? 1));
$per   = 25;
$off   = ($page - 1) * $per;

$where = [];
$params = [];
if ($q !== '') {
    $where[] = '(phone LIKE :q OR phrase LIKE :q)';
    $params[':q'] = '%' . $q . '%';
}
if ($from !== '') {
    $where[] = 'created_at >= :from';
    $params[':from'] = $from . ' 00:00:00';
}
if ($to !== '') {
    $where[] = 'created_at <= :to';
    $params[':to'] = $to . ' 23:59:59';
}
$wsql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

$total = (int)$pdo->query("SELECT COUNT(*) c FROM ts_leads $wsql" .
    (count($params) ? '' : ''))->fetchColumn(); // simplistic — re-run with params
$cstmt = $pdo->prepare("SELECT COUNT(*) FROM ts_leads $wsql");
$cstmt->execute($params);
$total = (int)$cstmt->fetchColumn();

$stmt = $pdo->prepare("SELECT * FROM ts_leads $wsql ORDER BY id DESC LIMIT $per OFFSET $off");
$stmt->execute($params);
$rows = $stmt->fetchAll();

$pages = max(1, (int)ceil($total / $per));

function h($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
?>
<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>پنل مدیریت ترخیصان</title>
<style>
  *{box-sizing:border-box}
  body{font-family:Tahoma,Arial,sans-serif;background:#f5f7fb;color:#1e293b;margin:0;padding:24px}
  h1{margin:0 0 16px;font-size:22px}
  .card{background:#fff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,.06);padding:20px;margin-bottom:16px}
  .top{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
  form.filters{display:flex;flex-wrap:wrap;gap:8px;align-items:end}
  label{font-size:12px;color:#64748b;display:block;margin-bottom:4px}
  input,select{padding:8px 10px;border:1px solid #cbd5e1;border-radius:8px;font:inherit}
  button,.btn{background:#2563eb;color:#fff;border:0;border-radius:8px;padding:9px 14px;cursor:pointer;font:inherit;text-decoration:none;display:inline-block}
  button.danger,.btn.danger{background:#dc2626}
  button.ghost,.btn.ghost{background:#e2e8f0;color:#1e293b}
  table{width:100%;border-collapse:collapse;margin-top:12px;font-size:14px}
  th,td{padding:10px 8px;border-bottom:1px solid #e2e8f0;text-align:right}
  th{background:#f1f5f9;font-weight:600;color:#475569}
  tr:hover td{background:#f8fafc}
  .muted{color:#64748b;font-size:13px}
  .pagination{display:flex;gap:6px;margin-top:16px;flex-wrap:wrap}
  .pagination a,.pagination span{padding:6px 10px;border-radius:6px;background:#e2e8f0;color:#1e293b;text-decoration:none;font-size:13px}
  .pagination .current{background:#2563eb;color:#fff}
  .empty{text-align:center;padding:40px;color:#64748b}
  code{font-family:Menlo,Consolas,monospace;background:#f1f5f9;padding:2px 6px;border-radius:4px}
</style>
</head>
<body>
  <div class="top">
    <h1>پنل مدیریت ترخیصان — لیست شماره‌ها</h1>
    <div>
      <a class="btn" href="export.php?<?= h(http_build_query(compact('q','from','to'))) ?>">دانلود CSV</a>
    </div>
  </div>

  <div class="card">
    <form class="filters" method="get">
      <div>
        <label>جستجو (شماره / عبارت)</label>
        <input name="q" value="<?= h($q) ?>" placeholder="09... یا متن" />
      </div>
      <div>
        <label>از تاریخ</label>
        <input type="date" name="from" value="<?= h($from) ?>" />
      </div>
      <div>
        <label>تا تاریخ</label>
        <input type="date" name="to" value="<?= h($to) ?>" />
      </div>
      <button type="submit">اعمال فیلتر</button>
      <a class="btn ghost" href="index.php">پاک کردن</a>
    </form>
    <p class="muted" style="margin-top:10px">مجموع: <strong><?= number_format($total) ?></strong> رکورد</p>
  </div>

  <div class="card">
    <?php if (!$rows): ?>
      <div class="empty">رکوردی یافت نشد.</div>
    <?php else: ?>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>شماره موبایل</th>
          <th>عبارت جستجو</th>
          <th>IP</th>
          <th>تاریخ ثبت</th>
          <th>عملیات</th>
        </tr>
      </thead>
      <tbody>
      <?php foreach ($rows as $r): ?>
        <tr>
          <td><?= (int)$r['id'] ?></td>
          <td><code><?= h($r['phone']) ?></code></td>
          <td><?= h($r['phrase']) ?></td>
          <td class="muted"><?= h($r['ip']) ?></td>
          <td class="muted"><?= h($r['created_at']) ?></td>
          <td>
            <form method="post" action="delete.php" onsubmit="return confirm('حذف این رکورد؟');" style="display:inline">
              <input type="hidden" name="id" value="<?= (int)$r['id'] ?>">
              <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
              <button class="danger" type="submit">حذف</button>
            </form>
          </td>
        </tr>
      <?php endforeach ?>
      </tbody>
    </table>

    <?php if ($pages > 1): ?>
    <div class="pagination">
      <?php for ($i = 1; $i <= $pages; $i++):
        $qs = http_build_query(array_merge($_GET, ['page' => $i])); ?>
        <?php if ($i === $page): ?>
          <span class="current"><?= $i ?></span>
        <?php else: ?>
          <a href="?<?= h($qs) ?>"><?= $i ?></a>
        <?php endif ?>
      <?php endfor ?>
    </div>
    <?php endif ?>
    <?php endif ?>
  </div>
</body>
</html>
