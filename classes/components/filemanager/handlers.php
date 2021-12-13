<?php

	use UmiCms\Service;

	/** Класс обработчиков событий */
	class FilemanagerHandlers {

		/** @var filemanager|FilemanagerHandlers $module */
		public $module;

		/**
		 * Изменяет название миниатюры для предпросмотра водяного знака
		 * @param iUmiEventPoint $event событие создания миниатюры
		 * @retun void
		 * @throws coreException
		 */
		public function renamePreviewThumb(iUmiEventPoint $event) : void {
			if (cmsController::getInstance()->getCurrentMethod() != 'watermark') {
				return;
			}

			$originalImageInfo = $event->getParam('result');
			$originalPath = CURRENT_WORKING_DIR . $originalImageInfo['src'];
			$originalImage = Service::FileFactory()
				->create($originalPath);

			$watermarkThumbsPath = mainConfiguration::getInstance()->includeParam('user-images-path') . '/cms/thumbs/watermark_preview/';
			$newThumbName = $originalImage->getBaseFileName() . '_' . time();
			$newThumbPath = $watermarkThumbsPath . $newThumbName . '.' . $originalImage->getExt();

			$watermarkThumbsDir = Service::DirectoryFactory()
				->create($watermarkThumbsPath);
			$watermarkThumbsDir->deleteContent();
			$originalImage->copy($newThumbPath);

			$result['src'] = str_replace(CURRENT_WORKING_DIR, '', $newThumbPath);
			$event->setParam('result', $result);
		}
	}
