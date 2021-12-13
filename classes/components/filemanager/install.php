<?php
	/** Установщик модуля */

	/** @var array $INFO реестр модуля */
	$INFO = [];
	$INFO['name'] = 'filemanager';
	$INFO['config'] = '0';
	$INFO['default_method'] = 'list_files';
	$INFO['default_method_admin'] = 'shared_files';

	/** @var array $COMPONENTS файлы модуля */
	$COMPONENTS = [];
	$COMPONENTS[] = './classes/components/filemanager/admin.php';
	$COMPONENTS[] = './classes/components/filemanager/class.php';
	$COMPONENTS[] = './classes/components/filemanager/customAdmin.php';
	$COMPONENTS[] = './classes/components/filemanager/customMacros.php';
	$COMPONENTS[] = './classes/components/filemanager/handlers.php';
	$COMPONENTS[] = './classes/components/filemanager/i18n.en.php';
	$COMPONENTS[] = './classes/components/filemanager/i18n.php';
	$COMPONENTS[] = './classes/components/filemanager/includes.php';
	$COMPONENTS[] = './classes/components/filemanager/install.php';
	$COMPONENTS[] = './classes/components/filemanager/lang.en.php';
	$COMPONENTS[] = './classes/components/filemanager/lang.php';
	$COMPONENTS[] = './classes/components/filemanager/macros.php';
	$COMPONENTS[] = './classes/components/filemanager/permissions.php';
	$COMPONENTS[] = './classes/components/filemanager/Classes/elfinder/fileManager.php';
	$COMPONENTS[] = './classes/components/filemanager/manifest/actions/UpdatePermissionsFilemanager.php';
	$COMPONENTS[] = './classes/components/filemanager/manifest/update.xml';
	$COMPONENTS[] = './classes/components/filemanager/Classes/elfinder/elFinderVolumeUmiLocalFileSystem.class.php';
	$COMPONENTS[] = './classes/components/filemanager/Classes/Watermark/iAdminSettingsManager.php';
	$COMPONENTS[] = './classes/components/filemanager/Classes/Watermark/AdminSettingsManager.php';
