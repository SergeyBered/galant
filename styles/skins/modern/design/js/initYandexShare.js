/**
 * Инициализация сервиса yandex.share на странице редактирования страницы
 * @link https://yandex.ru/dev/share/doc/dg/api.html
 */
$(function() {
	if (!uAdmin || !uAdmin.data || !uAdmin.data.data || !uAdmin.data.data.page) {
		return;
	}

	$.getScript('/styles/skins/modern/design/js/yandexShare.js', function() {
		let link = location.protocol + '//' + uAdmin.data.domain + '/~/' + uAdmin.data.data.page.id;
		let title = uAdmin.data.data.page.name;

		new Ya.share2('ya_share1', {
			content: {
				url: link,
				title: title
			},
			theme: {
				copy: 'extraItem',
				services: 'vkontakte,facebook,twitter,odnoklassniki,moimir,lj,telegram,whatsapp,skype'
			}
		});

		let items = $('span#ya_share1 a');
		items.each(function() {
			$(this).css('display', 'inline');
		});
	});
});
