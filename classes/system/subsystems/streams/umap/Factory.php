<?php
	namespace UmiCms\System\Streams\Umap;

	class Factory implements iFactory {

		/** @inheritDoc */
		public function create() {
			return new \matches();
		}
	}