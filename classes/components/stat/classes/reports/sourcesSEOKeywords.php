<?php

	/** Класс получения отчета о ключевых словах поиска */
	class sourcesSEOKeywords extends simpleStat {

		/** @inheritDoc */
		public function get() {
			$resSumm = $this->simpleQuery('SELECT COUNT(*) AS `cnt` FROM `cms_stat_sources` `s`
										INNER JOIN `cms_stat_sources_search` `ss` ON `s`.`concrete_src_id` = `ss`.`id`
										INNER JOIN `cms_stat_sources_search_queries` `ssq` ON `ssq`.`id` = `ss`.`text_id`
										INNER JOIN `cms_stat_paths` `p` ON `p`.`source_id` = `s`.`id`
											WHERE `s`.`src_type` = 2 AND `p`.`date` BETWEEN ' . $this->getQueryInterval() . ' ' .
				$this->getHostSQL('p') . $this->getUserFilterWhere('p') . '
											ORDER BY `cnt` DESC
											LIMIT ' . $this->offset . ', ' . $this->limit);
			$i_summ = (int) $resSumm[0]['cnt'];

			$all = $this->simpleQuery('SELECT SQL_CALC_FOUND_ROWS COUNT(*) AS `cnt`, `ssq`.`text`, `ssq`.id as `query_id` FROM `cms_stat_sources` `s`
										INNER JOIN `cms_stat_sources_search` `ss` ON `s`.`concrete_src_id` = `ss`.`id`
										INNER JOIN `cms_stat_sources_search_queries` `ssq` ON `ssq`.`id` = `ss`.`text_id`
										INNER JOIN `cms_stat_paths` `p` ON `p`.`source_id` = `s`.`id`
											WHERE `s`.`src_type` = 2 AND `p`.`date` BETWEEN ' . $this->getQueryInterval() . ' ' .
				$this->getHostSQL('p') . $this->getUserFilterWhere('p') . '
											GROUP BY `ssq`.`id`
											ORDER BY `cnt` DESC
											LIMIT ' . $this->offset . ', ' . $this->limit);
			$res = $this->simpleQuery('SELECT FOUND_ROWS() as `total`');
			$i_total = (int) $res[0]['total'];

			return [
				'all' => $all,
				'summ' => $i_summ,
				'total' => $i_total
			];
		}
	}

