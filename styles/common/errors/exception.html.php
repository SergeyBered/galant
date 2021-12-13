<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Неперехваченное исключение</title>
	<script type="text/javascript">
		function displayTrace(link) {
			if(link) link.style.display = 'none';
			document.getElementById('trace').style.display = '';
		}
	</script>
	<link href="/styles/common/errors/style.css" type="text/css" rel="stylesheet" />
</head>
<body>
	<div class="exception">
		<div id="header">
			<h1>Неперехваченное исключение</h1>
			<a target="_blank" title="UMI.CMS" href="https://umi-cms.ru"><img class="logo" src="/styles/common/images/main_logo.png" alt="UMI.CMS" /></a>
		</div>
		<div id="message">
			<?php  ?>
            <h2>Ошибка <?= $v540d6b8df248755646c4345fc70c2629->type ? '(' . $v540d6b8df248755646c4345fc70c2629->type . ')' : '' ?>: <?= $v540d6b8df248755646c4345fc70c2629->message;?></h2>
			<p id="solution" style="display: none;"></p>
			<?php if (DEBUG_SHOW_BACKTRACE) {?>
				<p>
					<a href="#" onclick="javascript: displayTrace(this); return false;">
						Показать отладочную информацию
					</a>
				</p>
				<div id="trace" class="trace" style="display: none;"><pre><?= $v540d6b8df248755646c4345fc70c2629->traceAsString;?></pre></div>
			<?php }?>
		</div>
		<div id="footer">
			<p><a href="https://www.umi-cms.ru/support">Поддержка пользователей UMI.CMS</a></p>
		</div>
	</div>
</body>
</html>
