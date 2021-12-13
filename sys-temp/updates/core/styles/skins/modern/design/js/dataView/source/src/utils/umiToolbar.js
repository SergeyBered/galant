/** Тулбар панели */
var Toolbar = Backbone.Marionette.ItemView.extend({
    options: {},
    template: 'umiToolbarTemplate.twig',
    buttonTemplate: _.template('<a class="icon-action" href="<%= url %>" title="<%= title %>" name="<%= name %>"><i class="small-ico <%= ico %>"></i></a>'),
    TableToolbarFunctions:require('./umiButtons'),
    selectedItemsCount:0,
    selectedItems:[],

    buttons: [],
    menu: [],
    selectButtons: [],
    resetButtons: [],
    singleActionButtons: [],
    exchangeButtons: [],


    initialize: function (options) {
        this.options = _.extend(this.options, options);

        if (typeof this.options.showSelectButtons === 'undefined') {
            this.options.showSelectButtons = true;
        }

        if (typeof this.options.showResetButtons === 'undefined') {
            this.options.showResetButtons = true;
        }

        this.menu = [
            this.TableToolbarFunctions.addButton,
            this.TableToolbarFunctions.editButton,
            this.TableToolbarFunctions.delButton
        ];

        if (this.options.showResetButtons) {
            this.resetButtons = [
                this.TableToolbarFunctions.refresh,
                this.TableToolbarFunctions.resetFilterAndSortButton
            ];
        }

        if (this.options.showSelectButtons) {
            this.selectButtons = [
                this.TableToolbarFunctions.selectAllButton,
                this.TableToolbarFunctions.unSelectAllButton,
                this.TableToolbarFunctions.invertAllButton
            ];
        }

        this.singleActionButtons = [
            this.TableToolbarFunctions.editButton,
            this.TableToolbarFunctions.addButton
        ];
    },

    onRender: function () {
        if (!_.isUndefined(this.options.toolbarFunctions)) {
            var fkeys = Object.keys(this.options.toolbarFunctions);
            for (var j = 0, cnt = fkeys.length; j < cnt; j++) {
                this.TableToolbarFunctions[fkeys[j]] = this.options.toolbarFunctions[fkeys[j]];
            }
        }
        if (!_.isUndefined(this.options.toolbarMenu)) {
            this.menu = [];
            for (var k = 0, mcnt = this.options.toolbarMenu.length; k < mcnt; k++) {
                this.menu.push(this.TableToolbarFunctions[this.options.toolbarMenu[k]]);
            }
        }

        for (var i = 0, cnt = this.menu.length; i < cnt; i++) {
            if (this.menu[i].name === 'ico_add') {
                if (this.options.disableAddButton) {
                    this.appendButton(this.menu[i]);
                }
            } else {
                this.appendButton(this.menu[i]);
            }

        }

        this.disableButtons(this.menu);

        if (this.options.showResetButtons) {
            for (var i = 0, cnt = this.resetButtons.length; i < cnt; i++) {
                this.appendButton(this.resetButtons[i]);
            }
        }

        if (this.options.showSelectButtons) {
            for (var i = 0, cnt = this.selectButtons.length; i < cnt; i++) {
                this.appendButton(this.selectButtons[i]);
            }

            this.disableButtons(this.selectButtons[2]);
        }

        this.initButtons(dc_application.data.models[0]);
    },

    appendButton: function (button) {
        var $buttonElement = this.renderButton(button);
        this.buttons.push(button);
        this.$el.find('.toolbar').append($buttonElement);
    },

    /**
     * Формирует Html представление кнопки
     * @param {Object} button кнопка
     * @returns {jQuery}
     */
    renderButton: function(button) {
        var html = this.buttonTemplate({
            url: button.href || '#',
            name: button.name || 'toolbtn',
            ico: button.className || "",
            title: button.hint || ''
        });

        if (button['el']) {
            var newElement = $(html);
            var existElement = $(button['el']);
            existElement.attr('class', newElement.attr('class'));
            existElement.attr('href', newElement.attr('href'));
            existElement.attr('title', newElement.attr('title'));
            existElement.attr('name', newElement.attr('name'));
            existElement.html($('i', newElement));
            return button['el'];
        }

        var buttonElement = $(html);
        button['el'] = buttonElement;
        this.bindButtonClick(button);
        return buttonElement;
    },

    /**
     * Прикрепляет обработчик нажатия к кнопке тулбара
     * @param {Object} button кнопка
     */
    bindButtonClick: function(button) {
        if (!button['el']) {
            return;
        }

        var buttonElement = $(button['el']);

        if (typeof(button.release) === 'function') {
            buttonElement.on('click', function () {

                if ($(this).hasClass('disabled')) {
                    return false;
                }

                return button.release(button);
            });
        } else {
            buttonElement.on('click', function () {
                return !$(this).hasClass('disabled');
            });
        }
    },

    /** Прикрепляет обработчик нажатия ко всем кнопкам тулбара */
    bindAllButtonsClick: function () {
        for (var i = 0; i < this.buttons.length; i++) {
            this.bindButtonClick(this.buttons[i]);
        }
    },

    disableButtons: function (btns) {
        if (!_.isArray(btns)) {
            btns = [btns];
        }

        for (var i = 0, cnt = btns.length; i < cnt; i++) {
            this.$el.find('a[name="' + btns[i].name + '"]').addClass('disabled');
        }
    },

    enableButtons: function (btns) {
        if (!_.isArray(btns)) {
            btns = [btns];
        }

        for (var i = 0, cnt = btns.length; i < cnt; i++) {
            this.$el.find('a[name="' + btns[i].name + '"]').removeClass('disabled');
        }
    },

    initButtons: function (item) {
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].init(this.buttons[i],item);
        }
    },

    redraw:function () {
        this.selectedItems = dc_application.data.getSelected();
        this.selectedItemsCount = this.selectedItems.length;

        if (this.selectedItemsCount > 0) {
            this.enableButtons(this.menu);

            if (this.options.showSelectButtons) {
                this.enableButtons(this.selectButtons[2]);
            }

            if (this.selectedItemsCount > 1) {
                this.disableButtons(this.singleActionButtons);
            }
        } else {
            this.disableButtons(this.menu);

            if (this.options.showSelectButtons) {
                this.disableButtons(this.selectButtons[2]);
            }
        }

        if (this.options.showResetButtons) {
            for (var i = 0, cnt = this.resetButtons.length; i < cnt; i++) {
                this.enableButtons(this.resetButtons[i]);
            }
        }

        this.initButtons();
    }
});


module.exports = Toolbar;
