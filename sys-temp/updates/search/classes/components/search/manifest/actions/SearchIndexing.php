<?php

	namespace UmiCms\Manifest\Search;

	/** Команда индексации всех страниц для формирования поискового индекса */
	class SearchIndexingAction extends \IterableAction {

		/** @var \iSearchModel $searchModel модель поиска */
		private $searchModel;

		/** @var \umiHierarchy $umiHierarchy модель иерархии */
		private $umiHierarchy;

		/**
		 * Конструктор
		 * @param string $name
		 * @param array $params
		 */
		public function __construct($name, array $params = []) {
			parent::__construct($name, $params);
			$this->searchModel = \searchModel::getInstance();
			$this->umiHierarchy = \umiHierarchy::getInstance();
		}

		/** @inheritDoc */
		public function execute() {
			$limit = (int) $this->getParam('limit');
			$offset = (int) $this->getOffset();

			$elementList = $this->getUmiHierarchy()
				->getList($limit, $offset);

			$this->getSearchModel()
				->processPageList($elementList);

			$this->setOffset($limit + $offset);

			if (empty($elementList)) {
				$this->setIsReady();
				$this->resetState();
			}

			$this->saveState();

			return $this;
		}

		/** @inheritDoc */
		public function rollback() {
			$this->getSearchModel()
				->truncate_index();
			return $this;
		}

		/** @inheritDoc */
		protected function getStartState() {
			return [
				'offset' => 0
			];
		}

		/**
		 * Возвращает смещение
		 * @return int
		 */
		private function getOffset() {
			$offset = $this->getStatePart('offset');
			return is_numeric($offset) ? $offset : 0;
		}

		/**
		 * Устанавливает смещение
		 * @param int $offset смещение
		 * @return $this
		 */
		private function setOffset($offset) {
			return $this->setStatePart('offset', $offset);
		}

		/**
		 * Возвращает модель поиска
		 * @return \searchModel
		 */
		private function getSearchModel() {
			return $this->searchModel;
		}

		/**
		 * Возвращает модель иерархии
		 * @return \umiHierarchy
		 */
		private function getUmiHierarchy() {
			return $this->umiHierarchy;
		}
	}
