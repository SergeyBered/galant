/** Представление таблицы */

var NoChildrenView = Marionette.ItemView.extend({
	tagName: 'tr',
	className: 'table-row',
	template: 'umiTableEmpty.twig',
	dragAllowed: false,

	initialize: function(options) {
		this.template = options.template;
		this.fields = options.fields;
	},

	onBeforeRender: function() {
		this.templateHelpers = {};
		this.templateHelpers = {
			name: this.model.get('name'),
			fields: [],
			used_fields: this.fields
		};
	}
});

var umiDataTableRow = Backbone.Marionette.ItemView.extend({
	tagName: 'tr',
	className: 'table-row',
	shiftMode: false,
	dragAllowed: false,
	parent: null,
	parentView: null,

	events: {
		'click .catalog-toggle-wrapper': 'expandHandler',
		'click': 'clickHandler',
		'click .small-ico.i-change.editable': 'enableInLineEdit',
		'mouseover': 'mouseMoveHandler'
	},

	/**
	 * Инициализация вьюхи
	 * @param options
	 */
	initialize: function(options) {
		this.template = options.template;
		this.fields = options.fields;
		this.dragAllowed = options.dragAllowed;
		this.parent = options.parent || false;
	},

	/** Обработчик события до отрисовки вьюхи */
	onBeforeRender: function() {
		var that = this,
			editLink = require('./../templates_src/editLink.twig');
		this.templateHelpers = {};
		this.templateHelpers = {
			name: false,
			fields: this.model.attributes,
			used_fields: this.fields,
			cid: this.model.get('id'),
			editLink: editLink({
				pre_lang: window.pre_lang,
				module: dc_application.config.get('module'),
				method: dc_application.config.get('edit_method'),
				id: dc_application.unPackId(this.model.get('id')),
				params: this.model.get('__type')
			})
		};
		this.model.on('d:select:change', function(e) {
			that.selectChangeHandler.call(that, e);
		});
	},

	/** Обработчик события отрисовки вьюхи */
	onRender: function() {
		var that = this,
				DropMode = 'child',
				dragEl,
				pixelOffset = -2;

		this.model.selected = false;

		//Если разрешена инициализируем драг и дроп
		if (this.dragAllowed) {
			$('td:first-child', this.$el).draggable({
				appendTo: 'body',
				distance: 7,
				handle: 'span.item',
				cursorAt: {right: pixelOffset},
				helper: function() {
					if (!that.model.selected) {
						that.model.select(true);
					}
					dragEl = document.createElement('div');
					var selected = [];

					that.parent.children.each(function(item) {
						if (item.model.selected) {
							selected.push(item.model);
						}
					});

					dragEl.innerHTML = '';
					for (var i = 0, cnt = selected.length; i < cnt; i++) {
						dragEl.innerHTML += '<div>' + selected[i].get(that.fields[0].name) + '</div>';
					}

					dragEl.className = 'ti-draggable';

					jQuery(dragEl).css({
						'position': 'absolute',
						'padding-left': '20px'
					});

					return dragEl
				},
				start: function() {
					dc_application.drugMode = true;
					dc_application.draggableItem = [];

					that.parent.children.each(function(item) {
						if (item.model.selected) {
							dc_application.draggableItem.push(item);
						}
					})

				},
				drag: function(e) {
					if (dc_application.hView && dc_application.hView.cid !== dc_application.draggableItem[0].cid) {
						var y = e.pageY,
								hItem = dc_application.hView,
								cpos = $('table.table', $(dc_application.options.container)).offset(),
								itmHeight = hItem.$el.height(),
								itmDelta = y - cpos.top - hItem.$el.position().top;

						if (itmDelta < itmHeight / 3) {
							DropMode = 'before';
						}
						if (itmDelta > itmHeight / 3 && itmDelta < 2 * itmHeight / 3) {
							DropMode = 'child';
						}
						if (itmDelta > 2 * itmHeight / 3) {
							DropMode = 'after';
						}

						if (hItem.isRoot() && hItem.hasChildren()) {
							DropMode = 'child';
						}

						dc_application.initDroppable(DropMode);
					}

				},
				stop: function() {
					dc_application.tryToMove(DropMode, dc_application.draggableItem, dc_application.hView);
					dc_application.drugMode = false;
					dc_application.hView = null;
					dc_application.draggableItem = null;
					dc_application.dropIndicator.style.display = 'none';
					$(dragEl).remove();
				}
			});
		}
	},

	mouseMoveHandler: function() {
		if (this.dragAllowed && dc_application.drugMode) {
			if (dc_application.hView === null || dc_application.hView.cid !== this.cid) {
				dc_application.hView = this;
			}
		}
	},

	/**
	 * Выделение строк
	 * @param silent
	 */
	selectChangeHandler: function(silent) {
		if (this.model.selected) {
			this.$el.addClass('selected');
			$('.checkbox', this.$el).addClass('checked');
		} else {
			this.$el.removeClass('selected');
			$('.checkbox', this.$el).removeClass('checked');
		}

		if (!silent) {
			dc_application.vent.trigger('item:selected', this);
		}
	},

	/**
	 * Обработчик клилка на контрол разворачивания/сворачивания дерева
	 * @param e
	 */
	expandHandler: function(e) {
		if (!$('.catalog-toggle', this.$el).hasClass('switch')) {
			this.model.expanded = false;
		} else {
			this.model.expanded = true;
		}
		this.model.expanded = !this.model.expanded;
		$('.catalog-toggle', this.$el).toggleClass("switch");
		e.stopPropagation();
		this.trigger('expand');
	},

	/**
	 * Клик по всему контролу обрабатывет выделение
	 * @param e
	 */
	clickHandler: function(e) {
		if (String(e.target.tagName).toLowerCase() !== 'button') {
			this.shiftMode = e.shiftKey;
			this.model.select();
		}
	},

	/**
	 * Обработчик клика по контролу инлайн редактирования
	 * @param e
	 */
	enableInLineEdit: function(e) {
		var inline = require('./umiInlineControlView'),
				that = this,
				el = $(e.target),
				field = el.attr('umi-field');
		if (this.parent.inline !== null) {
			this.parent.inline.row.model.selected = false;
			this.parent.inline.row.selectChangeHandler();
			this.parent.inline.off('il:editcomplite');
			this.parent.inline.removeSilent();
		}
		this.parent.inline = new inline({model: this.model, _target: e.target, row: that});
		this.parent.inline.once('il:editcomplite', function(val) {
			var d = {};
			d[field] = val;
			that.parent.inline = null;
			dc_application.runmethod('save_field_method', {
				id: dc_application.unPackId(that.model.get('id')),
				data: {field: field, value: val, type: that.model.get('__type')}
			}).done(function(res) {
				if (!_.isUndefined(res['data']) && !_.isUndefined(res['data']['error'])) {
					openDialog(res['data']['error'], getLabel('js-error-header'));
				} else {
					that.model.set(d);
				}

				that.render();
				that.selectChangeHandler();

				if (!_.isUndefined(res['data']) && !_.isUndefined(res['data']['refresh'])) {
					dc_application.refresh();
				}
			}).fail(function() {
				that.render();
			});
		});
	},

	/**
	 * Определяет является ли этот ряд корневым элементом
	 * @returns {boolean}
	 */
	isRoot: function() {
		var rootIdLength = 2;
		var idList = this.model.get('id').split('_');
		return (idList.length == rootIdLength && idList[0] == 0);
	},

	/**
	 * Определяет есть ли у ряда дочерние ряды
	 * @returns {boolean}
	 */
	hasChildren: function() {
		return this.model.attributes.children.length > 0;
	}
});

