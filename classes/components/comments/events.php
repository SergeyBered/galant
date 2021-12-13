<?php
	use UmiCms\Service;

	/** Проверка комментария на антиспам */
	Service::EventHandlerFactory()
		->createForModule(
		'comments_message_post_do',
		'comments',
		'onCommentPost'
	);

