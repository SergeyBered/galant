<?php

	/** Группы прав на функционал модуля */
	$permissions = [
		/** Возможные точки входа в административный интерфейс модуля */
		'adminEntryPoints' => [
			'view_comments',
			'view_noactive_comments',
			'config',
			'edit',
			'add'
		],
		/** Просмотр о создание комментариев */
		'insert' => [
			'insert',
			'post',
			'comment',
			'countcomments',
			'smilepanel',
			'insertvkontakte',
			'insertfacebook',
		],
		/** Администрирование модуля */
		'view_comments' => [
			'add',
			'view_comments',
			'edit',
			'activity',
			'view_noactive_comments',
			'comment.edit',
			'publish',
			'getactivechildrenpart',
			'getinactivechildrenpart',
			'copy',
		],
		/** Права на работу с настройками */
		'config' => [
			'config'
		],
		/** Права на удаление комментариев */
		'delete' => [
			'getchildrenpart',
			'del'
		]
	];
