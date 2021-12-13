<?php

	/** Группы прав на функционал модуля */
	$permissions = [
		/** Возможные точки входа в административный интерфейс модуля */
		'adminEntryPoints' => [
			'users_list',
			'users_list_all',
			'groups_list',
			'authorsList',
			'config',
			'edit',
			'add'
		],
		/** Права на авторизацию */
		'login' => [
			'login',
			'login_do',
			'welcome',
			'auth',
			'is_auth',
			'logout',
			'createauthoruser',
			'createauthorguest',
			'viewauthor',
			'permissions',
			'ping',
			'loginza',
			'ulogin',
			'getloginzaprovider',
			'restoreUser',
			'user'
		],
		/** Права на регистрацию */
		'registrate' => [
			'registrate',
			'registrate_do',
			'registrate_done',
			'activate',
			'activateuser',
			'getactivateresult',
			'forget',
			'forget_do',
			'getforgetresult',
			'restore',
			'reactivate',
			'reactivate_do',
			'reactivate_done'
		],
		/** Права на редактирование настроек */
		'settings' => [
			'settings',
			'settings_do',
			'loadusersettings',
			'saveusersettings'
		],
		/** Права на администрирование модуля */
		'users_list' => [
			'users_list',
			'groups_list',
			'users_list_all',
			'add',
			'edit',
			'activity',
			'choose_perms',
			'authorsList'
		],
		/** Права на просмотр профиля пользователей */
		'profile' => [
			'profile',
			'list_users',
			'count_users',
			'getfavourites',
			'getpermissionsOwners',
		],
		/** Права на работу с настройками */
		'config' => [
			'config'
		],
		/** Права на удаление пользователей и групп */
		'delete' => [
			'del'
		]
	];

