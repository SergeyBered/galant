<?php

	namespace UmiCms\Manifest\Filemanager;

	/** Команда переноса прав пользователей на управление файловым менеджером */
	class UpdatePermissionsFilemanagerAction extends \Action {

		/** @inheritDoc */
		public function execute() {
			$umiPermissions = \permissionsCollection::getInstance();
			$ownerIdList = $umiPermissions->getPrivileged([['data', 'files']]);

			foreach ($ownerIdList as $ownerId) {
				if (!$umiPermissions->isAllowedMethod($ownerId, 'filemanager', 'files')) {
					$umiPermissions->setMethodPermissions($ownerId, 'filemanager', 'files');
				}
				$umiPermissions->deleteMethodPermission($ownerId, 'data', 'files');
			}

			$ownerIdList = $umiPermissions->getPrivileged([['config', 'watermark']]);

			foreach ($ownerIdList as $ownerId) {
				if (!$umiPermissions->isAllowedMethod($ownerId, 'filemanager', 'watermark')) {
					$umiPermissions->setMethodPermissions($ownerId, 'filemanager', 'watermark');
				}
				$umiPermissions->deleteMethodPermission($ownerId, 'config', 'watermark');
			}
		}

		/** @inheritDoc */
		public function rollback() {
			return $this;
		}
	}
