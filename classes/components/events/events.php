<?php
	use UmiCms\Service;

	if (!Service::Registry()->get('//modules/events/collect-events')) {
		Service::EventHandlerFactory()->createForModuleByConfig([
			[
				'event' => 'blogs20PostAdded',
				'method' => 'onBlogsPostAdded'
			],
			[
				'event' => 'blogs20CommentAdded',
				'method' => 'onBlogsCommentAdded'
			],
			[
				'event' => 'comments_message_post_do',
				'method' => 'onCommentsCommentPost'
			],
			[
				'event' => 'order-status-changed',
				'method' => 'onEmarketOrderAdded'
			],
			[
				'event' => 'faq_post_question',
				'method' => 'onFaqQuestionPost'
			],
			[
				'event' => 'forum_message_post_do',
				'method' => 'onForumMessagePost'
			],
			[
				'event' => 'users_registrate',
				'method' => 'onUsersRegistered'
			],
			[
				'event' => 'users_login_successfull',
				'method' => 'onUsersLoginSuccessfull'
			],
			[
				'event' => 'users_prelogin_successfull',
				'method' => 'onUsersLoginSuccessfull'
			],
			[
				'event' => 'pollPost',
				'method' => 'onVotePollPost'
			],
			[
				'event' => 'webforms_post',
				'method' => 'onWebformsPost'
			],
			[
				'event' => 'sysytemBeginPageEdit',
				'method' => 'onPageView'
			],
			[
				'event' => 'sysytemBeginObjectEdit',
				'method' => 'onObjectView'
			],
			[
				'event' => 'hierarchyDeleteElement',
				'method' => 'onPageHierarchyDelete'
			],
			[
				'event' => 'systemDeleteElement',
				'method' => 'onPageSystemDelete'
			],
			[
				'event' => 'collectionDeleteObject',
				'method' => 'onObjectDelete'
			],
			[
				'event' => 'createTicket',
				'method' => 'onCreateTicket'
			],
			[
				'event' => 'deleteTicket',
				'method' => 'onDeleteTicket'
			],
		], [
			'module' => 'events',
		]);
	}
