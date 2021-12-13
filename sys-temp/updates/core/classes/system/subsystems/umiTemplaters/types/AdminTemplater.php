<?php

namespace UmiCms\System\Templater;

use UmiCms\Service;
use UmiCms\System\Admin\iSkin;
use UmiCms\System\Auth\iAuth;
use UmiCms\System\Module\Permissions\iLoader;

/**
 * @package UmiCms\System\Templater
 */
class AdminTemplater extends \umiTemplaterXSLT {

	/** @var iSkin */
	private $skin;
	/** @var \iConfiguration */
	private $config;
	/** @var \iPermissionsCollection */
	private $permissions;
	/** @var iAuth */
	private $auth;
	/** @var \icmsController */
	private $controller;
	/** @var iLoader загрузчик прав модулей */
	private $permissionsLoader;

	/**
	 * @param iSkin $skin
	 * @param \iConfiguration $config
	 * @param \iPermissionsCollection $permissions
	 * @param iAuth $auth
	 * @param \iCmsController $controller
	 */
	public function __construct(
		iSkin $skin, \iConfiguration $config, \iPermissionsCollection $permissions,
		iAuth $auth, \iCmsController $controller, iLoader $permissionsLoader
	) {
		$this->skin = $skin;
		$this->config = $config;
		$this->permissions = $permissions;
		$this->auth = $auth;
		$this->controller = $controller;
		$this->permissionsLoader = $permissionsLoader;
	}

	/** @inheritDoc */
	public function getTemplatesSource() {
		if (!is_file($this->templatePath())) {
			throw new \coreException('Template "' . $this->templatePath() . '" not found.');
		}

		return $this->templatePath();
	}

	/** @return string */
	private function templatePath() {
		return $this->skinPath() . $this->fileName();
	}

	/** @return string */
	private function skinPath() {
		return $this->config->includeParam('templates.skins', ['skin' => $this->skin->name()]);
	}

	/** @return string */
	private function fileName() {
		$module = $this->controller->getCurrentModule();
		$method = $this->controller->getCurrentMethod();

		$userId = $this->auth->getUserId();
		$isAllowedModule = $this->permissions->isAllowedModule($userId, $module);
		$isAllowedMethod = $this->permissions->isAllowedMethod($userId, $module, $method);
		$isAllowed = $isAllowedModule && $isAllowedMethod;
		$isAdminEntryPoint = $this->permissionsLoader->isAdminEntryPoint($module, $method);

		if ($this->permissions->isAdmin(false, true)) {
			if ($isAllowed) {
				return $this->config->get('includes', 'templates.admin.entry');
			}

			$userId = Service::Auth()->getUserId();

			if ($isAdminEntryPoint && $this->permissions->hasAllowedAdminEntryPoints($userId)) {
				return $this->config->get('includes', 'templates.admin.no-perms');
			}
		}

		return $this->config->get('includes', 'templates.admin.login');
	}
}
