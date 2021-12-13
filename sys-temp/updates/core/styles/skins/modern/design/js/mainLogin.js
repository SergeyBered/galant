$(function() {

	$('#login_field').trigger("focus");

	$('select').selectize({
		allowEmptyOption: true,
		create: false,
		hideSelected: true
	});

	$('.checkbox input:checked').parent().addClass('checked');

	$('.checkbox').on('click', function() {
		$(this).toggleClass('checked');
	});

	$('input:radio').on('click', function() {
		$('#forget').find('input:text').attr('name', $(this).attr('id'));
	});

	var $container = $('.container');
	$container.hide();

	$('#forgetLabel').on('click', function() {
		if ($container.is(':visible')) {
			$container.hide('slide');
		} else {
			$container.show('slide');
		}
	});

	/** Обработчик нажатия на кнопку "Выслать пароль" */
	$('#submit_reset_field').on('click', function(e) {
		e.preventDefault();
		let $forgetForm = $('#forget');
		let $forgetFormAnswer = $('#resetFormAnswer');
		let $successFormAnswer = $('#successFormAnswer');

		$forgetFormAnswer.hide();
		$successFormAnswer.hide();

		$.ajax({
			url: $forgetForm.attr('action'),
			type: 'POST',
			data: $forgetForm.serialize(),
			statusCode: {
				403: function(response) {
					let $message = response.responseText;
					let $error = $($message).find('.error').text().split('.');
					let $errorText = $error[0] + '.';

					$forgetFormAnswer.text($errorText);
					$forgetFormAnswer.show();
				}
			},
			success: function(response) {
				if (response.udata && response.udata.error) {
					$forgetFormAnswer.html(response.udata.error);
					$forgetFormAnswer.show();
				} else {
					$successFormAnswer.show();
				}
			}
		})
	});

	initBubbles();

	function initBubbles() {
		var d = document.querySelector('.bubbles'),
				e = document.querySelector('.bubbles-front'),
				f = function(a) {
					var b = document.body.offsetWidth,
							c = document.body.offsetHeight,
							f = 0.04,
							g = 0.04,
							h = (b / 2 - a.clientX) * f,
							i = (c / 2 - a.clientY) * g;
					d.style.marginLeft = h + 'px',
							d.style.marginTop = i + 'px',
							e.style.marginLeft = 0.2 * h + 'px',
							e.style.marginTop = 0.2 * i + 'px'
				},
				g = !0;

		document.onmousemove = function(a) {
			g && (d.className = 'bubbles visible', e.className = 'bubbles-front visible', g = !1),
					f(a)
		}
	}

});
