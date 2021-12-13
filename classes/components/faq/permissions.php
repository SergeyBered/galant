<?php

	/** Группы прав на функционал модуля */
	$permissions = [
		/** Возможные точки входа в административный интерфейс модуля */
		'adminEntryPoints' => [
			'projects_list',
			'config',
			'edit',
			'add'
		],
		/** Права на просмотр базы знаний */
		'projects' => [
			'project',
			'projects',
			'category',
			'question'
		],
		/** Право задать вопрос */
		'post_question' => [
			'addquestionform',
			'post_question',
		],
		/** Права на администрирование модуля */
		'projects_list' => [
			'lists',
			'projects_list',
			'add',
			'edit',
			'activity',
			'config',
			'category.edit',
			'project.edit',
			'question.edit',
			'publish',
			'getactivechildrenpart',
			'getinactivechildrenpart',
			'copy',
		],
		/** Права на работу с настройками */
		'config' => [
			'config'
		],
		/** Права на удаление проектов, категорий и вопросов */
		'delete' => [
			'getchildrenpart',
			'del',
		]
	];
