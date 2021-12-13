<?php
	/** Установщик модуля */

	/** @var array $INFO реестр модуля */
	$INFO = [
		'name' => 'umiTemplates', // Имя модуля
		'config' => '0', // У модуля есть настройки
		'default_method' => 'empty', // Метод по умолчанию в клиентской части
		'default_method_admin' => 'getTemplateList', // Метод по умолчанию в административной части
	];

	/** @var array $COMPONENTS файлы модуля */
	$COMPONENTS = [
		'./classes/components/umiTemplates/Classes/elfinder/elFinderVolumeTemplateEditorDriver.php',
		'./classes/components/umiTemplates/admin.php',
		'./classes/components/umiTemplates/autoload.php',
		'./classes/components/umiTemplates/class.php',
		'./classes/components/umiTemplates/customAdmin.php',
		'./classes/components/umiTemplates/customMacros.php',
		'./classes/components/umiTemplates/i18n.php',
		'./classes/components/umiTemplates/i18n.en.php',
		'./classes/components/umiTemplates/install.php',
		'./classes/components/umiTemplates/lang.php',
		'./classes/components/umiTemplates/lang.en.php',
		'./classes/components/umiTemplates/macros.php',
		'./classes/components/umiTemplates/permissions.php',
	];

