<?php

	use UmiCms\Service;

	/** Класс расширения php шаблонизатора для работы с данными для поисковых роботов */
	class SeoPhpExtension extends ViewPhpExtension implements IPhpExtension {

		/** @var string DEFAULT_FAVICON_PATH путь до фавикона по умолчанию */
		const DEFAULT_FAVICON_PATH = '/favicon.ico';

		/**
		 * Возвращает каноническую ссылку для страницы
		 * @param array $variables глобальные переменные текущей страницы
		 * @return string
		 * @throws ErrorException
		 */
		public function getCanonicalLinkTag(array $variables) {
			if (!cmsController::getInstance()->isModule('seo')) {
				return '';
			}

			$pageId = $this->getParamValue($variables, '@pageId');

			if ($pageId === null) {
				return '';
			}

			$result = $this->umiTemplaterPHP->macros('seo', 'getRelCanonical', ['default', $pageId]);
			$link = $this->getParamValue($result, '@link');

			return $link ? '<link rel="canonical" href="' . $link . '" />' : '';
		}

		/**
		 * Возвращает метатег robots
		 * @param array $variables глобальные переменные текущей страницы
		 * @return string
		 */
		public function getMetaRobots(array $variables) {
			if (!isset($variables['pageId'])) {
				return '';
			}

			$page = $this->getPageById($variables['pageId']);

			if (!$page instanceof iUmiHierarchyElement || !$page->getValue('robots_deny')) {
				return '';
			}

			return '<meta name="robots" content="noindex, nofollow" />';
		}

		/**
		 * Возвращает значение метатега "description"
		 * @param array $variables
		 * @return string
		 */
		public function getMetaDescription(array $variables) {
			return $this->getMetaWithPostfix($variables['meta']['description']);
		}

		/**
		 * Возвращает значение метатега "title"
		 * @param array $variables
		 * @return string
		 */
		public function getMetaTitle(array $variables) {
			return $this->getMetaWithPostfix($variables['title']);
		}

		/**
		 * Возвращает значение метатега "keywords"
		 * @param array $variables
		 * @return string
		 */
		public function getMetaKeywords(array $variables) {
			return $this->getMetaWithPostfix($variables['meta']['keywords']);
		}

		/**
		 * Возвращает значение метатега с постфиксом
		 * @param string $meta значение метатега
		 * @return string
		 */
		public function getMetaWithPostfix($meta) {
			return $meta ? sprintf('%s %s', $meta, $this->getPageNumberPostfix()) : '';
		}

		/**
		 * Возвращает постфикс постраничной навигации
		 * @return string
		 */
		public function getPageNumberPostfix() {
			$pageNumber = Service::Request()->pageNumber();
			try {
				$pageTitle = $this->translate('label-page');
			} catch (coreException $exception) {
				$pageTitle = '';
			}

			return ($pageNumber !== 0) ? sprintf('- %s %d', $pageTitle,$pageNumber + 1) : '';
		}

		/**
		 * Возвращает путь до фавикона
		 * @return string
		 * @throws Exception
		 * @throws coreException
		 */
		public function getFaviconPath() {
			try {
				$favicon = Service::DomainDetector()->detect()->getFavicon();
			} catch (coreException $exception) {
				umiExceptionHandler::report($exception);
				$favicon = null;
			}

			return ($favicon instanceof iUmiImageFile) ? $favicon->getFilePath(true) : self::DEFAULT_FAVICON_PATH;
		}
	}