<?php

	/** Группы прав на функционал модуля */
	$permissions = [
		/** Возможные точки входа в административный интерфейс модуля */
		'adminEntryPoints' => [
			'posts',
			'blogs',
			'comments',
			'config',
			'edit',
			'add'
		],
		/** Права на просмотр блога */
		'common' => [
			'blog',
			'blogslist',
			'commentadd',
			'commentslist',
			'comment',
			'post',
			'postslist',
			'getpostslist',
			'postview',
			'viewblogauthors',
			'viewblogfriends',
			'postsbytag',
			'checkallowcomments',
			'preparecut',
			'preparetags',
			'preparecontent',
			'getposttags'
		],
		/** Права на добавление постов с клиентской части */
		'add' => [
			'placecontrols',
			'itemdelete',
			'postadd',
			'postedit',
			'edituserblogs',
			'draughtslist'
		],
		/** Права на администрирование модулей */
		'admin' => [
			'blogs',
			'posts',
			'comments',
			'listitems',
			'getallblogs',
			'add',
			'edit',
			'activity',
			'blog.edit',
			'post.edit',
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
		/** Права на удаление блогов, постов и комментариев */
		'delete' => [
			'getchildrenpart',
			'del'
		]
	];

