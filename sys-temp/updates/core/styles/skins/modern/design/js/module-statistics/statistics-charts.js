$(document).ready(function() {
	let canvas = $("canvas[id^=stat_canvas_]")[0];
	let canvasId = canvas.getAttribute('id');
	let method = canvasId.split('stat_canvas_')[1];
	let preloader = $('#statistics-preloader');
	let statistics;

	switch (method) {
		case 'popular_pages': {
			popularPages();
			break;
		}
		case 'sectionHits': {
			sectionHits();
			break;
		}
		case 'visits': {
			visits();
			break;
		}
		case 'visits_sessions': {
			visits_sessions();
			break;
		}
		case 'visits_visitors': {
			visits_visitors();
			break;
		}
		case 'auditoryActivity': {
			auditoryActivity();
			break;
		}
		case 'auditoryLoyality': {
			auditoryLoyality();
			break;
		}
		case 'visitDeep': {
			visitDeep();
			break;
		}
		case 'auditoryLocation': {
			auditoryLocation();
			break;
		}
		case 'visitTime': {
			visitTime();
			break;
		}
		case 'sources': {
			sources();
			break;
		}
		case 'engines': {
			engines();
			break;
		}
		case 'phrases': {
			phrases();
			break;
		}
		case 'entryPoints': {
			entryPoints();
			break;
		}
		case 'refererByEntry': {
			refererByEntry();
			break;
		}
		case 'exitPoints': {
			exitPoints();
			break;
		}
		case 'openstatCampaigns': {
			openStatCampaigns()
			break;
		}
		case 'openstatServices': {
			openStatServices();
			break;
		}
		case 'openstatSources': {
			openStatSources();
			break;
		}
		case 'openstatAds': {
			openStatAds();
			break;
		}
		default: {
			drawErrorStub();
			break;
		}
	}

	/** "Популярные страницы/Страницы" */

	/**
	 * Запускает отрисовку статистики в разделе "Популярные страницы/Страницы"
	 */
	function popularPages() {
		$.ajax({
			url: "/admin/stat/popular_pages/xml",
			dataType: 'xml',
			beforeSend: function() {
				preloader.show();
			},
			complete: function() {
				preloader.hide();
			},
			success: function(xml) {
				statistics = getPopularPagesStatistics(xml);

				if (statistics.length === 0) {
					drawNoDataStub();
					return;
				}

				drawPopularPagesPie();
				drawPopularPagesTable(xml);
			},
			error: function() {
				drawErrorStub();
			}
		});
	}

	/**
	 * Возвращает статистику для рисования в разделе "Популярные страницы/Страницы"
	 * @param xml данные, которые вернул метод StatAdmin::popular_pages()
	 * @return Array
	 */
	function getPopularPagesStatistics(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['count'] = Number(item.getAttribute('cnt'));
			resultItem['percentages'] = Number(item.getAttribute('rel'));
			resultItem['name'] = item.getAttribute('name');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "Популярные страницы/Страницы"
	 */
	function drawPopularPagesPie() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['percentages']);
		});

		let colors = getRandomColors(labels.length);

		let pie = new Chart(context, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				},
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Популярные страницы/Страницы"
	 * @param xml данные, которые вернул метод StatAdmin::popular_pages()
	 */
	function drawPopularPagesTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, item) {
			html += `<th>${item.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td><td>${item['percentages']}%</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_popular_pages');
		table.html(html);
	}

	/** "Популярные страницы/Разделы" */

	/**
	 * Запускает отрисовку статистики в разделе "Популярные страницы/Разделы"
	 */
	function sectionHits() {
		$.ajax({
			url: '/admin/stat/sectionHits/xml',
			dataType: 'xml',
			beforeSend: function() {
				preloader.show();
			},
			complete: function() {
				preloader.hide();
			},
			success: function(xml) {
				statistics = getSectionHitsStatistics(xml);

				if (statistics.length === 0) {
					drawNoDataStub();
					return;
				}

				drawSectionHitsPie();
				drawSectionHitsTable(xml);
			},
			error: function() {
				drawErrorStub();
			}
		});
	}

	/**
	 * Возвращает статистику для рисования в разделе "Популярные страницы/Разделы"
	 * @param xml данные, которые вернул метод StatAdmin::sectionHits()
	 * @return Array
	 */
	function getSectionHitsStatistics(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['count'] = Number(item.getAttribute('count'));
			resultItem['percentages'] = Number(item.getAttribute('rel'));
			resultItem['name'] = item.getAttribute('name');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "Популярные страницы/Разделы"
	 */
	function drawSectionHitsPie() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['percentages']);
		});

		let colors = getRandomColors(labels.length);

		let pie = new Chart(context, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				},
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Популярные страницы/Разделы"
	 * @param xml данные, которые вернул метод StatAdmin::sectionHits()
	 */
	function drawSectionHitsTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, item) {
			html += `<th>${item.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td><td>${item['percentages']}%</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_sectionHits');
		table.html(html);
	}

	/** "Посещения, Аудитория/Хиты" */

	/**
	 * Запускает отрисовку статистики в разделе "Посещения, Аудитория/Хиты"
	 */
	function visits() {
		if (!isFirstReportDrawn()) {
			setFirstReportIsDrawn();

			$.ajax({
				url: '/admin/stat/visits/xml1',
				dataType: 'xml',
				beforeSend: function() {
					preloader.show();
				},
				complete: function() {
					preloader.hide();
				},
				success: function(xml) {
					statistics = getVisitsStatisticsByDays(xml);

					if (statistics.length === 0) {
						drawNoDataStub();
						return;
					}

					drawVisitsBarByDays();
					drawVisitsTableByDays(xml);
				},
				error: function() {
					drawErrorStub();
				}
			});
		} else {
			setFirstReportIsNotDrawn();
			canvas = $("canvas[id^=stat_canvas_]")[1];

			$.ajax({
				url: '/admin/stat/visits/xml2',
				dataType: 'xml',
				beforeSend: function() {
					preloader.show();
				},
				complete: function() {
					preloader.hide();
				},
				success: function(xml) {
					statistics = getVisitsStatisticsByHours(xml);

					if (statistics.length === 0) {
						drawNoDataStub();
						return;
					}

					drawVisitsLineByHours();
					drawVisitsTableByHours(xml);
				}
			});
		}
	}

	/**
	 * Возвращает статистику для рисования в разделе "Посещения, Аудитория/Хиты"
	 * @param xml данные, которые вернул метод StatAdmin::visits()
	 * @return Array
	 */
	function getVisitsStatisticsByDays(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['count'] = Number(item.getAttribute('count'));
			resultItem['percentages'] = Number(item.getAttribute('rel'));
			resultItem['name'] = item.getAttribute('date');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "Посещения, Аудитория/Хиты"
	 */
	function drawVisitsBarByDays() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['percentages']);
		});

		let colors = getRandomColors(labels.length);

		let bar = new Chart(context, {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				},
				tooltips: {
					callbacks: {
						beforeTitle: function() {
							return getLabel('js-label-hits-count');
						}
					}
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Посещения, Аудитория/Хиты"
	 * @param xml данные, которые вернул метод StatAdmin::visits()
	 */
	function drawVisitsTableByDays(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, item) {
			html += `<th>${item.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td><td>${item['percentages']}%</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_visits')[0];
		table = $(table);
		table.html(html);
	}

	/**
	 * Возвращает статистику для рисования в разделе "Посещения, Аудитория/Хиты"
	 * @param xml данные, которые вернул метод StatAdmin::visits()
	 * @return Array
	 */
	function getVisitsStatisticsByHours(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['count'] = Number(item.getAttribute('count'));
			resultItem['percentages'] = Number(item.getAttribute('rel'));
			resultItem['name'] = item.getAttribute('hourint');
			result.push(resultItem);
		});

		return result;
	}
	/**
	 *  Рисует диаграмму статистики в разделе "Посещения, Аудитория/Хиты"
	 */
	function drawVisitsLineByHours() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['percentages']);
		});

		let colors = getRandomColors(labels.length);

		let line = new Chart(context, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				},
				tooltips: {
					callbacks: {
						beforeTitle: function() {
							return getLabel('js-label-hits-count');
						}
					}
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Посещения, Аудитория/Хиты"
	 * @param xml данные, которые вернул метод StatAdmin::visits()
	 */
	function drawVisitsTableByHours(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, item) {
			html += `<th>${item.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td><td>${item['percentages']}%</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_visits')[1];
		table = $(table);
		table.html(html);
	}

	/** "Посещения, Аудитория/Сессии" */

	/**
	 * Запускает отрисовку статистики в разделе "Посещения, Аудитория/Сессии"
	 */
	function visits_sessions() {
		if (!isFirstReportDrawn()) {
			setFirstReportIsDrawn();

			$.ajax({
				url: '/admin/stat/visits_sessions/xml1',
				dataType: 'xml',
				beforeSend: function() {
					preloader.show();
				},
				complete: function() {
					preloader.hide();
				},
				success: function(xml) {
					statistics = getSessionsStatisticsByDays(xml);

					if (statistics.length === 0) {
						drawNoDataStub();
						return;
					}

					drawSessionsBarByDays();
					drawSessionsTableByDays(xml);
				},
				error: function() {
					drawErrorStub();
				}
			});
		} else {
			setFirstReportIsNotDrawn();
			canvas = $("canvas[id^=stat_canvas_]")[1];

			$.ajax({
				url: '/admin/stat/visits_sessions/xml2',
				dataType: 'xml',
				beforeSend: function() {
					preloader.show();
				},
				complete: function() {
					preloader.hide();
				},
				success: function(xml) {
					statistics = getSessionsStatisticsByHours(xml);

					if (statistics.length === 0) {
						drawNoDataStub();
						return;
					}

					drawSessionsLineByHours();
					drawSessionsTableByHours(xml);
				},
				error: function() {
					drawErrorStub();
				}
			});
		}
	}

	/**
	 * Возвращает статистику для рисования в разделе "Посещения, Аудитория/Сессии"
	 * @param xml данные, которые вернул метод StatAdmin::visits_sessions()
	 * @return Array
	 */
	function getSessionsStatisticsByDays(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['count'] = Number(item.getAttribute('cnt'));
			resultItem['name'] = item.getAttribute('name');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "Посещения, Аудитория/Сессии"
	 */
	function drawSessionsBarByDays() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['count']);
		});

		let colors = getRandomColors(labels.length);

		let bar = new Chart(context, {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				},
				tooltips: {
					callbacks: {
						beforeTitle: function() {
							return getLabel('js-label-sessions-count');
						}
					}
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Посещения, Аудитория/Сессии"
	 * @param xml данные, которые вернул метод StatAdmin::visits_sessions()
	 */
	function drawSessionsTableByDays(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, item) {
			html += `<th>${item.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_visits_sessions')[0];
		table = $(table);
		table.html(html);
	}

	/**
	 * Возвращает статистику для рисования в разделе "Посещения, Аудитория/Сессии"
	 * @param xml данные, которые вернул метод StatAdmin::visits_sessions()
	 * @return Array
	 */
	function getSessionsStatisticsByHours(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['count'] = Number(item.getAttribute('cnt'));
			resultItem['name'] = item.getAttribute('name');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "Посещения, Аудитория/Сессии"
	 */
	function drawSessionsLineByHours() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['count']);
		});

		let colors = getRandomColors(labels.length);

		let line = new Chart(context, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				},
				tooltips: {
					callbacks: {
						beforeTitle: function() {
							return getLabel('js-label-sessions-count');
						}
					}
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Посещения, Аудитория/Сессии"
	 * @param xml данные, которые вернул метод StatAdmin::visits_sessions()
	 */
	function drawSessionsTableByHours(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, item) {
			html += `<th>${item.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_visits_sessions')[1];
		table = $(table);
		table.html(html);
	}

	/** "Посещения, Аудитория/Посетители" */

	/**
	 * Запускает отрисовку статистики в разделе "Посещения, Аудитория/Посетители"
	 */
	function visits_visitors() {
		if (!isFirstReportDrawn()) {
			setFirstReportIsDrawn();

			$.ajax({
				url: '/admin/stat/visits_visitors/xml1',
				dataType: 'xml',
				beforeSend: function() {
					preloader.show();
				},
				complete: function() {
					preloader.hide();
				},
				success: function(xml) {
					statistics = getAllVisitorsStatistics(xml);

					if (statistics.length === 0) {
						drawNoDataStub();
						return;
					}

					drawAllVisitorsBar();
					drawAllVisitorsTable(xml);
				},
				error: function() {
					drawErrorStub();
				}
			});
		} else {
			setFirstReportIsNotDrawn();
			canvas = $("canvas[id^=stat_canvas_]")[1];

			$.ajax({
				url: '/admin/stat/visits_visitors/xml2',
				dataType: 'xml',
				beforeSend: function() {
					preloader.show();
				},
				complete: function() {
					preloader.hide();
				},
				success: function(xml) {
					statistics = getNewVisitorsStatistics(xml);

					if (statistics.length === 0) {
						drawNoDataStub();
						return;
					}

					drawNewVisitorsBar();
					drawNewVisitorsTable(xml);
				},
				error: function() {
					drawErrorStub();
				}
			});
		}
	}

	/**
	 * Возвращает статистику для рисования в разделе "Посещения, Аудитория/Посетители"
	 * @param xml данные, которые вернул метод StatAdmin::visits_visitors()
	 * @return Array
	 */
	function getAllVisitorsStatistics(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['count'] = Number(item.getAttribute('count'));
			resultItem['name'] = item.getAttribute('period');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "Посещения, Аудитория/Посетители"
	 */
	function drawAllVisitorsBar() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['count']);
		});

		let colors = getRandomColors(labels.length);

		let pie = new Chart(context, {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				},
				tooltips: {
					callbacks: {
						beforeTitle: function() {
							return getLabel('js-label-all-visitors-count');
						}
					}
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Посещения, Аудитория/Посетители"
	 * @param xml данные, которые вернул метод StatAdmin::visits_visitors()
	 */
	function drawAllVisitorsTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, item) {
			html += `<th>${item.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_visits_visitors')[0];
		table = $(table);
		table.html(html);
	}

	/**
	 * Возвращает статистику для рисования в разделе "Посещения, Аудитория/Посетители"
	 * @param xml данные, которые вернул метод StatAdmin::visits_visitors()
	 * @return Array
	 */
	function getNewVisitorsStatistics(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['count'] = Number(item.getAttribute('count'));
			resultItem['name'] = item.getAttribute('period');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "Посещения, Аудитория/Посетители"
	 */
	function drawNewVisitorsBar() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['count']);
		});

		let colors = getRandomColors(labels.length);

		let pie = new Chart(context, {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				},
				tooltips: {
					callbacks: {
						beforeTitle: function() {
							return getLabel('js-label-new-visitors-count');
						}
					}
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Посещения, Аудитория/Посетители"
	 * @param xml данные, которые вернул метод StatAdmin::visits_visitors()
	 */
	function drawNewVisitorsTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, item) {
			html += `<th>${item.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_visits_visitors')[1];
		table = $(table);
		table.html(html);
	}

	/** "Посещения, Аудитория/Активность аудитории" */

	/**
	 * Запускает отрисовку статистики в разделе "Посещения, Аудитория/Активность аудитории"
	 */
	function auditoryActivity() {
		if (!isFirstReportDrawn()) {
			setFirstReportIsDrawn();

			$.ajax({
				url: '/admin/stat/auditoryActivity/xml1',
				dataType: 'xml',
				beforeSend: function() {
					preloader.show();
				},
				complete: function() {
					preloader.hide();
				},
				success: function(xml) {
					statistics = getAllAuditoryActivityStatistics(xml);

					if (statistics.length === 0) {
						drawNoDataStub();
						return;
					}

					drawAllAuditoryActivityPie();
					drawAllAuditoryActivityTable(xml);
				},
				error: function() {
					drawErrorStub();
				}
			});
		} else {
			setFirstReportIsNotDrawn();
			canvas = $("canvas[id^=stat_canvas_]")[1];

			$.ajax({
				url: '/admin/stat/auditoryActivity/xml2',
				dataType: 'xml',
				beforeSend: function() {
					preloader.show();
				},
				complete: function() {
					preloader.hide();
				},
				success: function(xml) {
					statistics = getPeriodAuditoryActivityStatistics(xml);

					if (statistics.length === 0) {
						drawNoDataStub();
						return;
					}

					drawPeriodAuditoryActivityLine();
					drawPeriodAuditoryActivityTable(xml);
				},
				error: function() {
					drawErrorStub();
				}
			});
		}
	}

	/**
	 * Возвращает статистику для рисования в разделе "Посещения, Аудитория/Активность аудитории"
	 * @param xml данные, которые вернул метод StatAdmin::auditoryActivity()
	 * @return Array
	 */
	function getAllAuditoryActivityStatistics(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['count'] = Number(item.getAttribute('cnt'));
			resultItem['percentages'] = Number(item.getAttribute('rel'));
			resultItem['name'] = item.getAttribute('name');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "Посещения, Аудитория/Активность аудитории"
	 */
	function drawAllAuditoryActivityPie() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['percentages']);
		});

		let colors = getRandomColors(labels.length);

		let pie = new Chart(context, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Посещения, Аудитория/Активность аудитории"
	 * @param xml данные, которые вернул метод StatAdmin::auditoryActivity()
	 */
	function drawAllAuditoryActivityTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, item) {
			html += `<th>${item.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td><td>${item['percentages']}%</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_auditoryActivity')[0];
		table = $(table);
		table.html(html);
	}

	/**
	 * Возвращает статистику для рисования в разделе "Посещения, Аудитория/Активность аудитории"
	 * @param xml данные, которые вернул метод StatAdmin::auditoryActivity()
	 * @return Array
	 */
	function getPeriodAuditoryActivityStatistics(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['count'] = Number(item.getAttribute('cnt'));
			resultItem['name'] = item.getAttribute('name');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "Посещения, Аудитория/Активность аудитории"
	 */
	function drawPeriodAuditoryActivityLine() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['count']);
		});

		let colors = getRandomColors(labels.length);

		let line = new Chart(context, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Посещения, Аудитория/Активность аудитории"
	 * @param xml данные, которые вернул метод StatAdmin::auditoryActivity()
	 */
	function drawPeriodAuditoryActivityTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, item) {
			html += `<th>${item.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_auditoryActivity')[1];
		table = $(table);
		table.html(html);
	}

	/** "Посещения, Аудитория/Лояльность аудитории" */

	/**
	 * Запускает отрисовку статистики в разделе "Посещения, Аудитория/Лояльность аудитории"
	 */
	function auditoryLoyality() {
		if (!isFirstReportDrawn()) {
			setFirstReportIsDrawn();

			$.ajax({
				url: '/admin/stat/auditoryLoyality/xml1',
				dataType: 'xml',
				beforeSend: function() {
					preloader.show();
				},
				complete: function() {
					preloader.hide();
				},
				success: function(xml) {
					statistics = getAllAuditoryLoyalityStatistics(xml);

					if (statistics.length === 0) {
						drawNoDataStub();
						return;
					}

					drawAllAuditoryLoyalityPie();
					drawAllAuditoryLoyalityTable(xml);
				},
				error: function() {
					drawErrorStub();
				}
			});
		} else {
			setFirstReportIsNotDrawn();
			canvas = $("canvas[id^=stat_canvas_]")[1];

			$.ajax({
				url: '/admin/stat/auditoryLoyality/xml2',
				dataType: 'xml',
				beforeSend: function() {
					preloader.show();
				},
				complete: function() {
					preloader.hide();
				},
				success: function(xml) {
					statistics = getPeriodAuditoryLoyalityStatistics(xml);

					if (statistics.length === 0) {
						drawNoDataStub();
						return;
					}

					drawPeriodAuditoryLoyalityLine();
					drawPeriodAuditoryLoyalityTable(xml);
				},
				error: function() {
					drawErrorStub();
				}
			});
		}
	}

	/**
	 * Возвращает статистику для рисования в разделе "Посещения, Аудитория/Лояльность аудитории"
	 * @param xml данные, которые вернул метод StatAdmin::auditoryLoyality()
	 * @return Array
	 */
	function getAllAuditoryLoyalityStatistics(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['count'] = Number(item.getAttribute('cnt'));
			resultItem['percentages'] = Number(item.getAttribute('rel'));
			resultItem['name'] = item.getAttribute('name');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "Посещения, Аудитория/Лояльность аудитории"
	 */
	function drawAllAuditoryLoyalityPie() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['percentages']);
		});

		let colors = getRandomColors(labels.length);

		let pie = new Chart(context, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Посещения, Аудитория/Лояльность аудитории"
	 * @param xml данные, которые вернул метод StatAdmin::auditoryLoyality()
	 */
	function drawAllAuditoryLoyalityTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, item) {
			html += `<th>${item.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td><td>${item['percentages']}%</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_auditoryLoyality')[0];
		table = $(table);
		table.html(html);
	}

	/**
	 * Возвращает статистику для рисования в разделе "Посещения, Аудитория/Лояльность аудитории"
	 * @param xml данные, которые вернул метод StatAdmin::auditoryLoyality()
	 * @return Array
	 */
	function getPeriodAuditoryLoyalityStatistics(xml) {
		let result = [];
		let activities = xml.getElementsByTagName('row');

		$(activities).each(function(index, item) {
			let resultItem = [];
			resultItem['name'] = item.getAttribute('name');
			resultItem['count'] = Number(item.getAttribute('cnt'));
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "Посещения, Аудитория/Лояльность аудитории"
	 */
	function drawPeriodAuditoryLoyalityLine() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['count']);
		});

		let colors = getRandomColors(labels.length);

		let line = new Chart(context, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Посещения, Аудитория/Лояльность аудитории"
	 * @param xml данные, которые вернул метод StatAdmin::auditoryLoyality()
	 */
	function drawPeriodAuditoryLoyalityTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, item) {
			html += `<th>${item.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_auditoryLoyality')[1];
		table = $(table);
		table.html(html);
	}

	/** "Посещения, Аудитория/Глубина просмотра" */

	/**
	 * Запускает отрисовку статистики в разделе "Посещения, Аудитория/Глубина просмотра"
	 */
	function visitDeep() {
		if (!isFirstReportDrawn()) {
			setFirstReportIsDrawn();

			$.ajax({
				url: '/admin/stat/visitDeep/xml1',
				dataType: 'xml',
				beforeSend: function() {
					preloader.show();
				},
				complete: function() {
					preloader.hide();
				},
				success: function(xml) {
					statistics = getAllVisitsDeepStatistics(xml);

					if (statistics.length === 0) {
						drawNoDataStub();
						return;
					}

					drawAllVisitsDeepBar();
					drawAllVisitsDeepTable(xml);
				},
				error: function() {
					drawErrorStub();
				}
			});
		} else {
			setFirstReportIsNotDrawn();
			canvas = $("canvas[id^=stat_canvas_]")[1];

			$.ajax({
				url: '/admin/stat/visitDeep/xml2',
				dataType: 'xml',
				beforeSend: function() {
					preloader.show();
				},
				complete: function() {
					preloader.hide();
				},
				success: function(xml) {
					statistics = getPeriodVisitsDeepStatistics(xml);

					if (statistics.length === 0) {
						drawNoDataStub();
						return;
					}

					drawPeriodVisitsDeepLine();
					drawPeriodVisitsDeepTable(xml);
				},
				error: function() {
					drawErrorStub();
				}
			});
		}
	}

	/**
	 * Возвращает статистику для рисования в разделе "Посещения, Аудитория/Глубина просмотра"
	 * @param xml данные, которые вернул метод StatAdmin::visitDeep()
	 * @return Array
	 */
	function getAllVisitsDeepStatistics(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['count'] = Number(item.getAttribute('cnt'));
			resultItem['percentages'] = Number(item.getAttribute('rel'));
			resultItem['name'] = item.getAttribute('name');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "Посещения, Аудитория/Глубина просмотра"
	 */
	function drawAllVisitsDeepBar() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['count']);
		});

		let colors = getRandomColors(labels.length);

		let bar = new Chart(context, {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				},
				tooltips: {
					callbacks: {
						beforeTitle: function() {
							return getLabel('js-label-visits');
						}
					}
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Посещения, Аудитория/Глубина просмотра"
	 * @param xml данные, которые вернул метод StatAdmin::visitDeep()
	 */
	function drawAllVisitsDeepTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, item) {
			html += `<th>${item.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td><td>${item['percentages']}%</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_visitDeep')[0];
		table = $(table);
		table.html(html);
	}

	/**
	 * Возвращает статистику для рисования в разделе "Посещения, Аудитория/Глубина просмотра"
	 * @param xml данные, которые вернул метод StatAdmin::visitDeep()
	 * @return Array
	 */
	function getPeriodVisitsDeepStatistics(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['name'] = item.getAttribute('name');
			resultItem['count'] = Number(item.getAttribute('cnt'));
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "Посещения, Аудитория/Глубина просмотра"
	 */
	function drawPeriodVisitsDeepLine() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['count']);
		});

		let colors = getRandomColors(labels.length);

		let line = new Chart(context, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Посещения, Аудитория/Глубина просмотра"
	 * @param xml данные, которые вернул метод StatAdmin::visitDeep()
	 */
	function drawPeriodVisitsDeepTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, item) {
			html += `<th>${item.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_visitDeep')[1];
		table = $(table);
		table.html(html);
	}

	/** "Посещения, Аудитория/Размещение аудитории" */

	/**
	 * Запускает отрисовку статистики в разделе "Посещения, Аудитория/Размещение аудитории"
	 */
	function auditoryLocation() {
		$.ajax({
			url: "/admin/stat/auditoryLocation/xml",
			dataType: 'xml',
			beforeSend: function() {
				preloader.show();
			},
			complete: function() {
				preloader.hide();
			},
			success: function(xml) {
				statistics = getAuditoryLocationStatistics(xml);

				if (statistics.length === 0) {
					drawNoDataStub();
					return;
				}

				drawAuditoryLocationPie();
				drawAuditoryLocationTable(xml);
			},
			error: function() {
				drawErrorStub();
			}
		});
	}

	/**
	 * Возвращает статистику для рисования в разделе "Посещения, Аудитория/Размещение аудитории"
	 * @param xml данные, которые вернул метод StatAdmin::auditoryLocation()
	 * @return Array
	 */
	function getAuditoryLocationStatistics(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['count'] = Number(item.getAttribute('count'));
			resultItem['name'] = item.getAttribute('name');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "Посещения, Аудитория/Размещение аудитории"
	 */
	function drawAuditoryLocationPie() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['count']);
		});

		let colors = getRandomColors(labels.length);

		let pie = new Chart(context, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				},
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Посещения, Аудитория/Размещение аудитории"
	 * @param xml данные, которые вернул метод StatAdmin::auditoryLocation()
	 */
	function drawAuditoryLocationTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, item) {
			html += `<th>${item.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_auditoryLocation');
		table.html(html);
	}

	/** "Посещения, Аудитория/Время просмотра" */

	/**
	 * Запускает отрисовку статистики в разделе "Посещения, Аудитория/Время просмотра"
	 */
	function visitTime() {
		if (!isFirstReportDrawn()) {
			setFirstReportIsDrawn();

			$.ajax({
				url: '/admin/stat/visitTime/xml1',
				dataType: 'xml',
				beforeSend: function() {
					preloader.show();
				},
				complete: function() {
					preloader.hide();
				},
				success: function(xml) {
					statistics = getAllVisitsTimeStatistics(xml);

					if (statistics.length === 0) {
						drawNoDataStub();
						return;
					}

					drawAllVisitsTimePie();
					drawAllVisitsTimeTable(xml);
				},
				error: function() {
					drawErrorStub();
				}
			});
		} else {
			setFirstReportIsNotDrawn();
			canvas = $("canvas[id^=stat_canvas_]")[1];

			$.ajax({
				url: '/admin/stat/visitTime/xml2',
				dataType: 'xml',
				beforeSend: function() {
					preloader.show();
				},
				complete: function() {
					preloader.hide();
				},
				success: function(xml) {
					statistics = getPeriodVisitsTimeStatistics(xml);

					if (statistics.length === 0) {
						drawNoDataStub();
						return;
					}

					drawPeriodVisitsTimeLine();
					drawPeriodVisitsTimeTable(xml);
				},
				error: function() {
					drawErrorStub();
				}
			});
		}
	}

	/**
	 * Возвращает статистику для рисования в разделе "Посещения, Аудитория/Время просмотра"
	 * @param xml данные, которые вернул метод StatAdmin::visitTime()
	 * @return Array
	 */
	function getAllVisitsTimeStatistics(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['count'] = Number(item.getAttribute('cnt'));
			resultItem['percentages'] = Number(item.getAttribute('rel'));
			resultItem['name'] = item.getAttribute('name');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "Посещения, Аудитория/Время просмотра"
	 */
	function drawAllVisitsTimePie() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['percentages']);
		});

		let colors = getRandomColors(labels.length);

		let pie = new Chart(context, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Посещения, Аудитория/Время просмотра"
	 * @param xml данные, которые вернул метод StatAdmin::visitTime()
	 */
	function drawAllVisitsTimeTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, column) {
			html += `<th>${column.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td><td>${item['percentages']}%</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_visitTime')[0];
		table = $(table);
		table.html(html);
	}

	/**
	 * Возвращает статистику для рисования в разделе "Посещения, Аудитория/Время просмотра"
	 * @param xml данные, которые вернул метод StatAdmin::visitTime()
	 * @return Array
	 */
	function getPeriodVisitsTimeStatistics(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['name'] = item.getAttribute('name');
			resultItem['count'] = Number(item.getAttribute('cnt'));
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "Посещения, Аудитория/Время просмотра"
	 */
	function drawPeriodVisitsTimeLine() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['count']);
		});

		let colors = getRandomColors(labels.length);

		let line = new Chart(context, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Посещения, Аудитория/Время просмотра"
	 * @param xml данные, которые вернул метод StatAdmin::visitTime()
	 */
	function drawPeriodVisitsTimeTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, column) {
			html += `<th>${column.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_visitTime')[1];
		table = $(table);
		table.html(html);
	}

	/** "Источники и пути/Источники" */

	/**
	 * Запускает отрисовку статистики в разделе "Источники и пути/Источники"
	 */
	function sources() {
		$.ajax({
			url: '/admin/stat/sources/xml',
			dataType: 'xml',
			beforeSend: function() {
				preloader.show();
			},
			complete: function() {
				preloader.hide();
			},
			success: function(xml) {
				statistics = getSourcesStatistics(xml);

				if (statistics.length === 0) {
					drawNoDataStub();
					return;
				}

				drawSourcesPie();
				drawSourcesTable(xml);
			},
			error: function() {
				drawErrorStub();
			}
		});
	}

	/**
	 * Возвращает статистику для рисования в разделе "Источники и пути/Источники"
	 * @param xml данные, которые вернул метод StatAdmin::sources()
	 * @return Array
	 */
	function getSourcesStatistics(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['percentages'] = Number(item.getAttribute('rel'));
			resultItem['count'] = Number(item.getAttribute('cnt'));
			resultItem['name'] = item.getAttribute('name');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "Источники и пути/Источники"
	 */
	function drawSourcesPie() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['percentages']);
		});

		let colors = getRandomColors(labels.length);

		let pie = new Chart(context, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Источники и пути/Источники"
	 * @param xml данные, которые вернул метод StatAdmin::sources()
	 */
	function drawSourcesTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, column) {
			html += `<th>${column.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td><td>${item['percentages']}%</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_sources')[0];
		table = $(table);
		table.html(html);
	}

	/** "Источники и пути/Поисковые системы" */

	/**
	 * Запускает отрисовку статистики в разделе "Источники и пути/Поисковые системы"
	 */
	function engines() {
		$.ajax({
			url: '/admin/stat/engines/xml',
			dataType: 'xml',
			beforeSend: function() {
				preloader.show();
			},
			complete: function() {
				preloader.hide();
			},
			success: function(xml) {
				statistics = getEnginesStatistics(xml);

				if (statistics.length === 0) {
					drawNoDataStub();
					return;
				}
				drawEnginesPie();
				drawEnginesTable(xml);
			},
			error: function() {
				drawErrorStub();
			}
		});
	}

	/**
	 * Возвращает статистику для рисования в разделе "Источники и пути/Поисковые системы"
	 * @param xml данные, которые вернул метод StatAdmin::engines()
	 * @return Array
	 */
	function getEnginesStatistics(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['percentages'] = Number(item.getAttribute('rel'));
			resultItem['count'] = Number(item.getAttribute('cnt'));
			resultItem['name'] = item.getAttribute('name');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "Источники и пути/Поисковые системы"
	 */
	function drawEnginesPie() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['percentages']);
		});

		let colors = getRandomColors(labels.length);

		let pie = new Chart(context, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Источники и пути/Поисковые системы"
	 * @param xml данные, которые вернул метод StatAdmin::engines()
	 */
	function drawEnginesTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, column) {
			html += `<th>${column.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td><td>${item['percentages']}%</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_engines')[0];
		table = $(table);
		table.html(html);
	}

	/** "Источники и пути/Поисковые запросы" */

	/**
	 * Запускает отрисовку статистики в разделе "Источники и пути/Поисковые запросы"
	 */
	function phrases() {
		$.ajax({
			url: '/admin/stat/phrases/xml',
			dataType: 'xml',
			beforeSend: function() {
				preloader.show();
			},
			complete: function() {
				preloader.hide();
			},
			success: function(xml) {
				statistics = getPhrasesStatistics(xml);

				if (statistics.length === 0) {
					drawNoDataStub();
					return;
				}

				drawPhrasesPie();
				drawPhrasesTable(xml);
			},
			error: function() {
				drawErrorStub();
			}
		});
	}

	/**
	 * Возвращает статистику для рисования в разделе "Источники и пути/Поисковые запросы"
	 * @param xml данные, которые вернул метод StatAdmin::phrases()
	 * @return Array
	 */
	function getPhrasesStatistics(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['percentages'] = Number(item.getAttribute('rel'));
			resultItem['count'] = Number(item.getAttribute('cnt'));
			resultItem['name'] = item.getAttribute('name');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "Источники и пути/Поисковые запросы"
	 */
	function drawPhrasesPie() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['percentages']);
		});

		let colors = getRandomColors(labels.length);

		let pie = new Chart(context, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Источники и пути/Поисковые запросы"
	 * @param xml данные, которые вернул метод StatAdmin::phrases()
	 */
	function drawPhrasesTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, column) {
			html += `<th>${column.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td><td>${item['percentages']}%</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_phrases')[0];
		table = $(table);
		table.html(html);
	}

	/** "Источники и пути/Точки входа" */

	/**
	 * Запускает отрисовку статистики в разделе "Источники и пути/Точки входа"
	 */
	function entryPoints() {
		$.ajax({
			url: '/admin/stat/entryPoints/xml',
			dataType: 'xml',
			beforeSend: function() {
				preloader.show();
			},
			complete: function() {
				preloader.hide();
			},
			success: function(xml) {
				statistics = getEntryPointsStatistics(xml);

				if (statistics.length === 0) {
					drawNoDataStub();
					return;
				}

				drawEntryPointsPie();
				drawEntryPointsTable(xml);
			},
			error: function() {
				drawErrorStub();
			}
		});
	}

	/**
	 * Возвращает статистику для рисования в разделе "Источники и пути/Точки входа"
	 * @param xml данные, которые вернул метод StatAdmin::entryPoints()
	 * @return Array
	 */
	function getEntryPointsStatistics(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['percentages'] = Number(item.getAttribute('rel'));
			resultItem['count'] = Number(item.getAttribute('cnt'));
			resultItem['name'] = item.getAttribute('name');
			resultItem['href_name'] = item.getAttribute('ref');
			resultItem['href'] = item.getAttribute('refURI');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "Источники и пути/Точки входа"
	 */
	function drawEntryPointsPie() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['percentages']);
		});

		let colors = getRandomColors(labels.length);

		let pie = new Chart(context, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Источники и пути/Точки входа"
	 * @param xml данные, которые вернул метод StatAdmin::entryPoints()
	 */
	function drawEntryPointsTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, column) {
			html += `<th>${column.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td><td>${item['percentages']}%</td><td><a target="_blank" href="${item['href']}">${item['href_name']}</a></td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_entryPoints')[0];
		table = $(table);
		table.html(html);
	}

	/** "Источники и пути/Источники для точки входа" */

	/**
	 * Запускает отрисовку статистики в разделе "Источники и пути/Источники для точки входа"
	 */
	function refererByEntry() {
		let urlParts = window.location.href.split('/');
		let entryPointId = urlParts[urlParts.length - 2];

		$.ajax({
			url: `/admin/stat/refererByEntry/${entryPointId}/xml`,
			dataType: 'xml',
			beforeSend: function() {
				preloader.show();
			},
			complete: function() {
				preloader.hide();
			},
			success: function(xml) {
				statistics = getEntryPointStatistics(xml);

				if (statistics.length === 0) {
					drawNoDataStub();
					return;
				}

				drawEntryPointPie();
				drawEntryPointTable(xml);
			},
			error: function() {
				drawErrorStub();
			}
		});
	}

	/**
	 * Возвращает статистику для рисования в разделе "Источники и пути/Источники для точки входа"
	 * @param xml данные, которые вернул метод StatAdmin::refererByEntry()
	 * @return Array
	 */
	function getEntryPointStatistics(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['count'] = Number(item.getAttribute('count'));
			resultItem['name'] = item.getAttribute('name');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "Источники и пути/Источники для точки входа"
	 */
	function drawEntryPointPie() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['count']);
		});

		let colors = getRandomColors(labels.length);

		let pie = new Chart(context, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Источники и пути/Источники для точки входа"
	 * @param xml данные, которые вернул метод StatAdmin::refererByEntry()
	 */
	function drawEntryPointTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, column) {
			html += `<th>${column.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_refererByEntry')[0];
		table = $(table);
		table.html(html);
	}

	/** "Источники и пути/Точки выхода" */

	/**
	 * Запускает отрисовку статистики в разделе "Источники и пути/Точки выхода"
	 */
	function exitPoints() {
		$.ajax({
			url: '/admin/stat/exitPoints/xml',
			dataType: 'xml',
			beforeSend: function() {
				preloader.show();
			},
			complete: function() {
				preloader.hide();
			},
			success: function(xml) {
				statistics = getExitPointsStatistics(xml);

				if (statistics.length === 0) {
					drawNoDataStub();
					return;
				}

				drawExitPointsPie();
				drawExitPointsTable(xml);
			},
			error: function() {
				drawErrorStub();
			}
		});
	}

	/**
	 * Возвращает статистику для рисования в разделе "Источники и пути/Точки выхода"
	 * @param xml данные, которые вернул метод StatAdmin::exitPoints()
	 * @return Array
	 */
	function getExitPointsStatistics(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['percentages'] = Number(item.getAttribute('rel'));
			resultItem['count'] = Number(item.getAttribute('cnt'));
			resultItem['name'] = item.getAttribute('name');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "Источники и пути/Точки выхода"
	 */
	function drawExitPointsPie() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['percentages']);
		});

		let colors = getRandomColors(labels.length);

		let pie = new Chart(context, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "Источники и пути/Точки выхода"
	 * @param xml данные, которые вернул метод StatAdmin::exitPoints()
	 */
	function drawExitPointsTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, column) {
			html += `<th>${column.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td><td>${item['percentages']}%</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_exitPoints')[0];
		table = $(table);
		table.html(html);
	}

	/** "OpenStat/Кампании" */

	/**
	 * Запускает отрисовку статистики в разделе "OpenStat/Кампании"
	 */
	function openStatCampaigns() {
		$.ajax({
			url: '/admin/stat/openstatCampaigns/xml',
			dataType: 'xml',
			beforeSend: function() {
				preloader.show();
			},
			complete: function() {
				preloader.hide();
			},
			success: function(xml) {
				statistics = getOpenStatCampaignsStatistics(xml);

				if (statistics.length === 0) {
					drawNoDataStub();
					return;
				}

				drawOpenStatCampaignsPie();
				drawOpenStatCampaignsTable(xml);
			},
			error: function() {
				drawErrorStub();
			}
		});
	}

	/**
	 * Возвращает статистику для рисования в разделе "OpenStat/Кампании"
	 * @param xml данные, которые вернул метод StatAdmin::openstatCampaigns()
	 * @return Array
	 */
	function getOpenStatCampaignsStatistics(xml) {
		let result = [];
		let items = xml.getElementsByTagName('row');

		$(items).each(function(index, item) {
			let resultItem = [];
			resultItem['percentages'] = Number(item.getAttribute('rel'));
			resultItem['count'] = Number(item.getAttribute('cnt'));
			resultItem['name'] = item.getAttribute('name');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "OpenStat/Кампании"
	 */
	function drawOpenStatCampaignsPie() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['percentages']);
		});

		let colors = getRandomColors(labels.length);

		let pie = new Chart(context, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "OpenStat/Кампании"
	 * @param xml данные, которые вернул метод StatAdmin::openstatCampaigns()
	 */
	function drawOpenStatCampaignsTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, column) {
			html += `<th>${column.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td><td>${item['percentages']}%</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_openstatCampaigns')[0];
		table = $(table);
		table.html(html);
	}

	/** "OpenStat/Ресурсы" */

	/**
	 * Запускает отрисовку статистики в разделе "OpenStat/Ресурсы"
	 */
	function openStatServices() {
		$.ajax({
			url: '/admin/stat/openstatServices/xml',
			dataType: 'xml',
			beforeSend: function() {
				preloader.show();
			},
			complete: function() {
				preloader.hide();
			},
			success: function(xml) {
				statistics = getOpenStatServicesStatistics(xml);

				if (statistics.length === 0) {
					drawNoDataStub();
					return;
				}

				drawOpenStatServicesPie();
				drawOpenStatServicesTable(xml);
			},
			error: function() {
				drawErrorStub();
			}
		});
	}

	/**
	 * Возвращает статистику для рисования в разделе "OpenStat/Ресурсы"
	 * @param xml данные, которые вернул метод StatAdmin::openstatServices()
	 * @return Array
	 */
	function getOpenStatServicesStatistics(xml) {
		let result = [];
		let data = xml.getElementsByTagName('row');

		$(data).each(function(index, item) {
			let resultItem = [];
			resultItem['percentages'] = Number(item.getAttribute('rel'));
			resultItem['count'] = Number(item.getAttribute('cnt'));
			resultItem['name'] = item.getAttribute('name');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "OpenStat/Ресурсы"
	 */
	function drawOpenStatServicesPie() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['percentages']);
		});

		let colors = getRandomColors(labels.length);

		let pie = new Chart(context, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "OpenStat/Ресурсы"
	 * @param xml данные, которые вернул метод StatAdmin::openstatServices()
	 */
	function drawOpenStatServicesTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, column) {
			html += `<th>${column.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td><td>${item['percentages']}%</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_openstatServices')[0];
		table = $(table);
		table.html(html);
	}

	/** "OpenStat/Места объявлений" */

	/**
	 * Запускает отрисовку статистики в разделе "OpenStat/Места объявлений"
	 */
	function openStatSources() {
		$.ajax({
			url: '/admin/stat/openstatSources/xml',
			dataType: 'xml',
			beforeSend: function() {
				preloader.show();
			},
			complete: function() {
				preloader.hide();
			},
			success: function(xml) {
				statistics = getOpenStatSourcesStatistics(xml);

				if (statistics.length === 0) {
					drawNoDataStub();
					return;
				}

				drawOpenStatSourcesPie();
				drawOpenStatSourcesTable(xml);
			},
			error: function() {
				drawErrorStub();
			}
		});
	}

	/**
	 * Возвращает статистику для рисования в разделе "OpenStat/Места объявлений"
	 * @param xml данные, которые вернул метод StatAdmin::openstatSources()
	 * @return Array
	 */
	function getOpenStatSourcesStatistics(xml) {
		let result = [];
		let data = xml.getElementsByTagName('row');

		$(data).each(function(index, item) {
			let resultItem = [];
			resultItem['percentages'] = Number(item.getAttribute('rel'));
			resultItem['count'] = Number(item.getAttribute('cnt'));
			resultItem['name'] = item.getAttribute('name');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "OpenStat/Места объявлений"
	 */
	function drawOpenStatSourcesPie() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['percentages']);
		});

		let colors = getRandomColors(labels.length);

		let pie = new Chart(context, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "OpenStat/Места объявлений"
	 * @param xml данные, которые вернул метод StatAdmin::openstatSources()
	 */
	function drawOpenStatSourcesTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, column) {
			html += `<th>${column.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td><td>${item['percentages']}%</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_openstatSources')[0];
		table = $(table);
		table.html(html);
	}

	/** "OpenStat/Объявления" */

	/**
	 * Запускает отрисовку статистики в разделе "OpenStat/Объявления"
	 */
	function openStatAds() {
		$.ajax({
			url: '/admin/stat/openstatAds/xml',
			dataType: 'xml',
			beforeSend: function() {
				preloader.show();
			},
			complete: function() {
				preloader.hide();
			},
			success: function(xml) {
				statistics = getOpenStatAdsStatistics(xml);

				if (statistics.length === 0) {
					drawNoDataStub();
					return;
				}

				drawOpenStatAdsPie();
				drawOpenStatAdsTable(xml);
			},
			error: function() {
				drawErrorStub();
			}
		});
	}

	/**
	 * Возвращает статистику для рисования в разделе "OpenStat/Объявления"
	 * @param xml данные, которые вернул метод StatAdmin::openstatAds()
	 * @return Array
	 */
	function getOpenStatAdsStatistics(xml) {
		let result = [];
		let data = xml.getElementsByTagName('row');

		$(data).each(function(index, item) {
			let resultItem = [];
			resultItem['percentages'] = Number(item.getAttribute('rel'));
			resultItem['count'] = Number(item.getAttribute('cnt'));
			resultItem['name'] = item.getAttribute('name');
			result.push(resultItem);
		});

		return result;
	}

	/**
	 *  Рисует диаграмму статистики в разделе "OpenStat/Объявления"
	 */
	function drawOpenStatAdsPie() {
		let context = canvas.getContext('2d');
		let labels = [];
		let percentages = [];

		$(statistics).each(function(index, item) {
			labels.push(item['name']);
			percentages.push(item['percentages']);
		});

		let colors = getRandomColors(labels.length);

		let pie = new Chart(context, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					data: percentages,
					backgroundColor: colors
				}]
			},
			options: {
				legend: {
					display: false
				}
			}
		});
	}

	/**
	 * Рисует таблицу статистики в разделе "OpenStat/Объявления"
	 * @param xml данные, которые вернул метод StatAdmin::openstatAds()
	 */
	function drawOpenStatAdsTable(xml) {
		let columns = xml.getElementsByTagName('column');
		let html = '<thead><tr>';

		$(columns).each(function(index, column) {
			html += `<th>${column.getAttribute('title')}</th>}`;
		});

		html += '</tr></thead><tbody>';

		$(statistics).each(function(index, item) {
			html += `<tr><td>${item['name']}</td><td>${item['count']}</td><td>${item['percentages']}%</td></tr>`
		});

		html += '</tbody>';
		let table = $('table#stat_table_openstatAds')[0];
		table = $(table);
		table.html(html);
	}

	/**
	 * Выводит текст-заглушку о том, что данные статистики не найдены
	 */
	function drawNoDataStub() {
		let noDataBlock = $('#no-data');
		noDataBlock.css('text-align', 'center');
		noDataBlock.text(getLabel('js-label-no-data-for-period'));
	}

	/**
	 * Выводит текст-заглушку о том, что произошла ошибка
	 */
	function drawErrorStub() {
		let noDataBlock = $('#no-data');
		noDataBlock.css('text-align', 'center');
		noDataBlock.text(getLabel('js-label-no-data-error'));
	}

	/**
	 *  Возвращает список случайно сгенерированных комбинаций rgb-цветов
	 *  @param count необходимое количество цветов
	 *  @return Array
	 */
	function getRandomColors(count) {
		let colors = [];
		let min = 0;
		let max = 255;

		for (let i = 0; i < count; i++) {
			let r = min + Math.floor(Math.random() * (max - min + 1));
			let g = min + Math.floor(Math.random() * (max - min + 1));
			let b = min + Math.floor(Math.random() * (max - min + 1));
			let color = `rgb(${r}, ${g}, ${b}, 0.5)`;
			colors.push(color);
		}

		return colors;
	}

	/**
	 * Возвращает результат проверки, отрисован ли первый отчет на странице
	 * @return boolean
	 */
	function isFirstReportDrawn() {
		return getCookie('reportdrawn') !== null;
	}

	/**
	 * Устанавливает, что первый отчет на странице отрисован
	 */
	function setFirstReportIsDrawn() {
		setCookie('reportdrawn', 1);
	}

	/**
	 * Удаляет признак того, что первый отчет на странице отрисован
	 */
	function setFirstReportIsNotDrawn() {
		deleteCookie('reportdrawn');
	}
});
