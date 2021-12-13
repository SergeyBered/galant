<?php

	/** Группы прав на функционал модуля */
	$permissions = [
		/** Возможные точки входа в административный интерфейс модуля */
		'adminEntryPoints' => [
			'orders',
			'services',
			'employees',
			'pages',
			'config',
			'serviceWorkingTime',
			'editOrder',
			'editServiceGroup',
			'editEmployee',
			'editPage',
			'addServiceGroup',
			'addService',
			'addEmployee',
			'addPage'
		],
		/** Права на запись */
		'enroll' => [
			'getappointmentsdata',
			'postappointment',
			'employees',
			'services',
			'statuses',
			'servicegroups',
			'employeeschedules',
			'employeeservicesids',
			'employeesbyserviceid',
			'getdefaultschedule',
			'page'
		],
		/** Права на администрирование модуля */
		'manage' => [
			'pages',
			'addpage',
			'editpage',
			'activity',
			'getdatasetconfiguration',
			'page.edit',
			'publish',
			'servicegroups',
			'services',
			'employees',
			'orders',
			'employeeslist',
			'serviceslist',
			'statuseslist',
			'servicegroupslist',
			'employeeslistbyserviceid',
			'saveorderfield',
			'editservice',
			'addservice',
			'servicegroups',
			'saveservicefield',
			'editservicegroup',
			'addservicegroup',
			'savegroupfield',
			'addemployee',
			'editemployee',
			'employeescheduleslist',
			'getscheduleworktimes',
			'employeeservicesidslist',
			'serviceworkingtime',
			'editserviceentity',
			'saveserviceentityfield',
			'changeservicegroup',
			'flushservicedataconfig',
			'flushorderdataconfig',
			'flushemployeedataconfig',
			'getactivechildrenpart',
			'getinactivechildrenpart',
			'copy',
			'editorder'
		],
		/** Права на работу с настройками */
		'config' => [
			'config'
		],
		/** Права на удаление заявок, услуг, групп услуг, сотрудников и страниц с записью */
		'delete' => [
			'getchildrenpart',
			'deleteorder',
			'deleteservicegroups',
			'deleteservices',
			'deleteserviceentities',
			'deleteemployees',
			'del'
		]
	];

