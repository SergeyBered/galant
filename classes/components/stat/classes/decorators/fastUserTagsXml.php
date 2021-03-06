<?php

	/** Декоратор отчета "fastUserTags" */
	class fastUserTagsXml extends xmlDecorator {

		/** @inheritDoc */
		protected function generate($array) {
			$dom = new DOMDocument('1.0', 'utf-8');
			$element = $dom->createElement('statistic');
			$root = $dom->appendChild($element);

			if (empty($array)) {
				return $dom->saveXML();
			}

			$element = $dom->createElement('avg');
			$labels = $root->appendChild($element);
			foreach (['top'/*, 'collected'*/] as $index) {
				$node = $labels->appendChild($dom->createElement($index . 's'));
				foreach ($array['labels'][$index] as $key => $val) {
					$routine = $dom->createElement($index);
					$this->bind($routine, $val);
					$node->appendChild($routine);
				}
			}

			return $dom->saveXML();
		}
	}

