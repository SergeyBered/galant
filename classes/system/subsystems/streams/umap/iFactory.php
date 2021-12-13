<?php
	namespace UmiCms\System\Streams\Umap;

	interface iFactory {

		/**
		 * Создает маршрутизатор umap
		 * @return \iMatches
		 */
		public function create();
	}