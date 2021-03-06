<?php

	/** Класс получения отчета о точках выхода за период */
	class exitPoints extends simpleStat {

		/** @inheritDoc */
		public function get() {
			$connection = ConnectionPool::getInstance()->getConnection();
			$connection->query('SET @all = (SELECT COUNT(*) FROM `cms_stat_paths`
						  WHERE `date` BETWEEN ' . $this->getQueryInterval() . ' ' . $this->getHostSQL() . ')');

			$connection->query('DROP TEMPORARY TABLE IF EXISTS `tmp_paths_out`');
			$connection->query('CREATE TEMPORARY TABLE `tmp_paths_out` (`level`INT, `path_id` INT, KEY `path_id_level` (`path_id`, `level`)) ENGINE = MEMORY');

			$connection->query('INSERT INTO `tmp_paths_out` (SELECT MAX(`number_in_path`) AS `level`, `path_id` FROM `cms_stat_hits` `h`
							 INNER JOIN `cms_stat_paths` `p` ON `p`.`id` = `h`.`path_id`
							  WHERE `h`.`date` BETWEEN ' . $this->getQueryInterval() . ' ' . $this->getHostSQL('p') .
				$this->getUserFilterWhere('p') . '
							   GROUP BY `path_id`)');

			$resSumm = $this->simpleQuery("SELECT COUNT(*) AS 'cnt' FROM `cms_stat_hits` `h`
										 INNER JOIN `tmp_paths_out` `t` ON `h`.`path_id` = `t`.`path_id` AND `h`.`number_in_path` = `t`.`level`
										  INNER JOIN `cms_stat_pages` `p` ON `p`.`id` = `h`.`page_id`
										   WHERE `h`.`date` BETWEEN " . $this->getQueryInterval() . ' ' . $this->getHostSQL('p'));
			$i_summ = isset($resSumm[0]) ? (int) $resSumm[0]['cnt'] : 0;

			$res = $this->simpleQuery('SELECT SQL_CALC_FOUND_ROWS COUNT(*) AS `abs`, COUNT(*) / @all * 100 AS `rel`, `p`.`uri` FROM `cms_stat_hits` `h`
										 INNER JOIN `tmp_paths_out` `t` ON `h`.`path_id` = `t`.`path_id` AND `h`.`number_in_path` = `t`.`level`
										  INNER JOIN `cms_stat_pages` `p` ON `p`.`id` = `h`.`page_id`
										   WHERE `h`.`date` BETWEEN ' . $this->getQueryInterval() . ' ' . $this->getHostSQL('p') . '
											GROUP BY `h`.`page_id`
											 ORDER BY `rel` DESC
											  LIMIT ' . $this->offset . ', ' . $this->limit, true);

			return [
				'all' => $res['result'],
				'summ' => $i_summ,
				'total' => $res['FOUND_ROWS']
			];
		}
	}