var umiDataTableView = Backbone.Marionette.CollectionView.extend({
	childView: umiDataTableRow,
	emptyView: NoChildrenView,
	tagName: 'tbody',
	childViewEventPrefix: "udcrow",
	it: '111',
	fields: null,
	inline: null,
	dragAllowed: false,
	parentView: null,

	events: {
		'click .pages-bar a': 'pageNavigationClick'
	},

	initialize: function(options) {
		this.template = options.template;
		this.fields = options.fields;
		this.dragAllowed = options.dragAllowed;
		this.parentView = options.parentView || null;
	},

	childViewOptions: function() {
		return {
			template: this.template,
			fields: this.fields,
			dragAllowed: this.dragAllowed,
			parent: this
		}
	},

	pageNavigationClick: function(e) {
		dc_application.vent.trigger('b:pagechange', $(e.target).text(), this);
	},

	/** Косле отрисовки колекции генерим и рисуем строку пагинации */
	onBeforeRenderCollection: function() {
		if (this.$el.find('tr.table-row td.pages-bar').length > 0) {
			return true;
		}

		var data = this.collection;

		if (data.limit >= data.total) {
			return true;
		}

		var current = Math.ceil(data.offset / data.limit) + 1;
		current = current === 0 ? 1 : current;
		var total = Math.ceil(data.total / data.limit);
		var pageList = [];

		for (var i = -3; i < 4; i++) {
			var val = current + i;
			if (val > 0 && val <= total) {
				pageList.push(current + i);
			}
		}

		var counter = 0;

		if (total - pageList[pageList.length - 1] <= 3) {
			for (i = pageList[0] - 1, counter = total - 7; i > counter && i > 1; i--) {
				pageList.unshift(i);
			}
		} else if (pageList[0] <= 3) {
			for (i = pageList[pageList.length - 1] + 1, counter = 7; i <= counter && i <= total; i++) {
				pageList.push(i);
			}
		}

		var gapSymbol = '...';

		if (pageList[0] !== 1) {
			if (pageList[0] - 1 <= 3) {
				for (i = pageList[0] - 1; i > 0; i--) {
					pageList.unshift(i);
				}
			} else {
				pageList.unshift(1, gapSymbol);
			}
		}

		if (pageList[pageList.length - 1] !== total) {
			if (total - pageList[pageList.length - 1] <= 3) {
				for (i = pageList[pageList.length - 1] + 1; i <= total; i++) {
					pageList.push(i);
				}
			} else {
				pageList.push(gapSymbol, total);
			}
		}

		var pageNavigationBar = require('./../templates_src/umiTablePageNavigationBar.twig');
		this.$el.append(pageNavigationBar({
			firstField: this.fields.length > 0 ? this.fields[0] : null,
			fieldList: this.fields,
			pageList: pageList,
			current: current
		}));
	}
});

module.exports = umiDataTableView;
