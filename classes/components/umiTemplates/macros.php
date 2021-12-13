<?php

	/** Класс макросов, то есть методов, доступных в шаблоне */
	class UmiTemplatesMacros implements iModulePart {

		use tModulePart;

		/**
		 * Возвращает относительный путь до директории шаблона
		 * @param int|null $id идентификатор шаблона
		 * @return string
		 * @throws ExpectTemplateException
		 */
		public function getResourceDirectory($id = null) {

			if ($id) {
				$template = templatesCollection::getInstance()
					->getTemplate($id);
			} else {
				$template = cmsController::getInstance()
					->getCurrentTemplate();
			}

			if (!$template instanceof iTemplate) {
				throw new ExpectTemplateException(getLabel('label-error-incorrect-template-id', 'umiTemplates'));
			}

			return $template->getResourcesDirectory(true);
		}
	}