<?php

	/** Класс получения отчета о связях точек входа и рефереров */
	class entryByReferer extends simpleStat {

		/** @inheritDoc */
		protected $params = [
			'source_id' => 0
		];

		/** @inheritDoc */
		public function get() {
			$connection = ConnectionPool::getInstance()->getConnection();
			$sQuery = 'SELECT COUNT(*) AS `count` , `page`.`uri`, `page`.`section`
					   FROM `cms_stat_pages` AS `page`, `cms_stat_hits` AS `hit`,
							`cms_stat_paths` AS `path`, `cms_stat_sources` AS `source`
					   WHERE `source`.`concrete_src_id`=' . $this->params['source_id'] . '
						 AND `source`.`src_type` = 1
						 AND `path`.`source_id` = `source`.`id`
						 AND `hit`.`path_id`=`path`.`id`
						 AND `hit`.`number_in_path`=1
						 AND `page`.`id`=`hit`.`page_id`
						 AND `hit`.`date` BETWEEN ' . $this->getQueryInterval() . '
						 ' . $this->getHostSQL('page') . $this->getUserFilterWhere('path') . '
					   GROUP BY `page`.`id`';
			$queryResult = $connection->queryResult($sQuery);
			$queryResult->setFetchType(IQueryResult::FETCH_ARRAY);

			$result = [];

			foreach ($result as $row) {
				$result[] = $row;
			}

			return $result;
		}
	}

