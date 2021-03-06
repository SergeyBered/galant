<?php

	/** Языковые константы для английской версии */
	$i18n = [
		'header-config-main' => 'Global settings',
		'option-admin_email' => 'E-mail of administrator',
		'option-keycode' => 'License key',
		'option-chache_browser' => 'Allow browser cache',
		'option-disable_url_autocorrection' => 'Disable URL autocorrection',
		'option-disable_captcha' => 'Disable CAPTCHA',
		'option-show_macros_onerror' => 'Show macros source on errors',
		'option-site_name' => 'Site name',
		'option-ip_blacklist' => 'IP blacklist',
		'option-session_lifetime' => 'Session lifetime',
		'option-busy_quota_files_and_images' => 'Busy disk size (summary for /files/ and /images/, Mb)',
		'option-busy_quota_files_and_images_percent' => 'Percent of busy disk size (summary for /files/ and /images/, Mb)',
		'option-quota_files_and_images' => 'Restriction of disk space (summary for /files/ and /images/, Mb)',
		'option-busy_quota_uploads' => 'Busy of disk size for directory /sys-temp/uploads/, Mb',
		'option-quota_uploads' => 'Restriction of disk space for directory /sys-temp/uploads/, Mb',
		'option-timezones' => 'Time zone',
		'option-redirect_to_default_module' => 'Redirect to default admin module after аuth',
		'option-modules' => 'Default admin module',
		'header-config-mails' => 'Outgoing mails settings',
		'option-email_from' => 'Sender e-mail',
		'option-fio_from' => 'Sender name',
		'option-engine' => 'Mail engine',
		'option-is-disable-parse-content' => 'Disable parsing mail content',
		'option-x-mailer' => 'X-Mailer',
		'option-timeout' => 'Timeout',
		'option-encryption' => 'Encryption',
		'option-auth' => 'Auth',
		'option-username' => 'Username',
		'option-password' => 'Password',
		'option-is-debug' => 'Debug mode',
		'mail-encryption-ssl' => 'SSL',
		'mail-encryption-tls' => 'TLS',
		'mail-encryption-auto' => 'Auto',
		'mail-engine-php-mail' => 'phpMail',
		'mail-engine-smtp' => 'SMTP',
		'mail-engine-null-engine' => 'Stub',
		'option-is-use-verp' => 'Use VERP',
		'header-config-social_networks' => 'Social Networks',
		'header-config-memcached' => 'Memcached connection settings',
		'group-memcached' => 'Memcached',
		'option-host' => 'Host',
		'option-port' => 'Port',
		'option-is_enabled' => 'Memcached enabled',
		'option-status' => 'Status',
		'config-memcache-no-connection' => 'No connection',
		'config-memcache-disabled' => 'Disconnected',
		'config-memcache-used' => 'Used',
		'label-langs-list' => 'Languages list',
		'label-lang-prefix' => 'Prefix',
		'header-config-langs' => 'Languages',
		'header-config-domains' => 'Domains settings',
		'label-domain-address' => 'Domain host',
		'label-domain-mirror-address' => 'Mirror domain host',
		'label-domain-lang' => 'Default languages',
		'label-mirrows' => 'Settings',
		'header-config-domain_del' => 'Domain deleting',
		'error-can-not-delete-default-domain' => 'Default domain deleting is denied.',
		'tabs-config-main' => 'Globals',
		'tabs-config-langs' => 'Languages',
		'tabs-config-domains' => 'Domains',
		'tabs-config-memcached' => 'Memcached',
		'tabs-config-mails' => 'Mails',
		'tabs-config-security' => 'Security',
		'header-config-domain_mirrows' => 'Domain properties',
		'header-config-lang_del' => 'Delete language version',
		'option-upload_max_filesize' => 'Maximum upload filesize in PHP settings (Mb)',
		'option-max_img_filesize' => 'Maximum upload filesize (Mb)',
		'header-config-security' => 'Security',
		'group-static' => 'Cache settings',
		'group-test' => 'Testing',
		'group-security-audit' => 'System security audit',
		'header-config-captcha' => 'Captcha',
		'null-captcha' => 'Disabled',
		'captcha' => 'Classic CAPTCHA',
		'recaptcha' => 'Google reCAPTCHA',
		'group-captcha' => 'System-wide CAPTCHA settings',
		'option-use-site-settings' => 'Use site settings',
		'option-captcha' => 'CAPTCHA',
		'option-captcha-drawer' => 'CAPTCHA drawer class',
		'option-captcha-remember' => 'Remember successful CAPTCHA for current user',
		'option-recaptcha-sitekey' => 'sitekey option for reCAPTCHA',
		'option-recaptcha-secret' => 'secret option for reCAPTCHA',
		'option-expire' => 'Cache expire',
		'cache-static-short' => 'Short cache, max 10 mins',
		'cache-static-normal' => 'Normal cache, max 1 day (recommended)',
		'cache-static-long' => 'Long cache, max 1 month',
		'option-ga-id' => 'Google Analytics Id',
		'header-config-branching' => 'Data base optimization',
		'label-optimize-db' => 'Optimize',
		'header-config-cache' => 'Caching',
		'tabs-config-cache' => 'Caching',
		'group-engine' => 'General cache',
		'option-current-engine' => 'Current cache engine',
		'option-cache-status' => 'Cache status',
		'cache-engine-on' => 'Working',
		'cache-engine-off' => 'Out of service',
		'option-cache-size' => 'Cache size',
		'cache-size-off' => 'Cant calculate',
		'option-engines' => 'Cache engines',
		'cache-engine-memcache' => 'Memcache',
		'cache-engine-memcached' => 'Memcached',
		'cache-engine-null' => 'Stub',
		'cache-engine-array' => 'Array',
		'cache-engine-fs' => 'File system',
		'cache-engine-redis' => 'Redis',
		'cache-engine-database' => 'Data base',
		'group-streamscache' => 'Protocols and macros cache for XSLT and PHP templaters',
		'option-cache-enabled' => 'Enabled',
		'option-static-cache-enabled' => 'Enabled',
		'option-cache-lifetime' => 'Cache lifetime (seconds)',
		'option-reset' => 'Flush cache',
		'group-seo' => 'SEO settings',
		'group-additional' => 'Additional settings',
		'option-allow-alt-name-with-module-collision' => 'Allow page url and module name collision',
		'cache-engine-none' => 'Not selected',
		'group-branching' => 'Database optimization',
		'option-branch' => 'Optimize DB',
		'js-config-optimize-db-header' => 'Optimizing DB',
		'js-config-optimize-db-content' => '<p>Database is rebuilding.<br />Please, wait.</p>',
		'event-systemModifyElement-title' => 'Page is modified',
		'event-systemModifyElement-content' => "Page \"<a href='%page-link%'>%page-name%</a>\" is modified",
		'event-systemCreateElement-title' => 'Page is created',
		'event-systemCreateElement-content' => "New page \"<a href='%page-link%'>%page-name%</a>\" is created",
		'event-systemSwitchElementActivity-title' => 'Activity is changed',
		'event-systemSwitchElementActivity-content' => "Activity of \"<a href='%page-link%'>%page-name%</a>\" is changed",
		'event-systemDeleteElement-title' => 'Page is deleted',
		'event-systemDeleteElement-content' => "Page \"<a href='%page-link%'>%page-name%</a>\" is deleted",
		'event-systemMoveElement-title' => 'Page is moved',
		'event-systemMoveElement-content' => "Page \"<a href='%page-link%'>%page-name%</a>\" is moved",
		'event-systemModifyObject-title' => 'Object is modified',
		'event-systemModifyObject-content' => 'Object "%object-name%" of type "%object-type%" is modified',
		'option-disable_too_many_childs_notification' => 'Disable too many childs notification',
		'js-check-security' => 'Test security',
		'js-index-security-fine' => 'Test passed',
		'js-index-security-problem' => 'Test failed',
		'js-index-security-no' => 'Testing was not run',
		'option-security-UFS' => 'UFS protocol is closed',
		'option-security-UObject' => 'UObject protocol is closed',
		'option-security-DBLogin' => 'DB login not equal root',
		'option-security-DBPassword' => 'DB password isn\'t empty',
		'option-security-ConfigIniAccess' => 'Access to configuration file closed',
		'option-security-FoldersAccess' => 'Access to system folders closed',
		'option-security-PhpDisabledForFiles' => 'PHP-scripts executing forbidden in directory /files/',
		'option-security-PhpDisabledForImages' => 'PHP-scripts executing forbidden in directory /images/',
		'option-security-PhpDisabledForTemplates' => 'PHP-scripts executing forbidden in directory /templates/',
		'option-security-ConfigIniCsrfProtection' => 'The website is protected against CSRF attacks (the csrf_protection option in the config.ini file is turned on)',
		'option-security-UserCsrfProtection' => 'The website is protected against CSRF attacks (the "Check CSRF-token when changing user settings" option in the "Users" module is turned on)',
		'option-security-RequireUserPassword' => 'Is the setting "When changing user settings need to request his password" in the "Users" module enabled',
		'option-security-TemplatesEditorGuestAccess' => 'Guest user has no permission to edit template files i module "Site templates"',
		'js-sitemap-ok' => 'OK',
		'js-sitemap-ajax-error' => 'Some ajax error occurred.',
		'js-label-stop-and-close' => 'Stop and close',
		'group-mails' => 'E-mail settings',
		'perms-config-cron_http_execute' => 'Permissions to execute cron via http',
		'perms-config-main' => 'Permissions to work with global settings',
		'perms-config-langs' => 'Permissions to work with languages',
		'perms-config-domains' => 'Permissions to work with domains',
		'perms-config-mails' => 'Permissions to work with mail settings',
		'perms-config-cache' => 'Permissions to work with cache settings',
		'perms-config-security' => 'Permissions to run security tests',
		'perms-config-phpInfo' => 'Permissions to read phpInfo',
		'perms-config-captcha' => 'Permissions to work with captcha settings',
		'perms-config-delete' => 'Permissions for deleting domains, mirrors and languages',
		'group-browser' => 'Browser cache',
		'option-current-browser-cache-engine' => 'Selected engine',
		'option-browser-cache-engine' => 'Available engine list',
		'None-browser-cache' => 'Cache disabled',
		'LastModified-browser-cache' => 'Header "Last-Modified"',
		'EntityTag-browser-cache' => 'Header "ETag"',
		'Expires-browser-cache' => 'Header "Expires"',
		'header-config-phpInfo' => 'phpInfo',
		'mail-site-settings' => 'Site settings',
		'option-smtp-settings-label' => 'SMTP settings',
		'group-mail' => 'Common mail settings',
		'label-favicon' => 'Favicon',
		'js-error-incorrect-favicon' => 'Please, select file with extension \'ico\', \'png\', \'svg\', \'jpeg\', \'gif\', \'jpg\', \'webp\'',
		'js-edit-keycode-warning' => 'Deleting or editing the domain key may cause some functions to be disabled, or you may not be able to contact Customer Support or get up-to-date updates. Change it only if you are confident in your actions.'
	];
