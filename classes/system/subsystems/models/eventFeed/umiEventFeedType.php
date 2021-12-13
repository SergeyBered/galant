<?php
 class umiEventFeedType {private static $connection;private static $types;private $id;public static function setConnection(IConnection $v4717d53ebfdfea8477f780ec66151dcb) {self::$connection = $v4717d53ebfdfea8477f780ec66151dcb;}public static function getConnection() {if (self::$connection === null) {throw new Exception('No database connection is set');}return self::$connection;}public static function create($vb80bb7740288fda1f201890375a60c8f) {$vb80bb7740288fda1f201890375a60c8f = self::getConnection()->escape($vb80bb7740288fda1f201890375a60c8f);if ($vb80bb7740288fda1f201890375a60c8f === '') {throw new Exception('umiFeedEventType cannot be empty');}try {self::getConnection()->query("INSERT INTO umi_event_types SET id = '{$vb80bb7740288fda1f201890375a60c8f}'");}catch (Exception $ve1671797c52e15f763380b45e841ec32) {throw new Exception("umiFeedEventType with id {$vb80bb7740288fda1f201890375a60c8f} already exists");}self::load();return self::get($vb80bb7740288fda1f201890375a60c8f);}public static function get($vb80bb7740288fda1f201890375a60c8f) {if (self::$types === null) {self::load();}if (!isset(self::$types[$vb80bb7740288fda1f201890375a60c8f])) {throw new Exception("umiFeedEventType with id '{$vb80bb7740288fda1f201890375a60c8f}' doesn't exist");}return self::$types[$vb80bb7740288fda1f201890375a60c8f];}public static function getList() {if (self::$types === null) {self::load();}return self::$types;}public function getAllowedList($v7d1b98ec98cdcfba1cb39cb36a9f9ec0) {return self::getAllowedEvents($v7d1b98ec98cdcfba1cb39cb36a9f9ec0);}public static function getAllowedEvents($v7d1b98ec98cdcfba1cb39cb36a9f9ec0) {if (empty($v7d1b98ec98cdcfba1cb39cb36a9f9ec0)) {return array_keys(self::getList());}$result = [];$vd14a8022b085f9ef19d479cbdd581127 = self::getList();foreach ($vd14a8022b085f9ef19d479cbdd581127 as $v5f694956811487225d15e973ca38fbab => $v599dcce2998a6b40b1e38e8c6006cb0a) {if (!in_array($v5f694956811487225d15e973ca38fbab, $v7d1b98ec98cdcfba1cb39cb36a9f9ec0)) {$result[] = $v5f694956811487225d15e973ca38fbab;}}return $result;}public function __construct(array $v8d777f385d3dfec8815d20f7496026dc) {$this->id = $v8d777f385d3dfec8815d20f7496026dc['id'];}private static function load() {self::$types = [];$vcaf9b6b99962bf5c2264824231d7a40c = self::getConnection()->queryResult('SELECT * FROM umi_event_types');if (!$vcaf9b6b99962bf5c2264824231d7a40c) {throw new privateException('Failed to load event types');}foreach ($vcaf9b6b99962bf5c2264824231d7a40c as $vf1965a857bc285d26fe22023aa5ab50d) {self::$types[$vf1965a857bc285d26fe22023aa5ab50d['id']] = new self($vf1965a857bc285d26fe22023aa5ab50d);}}public function getId() {return $this->id;}}