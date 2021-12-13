<?php

	use UmiCms\Service;

	/** Обработчик события создания миниатюры предпросмотра водяного знака */
	Service::EventHandlerFactory()->createForModule(
		'makeThumbnailFull',
		'filemanager',
		'renamePreviewThumb'
	);
