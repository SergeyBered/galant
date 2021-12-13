<?php

	use UmiCms\Service;

	/** Драйвер файлового менеджера для редактора шаблонов */
	class elFinderVolumeTemplateEditorDriver extends elFinderVolumeLocalFileSystem {

		/** @inheritDoc */
		protected $driverId = 'templateEditor';

		/** Отключает обработку архивов */
		protected function _checkArchivers() {
			return $this->options['archivers'] = $this->options['archive'] = [];
		}

		/** @inheritDoc */
		protected function _fopen($path, $mode = 'rb') {
			if (!$this->isTemplatePart($path)) {
				return false;
			}

			return parent::_fopen($path, $mode);
		}

		/** @inheritDoc */
		protected function _mkfile($path, $name) {
			$target = $this->_joinPath($path, $name);

			if (!$this->isTemplatePart($target)) {
				return false;
			}

			return parent::_mkfile($path, $name);
		}

		/** @inheritDoc */
		protected function _symlink($source, $targetDir, $name) {
			$target = $this->_joinPath($targetDir, $name);

			if (!$this->isTemplatePart($target)) {
				return false;
			}

			return parent::_symlink($source, $targetDir, $name);
		}

		/** @inheritDoc */
		protected function _copy($source, $targetDir, $name) {
			$target = $this->_joinPath($targetDir, $name);

			if (!$this->isTemplatePart($target)) {
				return false;
			}

			return parent::_copy($source, $targetDir, $name);
		}

		/** @inheritDoc */
		protected function _move($source, $targetDir, $name) {
			$target = $this->_joinPath($targetDir, $name);

			if (!$this->isTemplatePart($target)) {
				return false;
			}

			return parent::_move($source, $targetDir, $name);
		}

		/** @inheritDoc */
		protected function _unlink($path) {
			$userId = Service::Auth()->getUserId();

			if (!permissionsCollection::getInstance()->isAllowedMethod($userId, 'umiTemplates', 'delete')) {
				return $this->setError(elFinder::ERROR_PERM_DENIED);
			}

			return is_file($path) && unlink($path);
		}

		/** @inheritDoc */
		protected function _save($fp, $dir, $name, $stat) {
			$path = parent::_save($fp, $dir, $name, $stat);

			if ($path === false || !is_file($path)) {
				return $this->setError(elFinder::ERROR_UPLOAD);
			}

			if (!$this->isValidFileSize($path) || !$this->isTemplatePart($path)) {
				parent::_unlink($path);
				return false;
			}

			return $path;
		}

		/** @inheritDoc */
		protected function _chmod($path, $mode) {
			if (!$this->isTemplatePart($path)) {
				return false;
			}

			return parent::_chmod($path, $mode);
		}

		/**
		 * Определяет валидность размера загруженного файла
		 * @param string $path путь до файла
		 * @return bool
		 */
		protected function isValidFileSize($path) {
			/** @var data $data */
			$data = cmsController::getInstance()
				->getModule('data');

			if (umiImageFile::getIsImage($path)) {
				$limit = $data->getAllowedMaxFileSize('img');
				return $this->checkSizeLimit($limit, $path, getLabel('error-max_img_filesize'));
			}

			$limit = $data->getAllowedMaxFileSize();
			return $this->checkSizeLimit($limit, $path, getLabel('error-max_filesize'));
		}

		/**
		 * Проверяет превышено ли ограничение на размер файла
		 * @param int $limit ограничение на размер файла в мегабайтах
		 * @param string $path путь до файла
		 * @param string $message текст сообщения об ошибке в случае превышения лимита
		 * @return bool
		 */
		protected function checkSizeLimit($limit, $path, $message) {
			if ($limit > 0 && ($limit * 1024 * 1024) <= (int) filesize($path)) {
				return $this->setError(sprintf('%s %dM', $message, $limit));
			}

			return true;
		}

		/**
		 * Определяет является ли файл частью шаблона
		 * @param string $path путь до файла
		 * @return bool
		 */
		protected function isTemplatePart($path) {
			if (umiImageFile::getIsImage($path)) {
				return true;
			}

			$extension = umiFile::getFileExtension($path);

			if (in_array($extension, umiFile::getSupportedFileTypes())) {
				return true;
			}

			if (in_array($extension, $this->getTemplateFileExtensionList())) {
				return true;
			}

			return $this->setError(elFinder::ERROR_UPLOAD_FILE_MIME);
		}

		/**
		 * Возвращает список форматов шаблона сайта
		 * @return string[]
		 */
		protected function getTemplateFileExtensionList() {
			return [
				'xml',
				'json',
				'html',
				'ini',
				'sql',
				'md',
				'less',
				'scss',
				'styl',
				'pcss',
				'css',
				'xsl',
				'dtd',
				'tpl',
				'js',
				'php',
				'phtml',
				'eot',
				'svg',
				'ttf',
				'woff',
				'woff2',
				'otf',
				'map'
			];
		}
	}