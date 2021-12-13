(function($) {
	'use strict';

	$(function() {
		let editButton = $("#keycode-edit");
		let editInput = $("input[name = 'keycode']");

		/**
		 * Делает редактируемым поле с доменным ключем
		 */
		let makeKeycodeEditable = function() {
			editInput.removeAttr('readonly');
			editButton.parent().remove();
			editInput.css('width', '100%');
		};

		let popup =
			'<div class="eip_win_head popupHeader" onmousedown="$(\'.eip_win\').draggable()">' +
				'<div class="eip_win_close popupClose" onclick="confirmButtonCancelClick();"></div>' +
				'<div class="eip_win_title">' + getLabel('js-label-warning') + '</div>' +
			'</div>' +
			'<div class="eip_win_body popupBody" onmousedown="$(\'.eip_win\').draggable()">' +
				'<div class="popupText" style="zoom:1;">' + getLabel('js-edit-keycode-warning') + '</div>' +
				'<div class="eip_buttons">' +
					'<input type="button" class="back" value="' + getLabel('js-close') +  '" onclick="confirmButtonCancelClick();" />' +
					'<div style="clear:both;"></div>' +
				'</div>' +
			'</div>';

		editButton.on('click', function() {
			$.openPopupLayer({
				name: 'keycodeWarning',
				width: 300,
				data: popup,
				afterClose: makeKeycodeEditable
			});
		});
	});
}($));
