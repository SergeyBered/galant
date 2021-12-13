<?php

	use UmiCms\Service;
	use UmiCms\Classes\Components\Config\Mail\iAdminSettingsManager as MailAdminSettingsManager;
	use UmiCms\Classes\Components\Config\Captcha\iAdminSettingsManager as CaptchaAdminSettingsManager;

	/** Класс функционала административной панели */
	class ConfigAdmin {

		use baseModuleAdmin;

		/** @var config|ConfigTest $module */
		public $module;

		/**
		 * Возвращает главные настройки системы.
		 * Если передан ключевой параметр $_REQUEST['param0'] = do,
		 * то метод запустит сохранение настроек.
		 * @throws coreException
		 * @throws requireAdminParamException
		 * @throws wrongParamException
		 * @throws publicAdminException
		 * @throws Exception
		 */
		public function main() {
			$regedit = Service::Registry();
			$config = mainConfiguration::getInstance();

			$timezones = $this->module->getTimeZones();
			$timezones['value'] = $config->get('system', 'time-zone');
			$redirectToDefaultModule = $regedit->get('//settings/default_module_admin_changed');
			$modules = [];

			foreach ($regedit->getList('//modules') as $module) {
				list($module) = $module;
				$modules[$module] = getLabel('module-' . $module);
			}

			$modules['value'] = $regedit->get('//settings/default_module_admin') ?: 'events';

			$params = [
				'globals' => [
					'string:keycode' => null,
					'boolean:disable_url_autocorrection' => null,
					'int:max_img_filesize' => null,
					'status:upload_max_filesize' => null,
					'boolean:allow-alt-name-with-module-collision' => null,
					'int:session_lifetime' => null,
					'status:busy_quota_files_and_images' => null,
					'int:quota_files_and_images' => null,
					'status:busy_quota_uploads' => null,
					'int:quota_uploads' => null,
					'boolean:disable_too_many_childs_notification' => null,
					'select:timezones' => null,
					'boolean:redirect_to_default_module' => null,
					'select:modules' => null
				]
			];

			/** @var data $moduleData */
			$moduleData = cmsController::getInstance()->getModule('data');
			$maxUploadFileSize = $moduleData->getAllowedMaxFileSize();
			$registrySettings = Service::RegistrySettings();

			if ($this->isSaveMode()) {
				$params = $this->expectParams($params);

				$registrySettings->set('keycode', $params['globals']['string:keycode']);
				$regedit->set('//settings/disable_url_autocorrection', $params['globals']['boolean:disable_url_autocorrection']);
				$maxImgFileSize = $params['globals']['int:max_img_filesize'];

				if (($maxUploadFileSize != -1 && $maxUploadFileSize > 0) && ($maxImgFileSize <= 0 || $maxImgFileSize > $maxUploadFileSize)) {
					$maxImgFileSize = $maxUploadFileSize;
				}

				$regedit->set('//settings/max_img_filesize', $maxImgFileSize);

				$config->set('kernel', 'ignore-module-names-overwrite', $params['globals']['boolean:allow-alt-name-with-module-collision']);
				$config->set('session', 'active-lifetime', $params['globals']['int:session_lifetime']);

				$quota = (int) $params['globals']['int:quota_files_and_images'];
				if ($quota < 0) {
					$quota = 0;
				}
				$config->set('system', 'quota-files-and-images', $quota * 1024 * 1024);

				$quotaUploads = (int) $params['globals']['int:quota_uploads'];
				if ($quotaUploads < 0) {
					$quotaUploads = 0;
				}
				$config->set('system', 'quota-uploads', $quotaUploads * 1024 * 1024);
				$config->set('system', 'disable-too-many-childs-notification', $params['globals']['boolean:disable_too_many_childs_notification']);
				$config->set('system', 'time-zone', $params['globals']['select:timezones']);
				$config->save();
				$regedit->set('//settings/default_module_admin_changed', $params['globals']['boolean:redirect_to_default_module']);
				$regedit->set('//settings/default_module_admin', $params['globals']['select:modules']);
				$this->chooseRedirect();
			}

			$params['globals']['string:keycode'] = $registrySettings->getLicense();
			$params['globals']['boolean:disable_url_autocorrection'] =
				$regedit->get('//settings/disable_url_autocorrection');
			$params['globals']['status:upload_max_filesize'] = $maxUploadFileSize;

			$maxImgFileSize = $regedit->get('//settings/max_img_filesize');

			$params['globals']['int:max_img_filesize'] = $maxImgFileSize ?: $maxUploadFileSize;
			$params['globals']['boolean:allow-alt-name-with-module-collision'] =
				$config->get('kernel', 'ignore-module-names-overwrite');

			$quotaByte = getBytesFromString(mainConfiguration::getInstance()->get('system', 'quota-files-and-images'));
			$params['globals']['status:busy_quota_files_and_images'] =
				ceil(getBusyDiskSize(getResourcesDirs()) / (1024 * 1024));

			if ($quotaByte > 0) {
				$params['globals']['status:busy_quota_files_and_images'] .= ' ( ' . getBusyDiskPercent() . '% )';
			}

			$params['globals']['int:quota_files_and_images'] =
				(int) (getBytesFromString($config->get('system', 'quota-files-and-images')) / (1024 * 1024));
			$quotaUploadsBytes = getBytesFromString(mainConfiguration::getInstance()->get('system', 'quota-uploads'));
			$params['globals']['status:busy_quota_uploads'] = ceil(getBusyDiskSize(getUploadsDir()) / (1024 * 1024));

			if ($quotaUploadsBytes > 0) {
				$params['globals']['status:busy_quota_uploads'] .= ' ( ' .
					getOccupiedDiskPercent(getUploadsDir(), $quotaUploadsBytes) . '% )';
			}

			$params['globals']['int:quota_uploads'] =
				(int) (getBytesFromString($config->get('system', 'quota-uploads')) / (1024 * 1024));
			$params['globals']['int:session_lifetime'] = $config->get('session', 'active-lifetime');
			$params['globals']['boolean:disable_too_many_childs_notification'] =
				$config->get('system', 'disable-too-many-childs-notification');
			$params['globals']['select:timezones'] = $timezones;
			$params['globals']['boolean:redirect_to_default_module'] = $redirectToDefaultModule;
			$params['globals']['select:modules'] = $modules;

			if (isDemoMode()) {
				unset($params['globals']['string:keycode']);
			}

			$this->setConfigResult($params);
		}

		/**
		 * Возвращает настройки кеширования.
		 * Если передан ключевой параметр $_REQUEST['param0'] = do,
		 * то метод запустит сохранение настроек.
		 * @throws coreException
		 * @throws publicAdminException
		 * @throws requireAdminParamException
		 * @throws wrongParamException
		 * @throws Exception
		 */
		public function cache() {
			$staticSettings = $this->module->getStaticCacheSettings();
			$streamsSettings = $this->module->getStreamsCacheSettings();

			$cacheFrontend = Service::CacheFrontend();
			$enginesList = $cacheFrontend->getCacheEngineList();
			$currentEngineName = $cacheFrontend->getCacheEngineName();

			$engines = [getLabel('cache-engine-none')];
			foreach ($enginesList as $engineName) {
				$engines[$engineName] = getLabel('cache-engine-' . $engineName);
			}

			$engines['value'] = $currentEngineName;
			$cacheEngineLabel = $currentEngineName
				? getLabel('cache-engine-' . $currentEngineName)
				: getLabel('cache-engine-none');
			$cacheStatus = $cacheFrontend->isCacheEnabled() ? getLabel('cache-engine-on') : getLabel('cache-engine-off');
			$browserSettings = $this->module->getBrowserCacheSettings();

			$params = [
				'engine' => [
					'status:current-engine' => $cacheEngineLabel,
					'status:cache-status' => $cacheStatus,
					'select:engines' => $engines
				],
				'streamscache' => [
					'boolean:cache-enabled' => null,
					'int:cache-lifetime' => null,
				],
				'static' => [
					'boolean:static-cache-enabled' => null,
					'select:expire' => [
						'short' => getLabel('cache-static-short'),
						'normal' => getLabel('cache-static-normal'),
						'long' => getLabel('cache-static-long')
					]
				],
				'browser' => [
					'status:current-browser-cache-engine' => getLabel(sprintf('%s-browser-cache', $browserSettings['current-engine'])),
					'select:browser-cache-engine' => [
						'None' => getLabel('None-browser-cache'),
						'LastModified' => getLabel('LastModified-browser-cache'),
						'EntityTag' => getLabel('EntityTag-browser-cache'),
						'Expires' => getLabel('Expires-browser-cache'),
					]
				],
				'test' => [

				],
			];

			if (!$staticSettings['expire']) {
				unset($params['static']['select:expire']);
			}

			if ($currentEngineName) {
				$params['engine']['status:reset'] = true;
			}

			if (!$streamsSettings['cache-enabled']) {
				unset($params['streamscache']['int:cache-lifetime']);
			}

			if (!$currentEngineName) {
				unset($params['streamscache']);
			}

			$mode = (string) getRequest('param0');
			$is_demo = isDemoMode();

			if ($mode == 'do' and !$is_demo) {
				$params = $this->expectParams($params);

				if (!isset($params['static']['select:expire'])) {
					$params['static']['select:expire'] = 'normal';
				}

				$staticSettings = [
					'enabled' => $params['static']['boolean:static-cache-enabled'],
					'expire' => $params['static']['select:expire']
				];

				if (isset($params['streamscache']['boolean:cache-enabled'])) {
					$streamsSettings['cache-enabled'] = $params['streamscache']['boolean:cache-enabled'];
				}

				if (isset($params['streamscache']['int:cache-lifetime'])) {
					$streamsSettings['cache-lifetime'] = $params['streamscache']['int:cache-lifetime'];
				}

				$this->module->setStaticCacheSettings($staticSettings);
				$this->module->setStreamsCacheSettings($streamsSettings);

				$browserSettings = [
					'current-engine' => $params['browser']['select:browser-cache-engine']
				];

				$this->module->setBrowserCacheSettings($browserSettings);
				Service::CacheFrontend()->switchCacheEngine($params['engine']['select:engines']);
				$this->chooseRedirect($this->module->pre_lang . '/admin/config/cache/');
			} elseif ($mode == 'reset') {
				if (!$is_demo) {
					Service::CacheFrontend()->flush();
				}
				$this->chooseRedirect($this->module->pre_lang . '/admin/config/cache/');
			}

			$staticSettings = $this->module->getStaticCacheSettings();
			$params['static']['boolean:static-cache-enabled'] = $staticSettings['enabled'];
			$params['static']['select:expire']['value'] = $staticSettings['expire'];

			if (!$staticSettings['expire']) {
				unset($params['static']['select:expire']);
			}

			$streamsSettings = $this->module->getStreamsCacheSettings();
			$params['streamscache']['boolean:cache-enabled'] = $streamsSettings['cache-enabled'];
			$params['streamscache']['int:cache-lifetime'] = $streamsSettings['cache-lifetime'];

			if (!$params['streamscache']['boolean:cache-enabled']) {
				unset($params['streamscache']['int:cache-lifetime']);
			}

			if (!$currentEngineName) {
				unset($params['streamscache']);
			}

			$this->setConfigResult($params);
		}

		/**
		 * Возвращает список доменов для одноименной
		 * вкладки модуля.
		 * Если передан ключевой параметр $_REQUEST['param0'] = do,
		 * то метод запустит сохранение списка.
		 * @throws coreException
		 * @throws publicAdminException
		 * @throws Exception
		 */
		public function domains() {
			if ($this->isSaveMode()) {
				if (!isDemoMode()) {
					$this->saveEditedList('domains');
				}
				$this->chooseRedirect($this->module->pre_lang . '/admin/config/domains/');
			}

			$domains = Service::DomainCollection()->getList();

			$this->setDataType('list');
			$this->setActionType('modify');
			$data = $this->prepareData($domains, 'domains');
			$this->setData($data, umiCount($domains));
			$this->doData();
		}

		/**
		 * Возвращает данные для вкладки "Свойства домена":
		 *   - seo настройки
		 *   - список зеркал домена
		 * Если передан ключевой параметр $_REQUEST['param1'] = do,
		 * то метод запустит сохранение списка и настроек.
		 * @throws coreException
		 * @throws publicAdminException
		 * @throws requireAdminParamException
		 * @throws requreMoreAdminPermissionsException
		 * @throws wrongParamException
		 */
		public function domain_mirrows() {
			$domainId = getRequest('param0');
			$regedit = Service::Registry();
			$langId = Service::LanguageDetector()->detectId();

			$seoInfo = [];
			$additionalInfo = [];
			$seoInfo['string:seo-title'] = $regedit->get("//settings/title_prefix/{$domainId}/{$langId}");
			$seoInfo['string:seo-default-title'] = $regedit->get("//settings/default_title/{$domainId}/{$langId}");
			$seoInfo['string:seo-keywords'] = $regedit->get("//settings/meta_keywords/{$domainId}/{$langId}");
			$seoInfo['string:seo-description'] = $regedit->get("//settings/meta_description/{$domainId}/{$langId}");
			$seoInfo['string:ga-id'] = $regedit->get("//settings/ga-id/{$domainId}");
			$additionalInfo['string:site_name'] = $regedit->get("//settings/site_name/{$domainId}/{$langId}/") ?
				$regedit->get("//settings/site_name/{$domainId}/{$langId}") : $regedit->get('//settings/site_name');

			$params = [
				'seo' => $seoInfo,
				'additional' => $additionalInfo,
			];

			if ($this->isSaveMode('param1')) {
				if (!isDemoMode()) {

					$this->module->validateDeletingListPermissions();
					$this->saveEditedList('domain_mirrows');
					$params = $this->expectParams($params);

					$title = $params['seo']['string:seo-title'];
					$defaultTitle = $params['seo']['string:seo-default-title'];
					$keywords = $params['seo']['string:seo-keywords'];
					$description = $params['seo']['string:seo-description'];
					$gaId = $params['seo']['string:ga-id'];
					$siteName = $params['additional']['string:site_name'];

					$regedit->set("//settings/title_prefix/{$domainId}/{$langId}", $title);
					$regedit->set("//settings/default_title/{$domainId}/{$langId}", $defaultTitle);
					$regedit->set("//settings/meta_keywords/{$domainId}/{$langId}", $keywords);
					$regedit->set("//settings/meta_description/{$domainId}/{$langId}", $description);
					$regedit->set("//settings/ga-id/{$domainId}", $gaId);
					$regedit->set("//settings/site_name/{$domainId}/{$langId}", $siteName);
				}

				$this->chooseRedirect($this->module->pre_lang . '/admin/config/domain_mirrows/' . $domainId . '/');
			}

			$domain = Service::DomainCollection()->getDomain($domainId);
			if (!$domain instanceof iDomain) {
				throw new publicAdminException(getLabel('label-cannot-detect-domain'));
			}

			$mirrors = $domain->getMirrorsList();

			$this->setDataType('settings');
			$this->setActionType('modify');
			$seoData = $this->prepareData($params, 'settings');
			$mirrorsData = $this->prepareData($mirrors, 'domain_mirrows');
			$data = array_merge($seoData, $mirrorsData);
			$this->setData($data);
			$this->doData();
		}

		/**
		 * Возвращает список языков для одноименной
		 * вкладки модуля.
		 * Если передан ключевой параметр $_REQUEST['param0'] = do,
		 * то метод запустит сохранение списка.
		 * @throws coreException
		 * @throws publicAdminException
		 * @throws Exception
		 */
		public function langs() {
			if ($this->isSaveMode() && !isDemoMode()) {
				$this->saveEditedList('langs');
				$this->chooseRedirect();
			}

			$langs = Service::LanguageCollection()
				->getList();

			$this->setDataType('list');
			$this->setActionType('modify');
			$data = $this->prepareData($langs, 'langs');
			$this->setData($data, umiCount($langs));
			$this->doData();
		}

		/**
		 * Возвращает настройки отправляемых писем для вкладки "Почта".
		 * Если передан ключевой параметр $_REQUEST['param0'] = do,
		 * то метод запустит сохранение настроек.
		 * @throws coreException
		 * @throws publicAdminException
		 * @throws requireAdminParamException
		 * @throws wrongParamException
		 * @throws Exception
		 */
		public function mails() {
			/** @var MailAdminSettingsManager $settingsManager */
			$settingsManager = Service::get('MailAdminSettingsManager');
			$params = $settingsManager->getParams();

			if ($this->isSaveMode()) {
				$params = $this->expectParams($params);

				if (!isDemoMode()) {
					$settingsManager->setCommonParams($params['mail']);
					$settingsManager->setCustomParams($params);
				}

				$this->chooseRedirect();
			}

			$this->setConfigResult($params);
		}

		/**
		 * Возвращает результаты тестов безопасности
		 * для вкладки "Безопасность"
		 * @throws coreException
		 * @throws publicAdminException
		 */
		public function security() {
			$params = [
				'security-audit' => []
			];

			foreach ($this->module->getSecurityTestNames() as $test) {
				$params['security-audit'][$test . ':security-' . $test] = null;
			}

			$this->setConfigResult($params);
		}

		/**
		 * Возвращает настройки капчи для вкладки "CAPTCHA"
		 * @throws coreException
		 * @throws publicAdminException
		 * @throws requireAdminParamException
		 * @throws wrongParamException
		 * @throws Exception
		 */
		public function captcha() {
			/** @var CaptchaAdminSettingsManager $settingsManager */
			$settingsManager = Service::get('CaptchaAdminSettingsManager');
			$params = $settingsManager->getParams();

			if ($this->isSaveMode()) {
				$params = self::expectedParams($params);
				$settingsManager->setCommonParams($params['captcha']);
				$settingsManager->setSiteParams($params);
				$this->chooseRedirect();
			}

			$this->setConfigResult($params);
		}

		/**
		 * Возвращает содержимое вкладки "phpInfo"
		 * @throws Exception
		 * @throws coreException
		 */
		public function phpInfo() {
			$systemInfo = Service::SystemInfo();
			$phpInfo = $systemInfo->getInfo(iSystemInfo::PHP_INFO);
			$phpInfo = array_shift($phpInfo);
			$phpInfo = preg_replace("/^.*?\<body\>/is", "", $phpInfo);
			$phpInfo = preg_replace("/<\/body\>.*?$/is", "", $phpInfo);

			$data = [
				'info' => $phpInfo
			];

			$this->setDataSetDeleteResult($data);
		}

		
		/** @deprecated  */
		public function update_sitemap() {
			/** @var seo|Seo $seoModule */
			$seoModule = cmsController::getInstance()->getModule('seo');
			$seoModule->updateSitemap();
		}
	}
