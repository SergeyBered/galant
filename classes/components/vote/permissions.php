<?php

	/** Группы прав на функционал модуля */
	$permissions = [
		/** Возможные точки входа в административный интерфейс модуля */
		'adminEntryPoints' => [
			'lists',
			'config',
			'edit',
			'add'
		],
		/** Права на добавление опросов */
		'add_poll' => [
			'lists',
			'add',
			'copy',
		],
		/** Права на редактирование опросов */
		'edit_poll' => [
			'polls',
			'lists',
			'edit',
			'answers_list',
			'activity',
			'poll.edit',
			'publish',
			'getactivechildrenpart',
			'getinactivechildrenpart'
		],
		/** Права на удаление опросов */
		'del_poll' => [
			'getchildrenpart',
			'del'
		],
		/** Права на просмотр опросов и их результатов */
		'poll' => [
			'insertvote',
			'results',
			'insertlast',
			'getelementrating'
		],
		/** Права на на участии в опросах */
		'post' => [
			'post',
			'json_rate',
			'setelementrating'
		],
		/** Права на работу с настройками */
		'config' => [
			'config'
		]
	];
