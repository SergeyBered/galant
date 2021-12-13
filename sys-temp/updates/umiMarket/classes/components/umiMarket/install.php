<?php
	/** Установщик модуля */

	/** @var array $INFO реестр модуля */
	$INFO = [
		'name' => 'umiMarket', // Имя модуля
		'config' => '0', // У модуля есть настройки
		'default_method' => 'empty', // Метод по умолчанию в клиентской части
		'default_method_admin' => 'catalog', // Метод по умолчанию в административной части
	];

	/** @var array $COMPONENTS файлы модуля */
	$COMPONENTS = [
		'./classes/components/umiMarket/Classes/Market/Client.php',
		'./classes/components/umiMarket/Classes/Market/iClient.php',
		'./classes/components/umiMarket/admin.php',
		'./classes/components/umiMarket/autoload.php',
		'./classes/components/umiMarket/class.php',
		'./classes/components/umiMarket/customAdmin.php',
		'./classes/components/umiMarket/customMacros.php',
		'./classes/components/umiMarket/i18n.php',
		'./classes/components/umiMarket/i18n.en.php',
		'./classes/components/umiMarket/install.php',
		'./classes/components/umiMarket/lang.php',
		'./classes/components/umiMarket/lang.en.php',
		'./classes/components/umiMarket/macros.php',
		'./classes/components/umiMarket/permissions.php',
		'./classes/components/umiMarket/services.php',
	];