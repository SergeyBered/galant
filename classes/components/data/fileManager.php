<?php

	use UmiCms\Service;

	/** Класс функционала файлового менеджера */
	class DataFileManager {

		/** @deprecated  */
		public function elfinder_connector($needInfo = false) {
			/** @var filemanager|UmiCms\Classes\Components\Filemanager\Filemanager $filemanagerModule */
			$filemanagerModule = cmsController::getInstance()->getModule('filemanager');
			$filemanagerModule->elfinder_connector($needInfo);
		}

		/** @deprecated  */
		public function get_filemanager_info() {
			/** @var filemanager|UmiCms\Classes\Components\Filemanager\Filemanager $filemanagerModule */
			$filemanagerModule = cmsController::getInstance()->getModule('filemanager');
			$filemanagerModule->get_filemanager_info();      
		}

		/** @deprecated  */
		public function createElFinderFileHash($file) {
			/** @var filemanager|UmiCms\Classes\Components\Filemanager\Filemanager $filemanagerModule */
			$filemanagerModule = cmsController::getInstance()->getModule('filemanager');
			$filemanagerModule->createElFinderFileHash($file);
		}

		/** @deprecated  */
		public function getfilelist() {
			/** @var filemanager|UmiCms\Classes\Components\Filemanager\Filemanager $filemanagerModule */
			$filemanagerModule = cmsController::getInstance()->getModule('filemanager');
			return $filemanagerModule->getfilelist();
		}

		/** @deprecated  */
		public function uploadfile() {
			/** @var filemanager|UmiCms\Classes\Components\Filemanager\Filemanager $filemanagerModule */
			$filemanagerModule = cmsController::getInstance()->getModule('filemanager');
			return $filemanagerModule->getfilelist();
		}

		/** @deprecated  */
		public function setupCwd() {
			/** @var filemanager|UmiCms\Classes\Components\Filemanager\Filemanager $filemanagerModule */
			$filemanagerModule = cmsController::getInstance()->getModule('filemanager');
			return $filemanagerModule->setupCwd();
		}

		/** @deprecated  */
		public function getCwd() {
			/** @var filemanager|UmiCms\Classes\Components\Filemanager\Filemanager $filemanagerModule */
			$filemanagerModule = cmsController::getInstance()->getModule('filemanager');
			return $filemanagerModule->getCwd();
		}

		/** @deprecated  */
		public function getfolderlist() {}

		/** @deprecated  */
		public function createfolder() {}

		/** @deprecated  */
		public function deletefolder() {}

		/** @deprecated  */
		public function deletefiles() {}

		/** @deprecated  */
		public function rename() {}

		/** @deprecated */
		public function getimagepreview() {}
	}
