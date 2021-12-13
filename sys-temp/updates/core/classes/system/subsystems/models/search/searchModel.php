<?php

	use UmiCms\Service;

	/**
	 * Класс для работы с поисковой базой по сайту
	 * @todo refactoring
	 */
	class searchModel extends singleton implements iSingleton, iSearchModel {

		/** @const int MIN_WORD_LENGTH минимальная допустимая длинна слова для поиска */
		const MIN_WORD_LENGTH = 2;

		/** @inheritDoc */
		protected function __construct() {}

		/**
		 * @inheritDoc
		 * @return iSearchModel
		 */
		public static function getInstance($c = null) {
			return parent::getInstance(__CLASS__);
		}

		/** @inheritDoc */
		public function index_all($limit = false, $lastId = 0) {
			$total = 0;
			$lastId = (int) $lastId;
			$connection = ConnectionPool::getInstance()->getConnection();
			$sql = <<<SQL
SELECT id, updatetime FROM cms3_hierarchy
WHERE is_deleted = '0' AND is_active = '1' AND id > '{$lastId}' ORDER BY id
SQL;

			if (is_numeric($limit)) {
				$sql .= ' LIMIT ' . (int) $limit;
			}

			$result = $connection->queryResult($sql);
			$result->setFetchType(IQueryResult::FETCH_ROW);

			foreach ($result as $row) {
				list($elementId, $updatetime) = $row;
				++$total;

				$lastId = $elementId;

				if (!$this->elementIsReindexed($elementId, $updatetime)) {
					$this->index_item($elementId, true);
				}
			}

			$sql = 'SELECT COUNT(`rel_id`) FROM `cms3_search`';
			$count = $connection->queryResult($sql);
			$count->setFetchType(IQueryResult::FETCH_ROW);
			$current = false;

			if ($result->length() > 0) {
				$fetchResult = $count->fetch();
				$current = array_shift($fetchResult);
			}

			return [
				'current' => $current,
				'lastId' => $lastId
			];
		}

		/** @inheritDoc */
		public function index_item($elementId, $isManual = false) {
			if (defined('DISABLE_SEARCH_REINDEX') && !$isManual) {
				return false;
			}

			$connection = ConnectionPool::getInstance()->getConnection();
			$connection->startTransaction("Indexing element #{$elementId}");

			try {
				$indexData = $this->parseItem($elementId);
			} catch (Exception $e) {
				$connection->rollbackTransaction();
				throw $e;
			}

			$connection->commitTransaction();

			return $indexData;
		}

		/** @inheritDoc */
		public function processPage(iUmiHierarchyElement $element) {
			if ($this->isAllowed($element)) {
				$this->index_item($element->getId());
			} else {
				$this->unindex_items($element->getId());
			}

			return $this;
		}

		/** @inheritDoc */
		public function processPageList(array $elementList) {
			array_map([$this, 'processPage'], $elementList);
			return $this;
		}

		/** @inheritDoc */
		public function parseItem($elementId) {
			$elementId = (int) $elementId;
			$element = umiHierarchy::getInstance()->getElement($elementId, true, true);

			if (!$element instanceof iUmiHierarchyElement || !$this->isAllowed($element)) {
				return false;
			}

			$indexFields = [];
			$typeId = $element->getObjectTypeId();
			$type = umiObjectTypesCollection::getInstance()->getType($typeId);

			$fieldGroups = $type->getFieldsGroupsList();

			foreach ($fieldGroups as $fieldGroupId => $fieldGroup) {
				foreach ($fieldGroup->getFields() as $fieldId => $field) {
					$dataType = $field->getFieldType()->getDataType();

					if (!$field->getIsInSearch() || $dataType == 'optioned') {
						continue;
					}

					$fieldName = $field->getName();
					$val = $element->getValue($fieldName);

					if ($dataType) {
						if (is_array($val)) {
							if ($dataType == 'relation') {
								foreach ($val as $i => $v) {
									$item = selector::get('object')->id($v);

									if ($item) {
										$val[$i] = $item->getName();
										unset($item);
									}
								}
							}
							$val = implode(' ', $val);
						} else {
							if (is_object($val)) {
								continue;
							}

							if ($dataType == 'relation') {
								$item = selector::get('object')->id($val);

								if ($item) {
									$val = $item->getName();
								}
							}
						}
					}

					if ($val === null || !$val) {
						continue;
					}

					$indexFields[$fieldName] = $val;
				}
			}

			if (Service::Configuration()->get('kernel', 'search-index-names')) {
				$indexFields['name'] = $element->getName();
			}

			foreach ($indexFields as $name => $value) {
				// kill macros
				$value = preg_replace('/%([A-z_]*)%/m', '', $value);
				$value = preg_replace("/%([A-zЂ-пРђ-СЏ \/\._\-\(\)0-9%:<>,!@\|'&=;\?\+#]*)%/m", '', $value);
				$indexFields[$name] = $value;
			}

			$indexImage = $this->buildIndexImage($indexFields);
			$this->updateSearchIndex($elementId, $indexImage);
		}

		/** @inheritDoc */
		public function buildIndexImage($indexFields) {
			$img = [];

			$weights = [
				'h1' => 5,
				'title' => 5,
				'name' => 5,
				'meta_keywords' => 3,
				'meta_descriptions' => 3,
				'tags' => 3
			];

			foreach ($indexFields as $fieldName => $str) {
				$arr = $this->splitString($str);

				if (isset($weights[$fieldName])) {
					$weight = (int) $weights[$fieldName];
				} else {
					$weight = 1;
				}

				foreach ($arr as $word) {
					if (array_key_exists($word, $img)) {
						$img[$word] += $weight;
					} else {
						$img[$word] = $weight;
					}
				}
			}
			return $img;
		}

		/** @inheritDoc */
		public static function splitString($str) {
			if (!is_string($str)) {
				return [];
			}

			$to_space = [
				'&nbsp;',
				'&quote;',
				'. ',
				', ',
				' .',
				' ,',
				'?',
				':',
				';',
				'%',
				')',
				'(',
				'/',
				'<',
				'>',
				'- ',
				' -',
				'«',
				'»'
			];

			$str = str_replace('>', '> ', $str);
			$str = str_replace('"', ' ', $str);
			$str = strip_tags($str);
			$str = str_replace($to_space, ' ', $str);
			$str = preg_replace("/([ \t\r\n]{1-100})/u", ' ', $str);
			$str = mb_strtolower($str);
			$tmp = explode(' ', $str);

			$res = [];

			foreach ($tmp as $v) {
				$res[] = trim($v, "\r\n\t? ;.,!@#$%^&*()_+-=\\/:<>{}[]'\"`~|");
			}

			return $res;
		}

		/** @inheritDoc */
		public function updateSearchIndex($elementId, $indexImage) {
			$element = umiHierarchy::getInstance()->getElement($elementId, true);

			if (!$element instanceof iUmiHierarchyElement) {
				return false;
			}

			$domain_id = $element->getDomainId();
			$lang_id = $element->getLangId();
			$typeId = $element->getTypeId();

			$connection = ConnectionPool::getInstance()->getConnection();
			$sql = "SELECT `rel_id` FROM `cms3_search` WHERE `rel_id` = '{$elementId}' LIMIT 0,1";
			$queryResult = $connection->queryResult($sql);
			$queryResult->setFetchType(IQueryResult::FETCH_ROW);

			if ($queryResult->length() == 0) {
				$sql = <<<SQL
INSERT INTO cms3_search (rel_id, domain_id, lang_id, type_id) 
VALUES('{$elementId}', '{$domain_id}', '{$lang_id}', '{$typeId}')
SQL;
				$connection->query($sql);
			}

			$sql = "DELETE FROM cms3_search_index WHERE rel_id = '{$elementId}'";
			$connection->query($sql);

			$sql = 'INSERT INTO cms3_search_index (rel_id, weight, word_id, tf) VALUES ';
			$n = 0;

			$total_weight = array_sum($indexImage);
			foreach ($indexImage as $word => $weight) {
				$wordId = $this->getSearchWordId($word);
				if (!$wordId) {
					continue;
				}
				$TF = $weight / $total_weight;
				$sql .= "('{$elementId}', '{$weight}', '{$wordId}', '{$TF}'), ";
				++$n;
			}

			if ($n) {
				$sql = mb_substr($sql, 0, mb_strlen($sql) - 2);
				$connection->query($sql);
			}

			$time = time();

			$sql = "UPDATE cms3_search SET indextime = '{$time}' WHERE rel_id = '{$elementId}'";
			$connection->query($sql);

			umiHierarchy::getInstance()->unloadElement($elementId);

			return true;
		}

		/** @deprecated */
		public static function getWordId($word) {
			return self::getInstance()->getSearchWordId($word);
		}

		/** @inheritDoc */
		public function getSearchWordId($word) {
			$word = trim($word, "\r\n\t? ;.,!@#$%^&*()_+-=\\/:<>{}[]'\"`~|");
			$word = mb_strtolower($word);

			if (mb_strlen($word) < $this->getMinWordLength()) {
				return false;
			}

			$connection = ConnectionPool::getInstance()->getConnection();
			$word = $connection->escape($word);
			$sql = "SELECT id FROM cms3_search_index_words WHERE word = '{$word}'";
			$result = $connection->queryResult($sql);
			$result->setFetchType(IQueryResult::FETCH_ROW);

			if ($result->length() > 0) {
				$fetchResult = $result->fetch();
				return array_shift($fetchResult);
			}

			$sql = "INSERT INTO cms3_search_index_words (word) VALUES('{$word}')";
			$connection->query($sql);

			return (int) $connection->insertId();
		}

		/** @inheritDoc */
		public function getIndexPages() {
			$connection = ConnectionPool::getInstance()->getConnection();
			$sql = 'SELECT SQL_SMALL_RESULT COUNT(*) FROM cms3_search';
			$result = $connection->queryResult($sql);
			$result->setFetchType(IQueryResult::FETCH_ROW);
			$count = 0;

			if ($result->length() > 0) {
				$fetchResult = $result->fetch();
				$count = (int) array_shift($fetchResult);
			}

			return $count;
		}

		/** @inheritDoc */
		public function getAllIndexablePages() {
			$connection = ConnectionPool::getInstance()->getConnection();
			$query = new selector('pages');
			$disableIndexingFieldId = (int) $query->searchField('is_unindexed', true);

			$sql = <<<SQL
SELECT COUNT(DISTINCT h.obj_id)
FROM cms3_hierarchy h, cms3_objects o
LEFT JOIN cms3_object_content c ON c.obj_id=o.id AND c.field_id = $disableIndexingFieldId
WHERE 
c.int_val IS NULL AND 
h.is_deleted = '' AND 
h.is_active = '1' AND 
h.obj_id = o.id
SQL;
			$result = $connection->queryResult($sql);
			$result->setFetchType(IQueryResult::FETCH_ROW);
			$count = 0;

			if ($result->length() > 0) {
				$fetchResult = $result->fetch();
				$count = (int) array_shift($fetchResult);
			}

			return $count;
		}

		/** @inheritDoc */
		public function getIndexWords() {
			$connection = ConnectionPool::getInstance()->getConnection();
			$sql = 'SELECT SQL_SMALL_RESULT SUM(weight) FROM cms3_search_index';
			$result = $connection->queryResult($sql);
			$result->setFetchType(IQueryResult::FETCH_ROW);
			$count = 0;

			if ($result->length() > 0) {
				$fetchResult = $result->fetch();
				$count = (int) array_shift($fetchResult);
			}

			return $count;
		}

		/** @inheritDoc */
		public function getIndexWordsUniq() {
			$connection = ConnectionPool::getInstance()->getConnection();
			$sql = 'SELECT SQL_SMALL_RESULT COUNT(*) FROM cms3_search_index_words';
			$result = $connection->queryResult($sql);
			$result->setFetchType(IQueryResult::FETCH_ROW);
			$count = 0;

			if ($result->length() > 0) {
				$fetchResult = $result->fetch();
				$count = (int) array_shift($fetchResult);
			}

			return $count;
		}

		/** @inheritDoc */
		public function getIndexLast() {
			$connection = ConnectionPool::getInstance()->getConnection();
			$sql = 'SELECT SQL_SMALL_RESULT indextime FROM cms3_search ORDER BY indextime DESC LIMIT 1';
			$result = $connection->queryResult($sql);
			$result->setFetchType(IQueryResult::FETCH_ROW);
			$count = 0;

			if ($result->length() > 0) {
				$fetchResult = $result->fetch();
				$count = (int) array_shift($fetchResult);
			}

			return $count;
		}

		/** @inheritDoc */
		public function truncate_index() {
			$connection = ConnectionPool::getInstance()->getConnection();

			$sql = 'TRUNCATE TABLE cms3_search_index_words';
			$connection->query($sql);

			$sql = 'TRUNCATE TABLE cms3_search_index';
			$connection->query($sql);

			$sql = 'TRUNCATE TABLE cms3_search';
			$connection->query($sql);

			return true;
		}

		/** @inheritDoc */
		public function runSearch($searchString, $searchTypes = null, $hierarchyRels = null, $orMode = false) {
			$words = $this->splitString($searchString);
			$words = array_unique($words);
			return $this->buildQueries($words, $searchTypes, $hierarchyRels, $orMode);
		}

		/** @inheritDoc */
		public function buildQueries($words, $searchTypes = null, $hierarchyRels = null, $orMode = false) {
			$langId = Service::LanguageDetector()->detectId();
			$domainId = Service::DomainDetector()->detectId();
			$connection = ConnectionPool::getInstance()->getConnection();

			$umiConfig = mainConfiguration::getInstance();
			$morph_disabled = $umiConfig->get('system', 'search-morph-disabled');
			$searchInAnyPart = (bool) $umiConfig->get('kernel', 'search-in-any-part-of-string');
			$likeConditionPrefix = $searchInAnyPart ? '%' : '';

			$wordsConds = [];
			$wordsChoose = [];
			$minWordLength = $this->getMinWordLength();

			foreach ($words as $i => $word) {
				if (mb_strlen($word) < $minWordLength) {
					unset($words[$i]);
					continue;
				}

				$word = $connection->escape($word);
				$word = str_replace(['%', '_'], ["\\%", "\\_"], $word);

				$word_subcond = "siw.word LIKE '{$likeConditionPrefix}{$word}%' ";

				if (!$morph_disabled) {
					$word_base = language_morph::get_word_base($word);

					if ((mb_strlen($word_base) >= $minWordLength) && ($word_base != $word)) {
						$word_base = $connection->escape($word_base);
						$word_subcond .= " OR siw.word LIKE '{$likeConditionPrefix}{$word_base}%'";
					}
				}

				$wordsConds[] = '(' . $word_subcond . ')';
				$wordsChoose[] = ' WHEN (' . $word_subcond . ") THEN '{$word}'";
			}

			$wordsCond = implode(' OR ', $wordsConds);
			$wordsChooseString = '(CASE' . implode($wordsChoose) . ' END) as search_word';

			if (!$wordsCond) {
				return [];
			}

			$permsSql = '';
			$permsTbl = '';

			$umiPermissions = permissionsCollection::getInstance();

			if (!$umiPermissions->isSv()) {
				$auth = Service::Auth();
				$userId = $auth->getUserId();
				$user = umiObjectsCollection::getInstance()->getObject($userId);
				$groups = $user->getValue('groups');
				$groups[] = $userId;

				$systemUsersPermissions = Service::SystemUsersPermissions();
				$groups[] = $systemUsersPermissions->getGuestUserId();
				$groups = array_extract_values($groups);
				$groups = implode(', ', $groups);
				$permsSql = " AND c3p.level >= 1 AND c3p.owner_id IN({$groups})";
				$permsTbl = 'INNER JOIN cms3_permissions as  `c3p` ON c3p.rel_id = s.rel_id';
			}

			$typesSql = '';

			if (is_array($searchTypes)) {
				if (umiCount($searchTypes)) {
					if ($searchTypes && $searchTypes[0]) {
						$typesSql = ' AND s.type_id IN (' . $connection->escape(implode(', ', $searchTypes)) . ')';
					}
				}
			}

			$hierarchyRelsSql = '';

			if (is_array($hierarchyRels) && umiCount($hierarchyRels)) {
				$hierarchyRelsSql = ' AND h.rel IN (' . $connection->escape(implode(', ', $hierarchyRels)) . ')';
			}

			$connection->query(<<<'SQL'
CREATE TEMPORARY TABLE temp_search (rel_id int unsigned, tf float, word varchar(64), search_word varchar(64))
SQL
			);

			$sql = <<<EOF
				INSERT INTO temp_search SELECT SQL_SMALL_RESULT HIGH_PRIORITY
					s.rel_id,
					si.weight,
					siw.word,
					$wordsChooseString
				FROM cms3_search_index_words as `siw`
					INNER JOIN cms3_search_index as `si` ON si.word_id = siw.id
					INNER JOIN cms3_search as `s` ON s.rel_id = si.rel_id
					INNER JOIN cms3_hierarchy as  `h` ON h.id = s.rel_id
					{$permsTbl}

				WHERE
					({$wordsCond}) AND
					s.domain_id = '{$domainId}' AND
					s.lang_id = '{$langId}' AND
					h.is_deleted = '0' AND
					h.is_active = '1'
					{$typesSql}
					{$hierarchyRelsSql}
					{$permsSql}
				GROUP BY s.rel_id, si.weight, search_word
EOF;
			$res = [];
			$connection->query($sql);

			if ($orMode) {
				$sql = <<<SQL
SELECT rel_id, SUM(tf) AS x
	FROM temp_search
		GROUP BY rel_id
			ORDER BY x DESC, rel_id DESC
SQL;
			} else {
				$wordsCount = umiCount($words);

				$sql = <<<SQL
SELECT rel_id, SUM(tf) AS x, COUNT(word) AS wc
	FROM temp_search
		GROUP BY rel_id
			HAVING wc >= '{$wordsCount}'
				ORDER BY x DESC, rel_id DESC
SQL;
			}

			$result = $connection->queryResult($sql);
			$result->setFetchType(IQueryResult::FETCH_ROW);

			foreach ($result as $row) {
				$res[] = array_shift($row);
			}

			$connection->query('DROP TEMPORARY TABLE IF EXISTS temp_search');
			return $res;
		}

		/** @inheritDoc */
		public function prepareContext($elementId, $uniqueOnly = false) {
			if (!($element = umiHierarchy::getInstance()->getElement($elementId))) {
				return false;
			}

			if ($element->getValue('is_unindexed')) {
				return false;
			}

			$context = [];

			$typeId = $element->getObject()->getTypeId();
			$type = umiObjectTypesCollection::getInstance()->getType($typeId);

			$fieldsBlacklist = (array) mainConfiguration::getInstance()->get(
				'modules', 'search.context-fields-blacklist'
			);

			$fieldGroups = $type->getFieldsGroupsList();
			foreach ($fieldGroups as $fieldGroupId => $fieldGroup) {
				foreach ($fieldGroup->getFields() as $fieldId => $field) {
					if (!$field->getIsInSearch()) {
						continue;
					}

					$fieldName = $field->getName();

					if (in_array($fieldName, $fieldsBlacklist)) {
						continue;
					}

					$val = $element->getValue($fieldName);

					if ($val === null || !$val || is_object($val)) {
						continue;
					}

					$dataType = $field->getFieldType()->getDataType();

					if (in_array($dataType, ['relation', 'domain_id', 'link_to_object_type'])) {
						$val = (array) $val;
					}

					$context[] = is_array($val) ? $this->propertyArrayValueToString($dataType, $val) : $val;
				}
			}

			if (Service::Configuration()->get('kernel', 'search-index-names')) {
				$context[] = $element->getName();
			}

			if ($uniqueOnly) {
				$context = array_unique($context);
			}

			$res = '';
			foreach ($context as $val) {
				if (is_array($val)) {
					continue;
				}
				$res .= $val . ' ';
			}

			$res = preg_replace("/%[A-z0-9_]+ [A-z0-9_]+\([^\)]+\)%/im", '', $res);

			$res = str_replace('%', '&#037', $res);
			return $res;
		}

		/**
		 * Приводит список значений поля к строковому представлению
		 * @param string $dataType тип поля
		 * @param array $valueList список значений
		 * @return string
		 */
		private function propertyArrayValueToString($dataType, array $valueList) {
			$valueToGlue = null;
			switch ($dataType) {
				case 'relation' : {
					$valueList = umiObjectsCollection::getInstance()
						->getObjectList($valueList);
					foreach ($valueList as $index => $object) {
						/** @var iUmiObject $object */
						$valueList[$index] = $object->getName();
					}

					$valueToGlue = $valueList;
					break;
				}
				case 'tags' : {
					$valueToGlue = $valueList;
					break;
				}
				default : {
					$valueToGlue = [];
				}
			}

			return implode(' ', $valueToGlue);
		}

		/** @inheritDoc */
		public function getContext($elementId, $searchString, $entryPattern = self::DEFAULT_ENTRY_PATTERN, $linePattern = self::DEFAULT_LINE_PATTERN) {
			$content = $this->prepareContext($elementId, true);

			$content = preg_replace("/%content redirect\((.*)\)%/im", "::CONTENT_REDIRECT::\\1::", $content);
			$content = preg_replace("/(%|&#037)[A-z0-9]+ [A-z0-9]+\((.*)\)(%|&#037)/im", '', $content);

			$wordsArr = explode(' ', $searchString);

			$content = preg_replace("/([A-zА-я0-9])\.([A-zА-я0-9])/im", "\\1&#46;\\2", $content);

			$context = str_replace('>', '> ', $content);
			$context = str_replace('<br>', ' ', $context);
			$context = str_replace('&nbsp;', ' ', $context);
			$context = str_replace("\n", ' ', $context);
			$context = strip_tags($context);

			if (preg_match_all('/::CONTENT_REDIRECT::(.*)::/i', $context, $temp)) {
				$sz = umiCount($temp[1]);

				for ($i = 0; $i < $sz; $i++) {
					if (is_numeric($temp[1][$i])) {
						$turl = umiHierarchy::getInstance()->getPathById($temp[1][$i]);
					} else {
						$turl = strip_tags($temp[1][$i]);
					}
					$turl = trim($turl, "'");
					$context = str_replace(
						$temp[0][$i],
						"<p>%search_redirect_text% <a href=\"{$turl}\">{$turl}</a></p>",
						$context
					);
				}
			}

			$context .= "\n";

			$lines = [];
			foreach ($wordsArr as $cword) {
				if (mb_strlen($cword) <= 1) {
					continue;
				}

				$tres = $context;
				$sword = language_morph::get_word_base($cword);
				$sword = preg_quote($sword, '/');
				$pattern_sentence = "/([^\.^\?^!^<^>.]*)$sword([^\.^\?^!^<^>.]*)[!\.\?\n]/imu";

				if (preg_match($pattern_sentence, $tres, $tres)) {
					$lines[] = $tres[0];
				}
			}

			$lines = array_unique($lines);

			$resOut = '';
			foreach ($lines as $line) {
				foreach ($wordsArr as $cword) {
					$sword = language_morph::get_word_base($cword);
					$sword = preg_quote($sword, '/');
					$patternWord = "/([^ ^.^!^\?.]*)($sword)([^ ^.^!^\?.]*)/imu";
					$line = preg_replace($patternWord, sprintf($entryPattern, "\\1\\2\\3"), $line);
				}

				if ($line) {
					$resOut .= sprintf($linePattern, $line);
				}
			}

			if (!$resOut) {
				preg_match("/([^\.^!^\?.]*)([\.!\?]*)/im", $context, $resOut);
				$resOut = sprintf($linePattern, $resOut[0]);
			}
			return $resOut;
		}

		/** @inheritDoc */
		public function unindex_items($elementId) {
			$elementId = (int) $elementId;
			$connection = ConnectionPool::getInstance()->getConnection();

			$sql = "DELETE FROM cms3_search WHERE rel_id = '{$elementId}'";
			$connection->query($sql);

			$sql = "DELETE FROM cms3_search_index WHERE rel_id = '{$elementId}'";
			$connection->query($sql);

			return true;
		}

		/** @inheritDoc */
		public function index_items($elementId) {
			$hierarchy = umiHierarchy::getInstance();
			$children = $hierarchy->getChildrenTree($elementId, true, true, 99);
			$elements = [$elementId];
			$this->expandArray($children, $elements);

			foreach ($elements as $elementId) {
				$this->index_item($elementId);
			}
		}

		/** @inheritDoc */
		public function calculateIDF($wordId) {
			static $IDF = false;
			$wordId = (int) $wordId;
			$connection = ConnectionPool::getInstance()->getConnection();

			if ($IDF === false) {
				$sql = 'SELECT COUNT(`rel_id`) FROM `cms3_search`';
				$result = $connection->queryResult($sql);
				$result->setFetchType(IQueryResult::FETCH_ROW);
				$d = 0;

				if ($result->length() > 0) {
					$fetchResult = $result->fetch();
					$d = (int) array_shift($fetchResult);
				}

				$sql = "SELECT COUNT(`rel_id`) FROM `cms3_search_index` WHERE `word_id` = {$wordId}";
				$result = $connection->queryResult($sql);
				$result->setFetchType(IQueryResult::FETCH_ROW);
				$dd = 1;

				if ($result->length() > 0) {
					$fetchResult = $result->fetch();
					$dd = (int) array_shift($fetchResult);
				}

				$IDF = log($d / $dd);
			}

			return $IDF;
		}

		public function suggestions($string, $limit = 10) {
			$string = trim($string);
			if (!$string) {
				return false;
			}
			$string = mb_strtolower($string);

			$rus = str_split('йцукенгшщзхъфывапролджэячсмитьбю');
			$eng = str_split('qwertyuiop[]asdfghjkl;\'zxcvbnm,.');

			$stringCp1251 = iconv('UTF-8', 'CP1251', $string);
			$mirrowedRus = iconv('CP1251', 'UTF-8', str_replace($rus, $eng, $stringCp1251));
			$mirrowedEng = iconv('CP1251', 'UTF-8', str_replace($eng, $rus, $stringCp1251));

			$mirrowed = ($mirrowedRus != $string) ? $mirrowedRus : $mirrowedEng;

			$connection = ConnectionPool::getInstance()->getConnection('search');
			$string = $connection->escape($string);
			$mirrowed = $connection->escape($mirrowed);
			$limit = (int) $limit;

			$sql = <<<SQL
SELECT `siw`.`word` as `word`, COUNT(`si`.`word_id`) AS `cnt`
	FROM
		`cms3_search_index_words` `siw`,
		`cms3_search_index` `si`
	WHERE
		(
			`siw`.`word` LIKE '{$string}%' OR
			`siw`.`word` LIKE '{$mirrowed}%'
		) AND
		`si`.`word_id` = `siw`.`id`
	GROUP BY
		`siw`.`id`
	ORDER BY SUM(`si`.`tf`) DESC
	LIMIT {$limit}
SQL;
			return $connection->queryResult($sql);
		}

		/** @inheritDoc */
		public function getIndexWordList() {
			$sql = 'SELECT `word` FROM `cms3_search_index_words`';
			$result = ConnectionPool::getInstance()
				->getConnection()
				->queryResult($sql);
			$result->setFetchType(IQueryResult::FETCH_ASSOC);
			$wordList = [];

			foreach ($result as $row) {
				$wordList[] = $row['word'];
			}

			return $wordList;
		}

		/** @inheritDoc */
		public function getIndexList() {
			$sql = 'SELECT `rel_id`, `weight`, `word_id`, `tf` FROM `cms3_search_index`';
			$result = ConnectionPool::getInstance()
				->getConnection()
				->queryResult($sql);
			$result->setFetchType(IQueryResult::FETCH_ASSOC);
			$indexList = [];

			foreach ($result as $row) {
				$indexList[] = [
					'rel_id' => $row['rel_id'],
					'weight' => $row['weight'],
					'word_id' => $row['word_id'],
					'tf' => $row['tf'],
				];
			}

			return $indexList;
		}

		private function expandArray($arr, &$result) {
			if ($result === null) {
				$result = [];
			}

			foreach ($arr as $id => $childs) {
				$result[] = $id;
				$this->expandArray($childs, $result);
			}
		}

		/**
		 * Определяет доступна ли страница для индексации
		 * @param iUmiHierarchyElement $element
		 * @return bool
		 */
		private function isAllowed(iUmiHierarchyElement $element) {
			$event = Service::EventPointFactory()
				->create('is_element_allow_search', 'before')
				->setParam('element', $element)
				->setParam('is_not_for_index', $element->getValue('is_unindexed'));
			/** @var iUmiEventPoint|umiEventPoint $event */
			$event->call();

			if ($element->getIsDeleted() || !$element->getIsActive() || $event->getParam('is_not_for_index')) {
				return false;
			}

			return mainConfiguration::getInstance()->get('modules', 'search.allow-virtual-copies') ?: $element->isOriginal();
		}

		/**
		 * Возвращает минимальную длину обрабатываемого (искомого/индексируемого) слова
		 * @return int
		 */
		private function getMinWordLength() {
			$minWordLength = (int) mainConfiguration::getInstance()
				->get('kernel', 'search-min-word-length');
			return ($minWordLength < self::MIN_WORD_LENGTH) ? self::MIN_WORD_LENGTH : $minWordLength;
		}

		/** @deprecated */
		public function elementIsReindexed($elementId, $updateTime) {
			$elementId = (int) $elementId;
			$updateTime = (int) $updateTime;

			$connection = ConnectionPool::getInstance()->getConnection();
			$sql = <<<SQL
SELECT `rel_id` FROM `cms3_search` WHERE `rel_id` = '{$elementId}' AND `indextime` > '{$updateTime}' LIMIT 0,1
SQL;

			$result = $connection->queryResult($sql);
			$result->setFetchType(IQueryResult::FETCH_ROW);
			return $result->length() > 0;
		}
	}
