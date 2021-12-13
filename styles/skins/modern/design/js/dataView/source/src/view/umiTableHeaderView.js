/** Представление заголовка таблицы */

var umiTableHeaderView = Backbone.Marionette.LayoutView.extend({
    tagName:'thead',

    events:{
        'keyup input':'onKeyPressHandler',
        'click .table-title':'orderChange',
        'change select':'filterSelectChange',
        'mousedown span':'resizeHandler',
        'click .cols_controler':'showMenu',
        'mouseout .cols_controler':'hideMenu'
    },

    menu: null,

    onBeforeRender: function () {
        this.templateHelpers = {};
        this.templateHelpers = this.model.attributes;
    },

    onRender:function () {

        _.each($('select',this.$el),function (item){
            new ControlComboBox({el:$(item)});
        });

        $('input[umi-type="date"]').datepicker({
            dateFormat: "dd.mm.yy",
            onSelect:function (){
                var value = $(this).val(),
                    field = $(this).attr('umi-field'),
                    type = $(this).attr('umi-type'),
                    valid = require('./../utils/umiDataValidate');
                $(this).removeClass('_error');
                if (value.length>0){
                    if (valid.test(type,value)) {
                        dc_application.vent.trigger('data:filter', [{field: field, value: value}]);
                    } else {
                        $(this).addClass('_error');
                    }
                }
            }
        });
        $('input[umi-type="datetime"]').datepicker({
            dateFormat: "dd.mm.yy 00:00",
            onSelect:function (){
                var value = $(this).val(),
                    field = $(this).attr('umi-field'),
                    type = $(this).attr('umi-type'),
                    valid = require('./../utils/umiDataValidate');
                $(this).removeClass('_error');
                if (value.length>0){
                    if (valid.test(type,value)) {
                        dc_application.vent.trigger('data:filter', [{field: field, value: value}]);
                    } else {
                        $(this).addClass('_error');
                    }
                }
            }
        });
    },

    onKeyPressHandler:function (e) {
        var value = $(e.target).val(),
            field = $(e.target).attr('umi-field'),
            type = $(this).attr('umi-type'),
            valid = require('./../utils/umiDataValidate');

        if (e.keyCode == 13 && value.length>0){
            if (valid.test(type,value)) {
                dc_application.vent.trigger('data:filter', [{field: field, value: value}]);
            } else {
                $(e.target).addClass('_error');
            }
        } else if (e.keyCode == 13 && value.length == 0){
            $(e.target).removeClass('_error');
            dc_application.vent.trigger('data:filter',[{field:field,value:''}]);
        }
    },

    /** Сбрасывает индикаци фильтров */
    resetFilter: function() {
        var $filterContainerList = $('div.input-search');
        $('input', $filterContainerList).val('');
        $('select option', $filterContainerList).remove();
        $('select', $filterContainerList).append('<option value="-1" selected="selected">' + getLabel('js-all') +'</option>');
        $('div.select div.selected', $filterContainerList).text(getLabel('js-all'));
    },

    orderChange:function (e) {
        var el = $(e.target),
            field = el.attr('umi-field'),
            direction = 'asc';
        if (el.hasClass('disabled')){
            $('.table-title:not(.disabled)').removeClass('switch').addClass('disabled');
            el.removeClass('disabled');
        } else if (el.hasClass('switch')){
            el.removeClass('switch');
        } else {
            direction = 'desc';
            el.addClass('switch');
        }
        dc_application.vent.trigger('b:orderhange',field,direction);
    },

    /** Сбрасывает индикацию сортировок */
    resetOrder: function() {
        $('.table-title').removeClass('switch').addClass('disabled');
    },

    resizeHandler:function (e) {
        var that = this,
            floatResizing = $('<div></div>'),
            tableContainer = this.$el.parent(),
            containerOffset = tableContainer.offset(),
            container = $(e.target).parent();

        floatResizing.addClass('resizer');
        floatResizing.css({
            top: containerOffset.top,
            left: e.clientX,
            height: tableContainer.outerHeight() + 'px'
        });

        $(document).on('mouseup', function (e) {
            that.resizerMouseUp(floatResizing, container)
        });
        $(document).on('mousemove', function (e) {
            that.resizerMouseMove(floatResizing,e.clientX)
        });

        $('body').append(floatResizing);

    },

    resizerMouseUp:function (el, tableHeaderCell) {
        $(document).off('mouseup');
        $(document).off('mousemove');

        var $headerContainer = $(tableHeaderCell),
            newColumnSize = el.position().left - $headerContainer.offset().left,
            colName = tableHeaderCell.attr('umi-field');

        newColumnSize = Math.min(newColumnSize, 800);
        newColumnSize = Math.max(newColumnSize, 150);

        var oldColumnSize = $headerContainer.outerWidth();

        if (newColumnSize !== oldColumnSize) {
            $headerContainer.css({
                width:newColumnSize + 'px',
                maxWidth:newColumnSize + 'px'
            });

            var $cellContainer = $('td.td_' + colName);
            $cellContainer.css({
                width: newColumnSize + 'px',
                maxWidth: newColumnSize + 'px'
            });

            this.recalculateValueCellWidth($cellContainer);
        }

        el.detach();
        dc_application.vent.trigger('data:saveusercolls');
    },

    /** Устанавливает ширину для всех ячеек со значениями полей */
    recalculateAllValueCellsWidth: function () {
        var that = this;

        $('#udcControlBody td.table-cell').each(function() {
            var $cellContainer = $(this);
            that.recalculateValueCellWidth($cellContainer);
        });
    },

    /**
     * Устанавливает ширину для ячейки со значением поля
     * @param {jQuery|Object} $cellContainer контейнер ячейки
     */
    recalculateValueCellWidth: function ($cellContainer) {
        var $valueCellContainer = $('span.item', $cellContainer);

        if ($valueCellContainer.length) {
            $valueCellContainer.css({
                'width': this.calculateValueCellContainerWidth($cellContainer)
            });
        }
    },

    /**
     * Вычисляет ширину значения ячейки
     * @param {jQuery|Object} $cellContainer контейнер ячейки
     * @returns {number}
     */
    calculateValueCellContainerWidth: function ($cellContainer) {
        var tableValueCellWidth = parseInt($cellContainer.css('width'));
        var $editButtonContainer = $('i.i-change', $cellContainer);
        var editButtonWidth = $editButtonContainer.length ? parseInt($editButtonContainer.outerWidth(true)) : 18;
        var $toggleOnContainer = $('span.catalog-toggle-wrapper', $cellContainer);
        var toggleOnWidth = $toggleOnContainer.length ? parseInt($toggleOnContainer.outerWidth(true)) : 0;
        var $toggleOffContainer = $('span.catalog-toggle-off', $cellContainer);
        var toggleOffWidth = $toggleOffContainer.length ? parseInt($toggleOffContainer.outerWidth(true)) : 0;
        var $checkboxContainer = $('div.checkbox', $cellContainer);
        var checkboxWidth = $checkboxContainer.length ? parseInt($checkboxContainer.outerWidth(true)) : 0;
        var tableValueCellPaddingLeft = parseInt($cellContainer.css('padding-left'));
        var tableValueCellPaddingRight = parseInt($cellContainer.css('padding-right'));
        return tableValueCellWidth - toggleOnWidth - editButtonWidth - toggleOffWidth - checkboxWidth - tableValueCellPaddingLeft - tableValueCellPaddingRight;
    },

    resizerMouseMove:function (el,x) {
        el.css('left', x);
    },

    filterSelectChange:function(e){
        var value = $(e.target).val();
        value = value == -1 ? '' : value;
        dc_application.vent.trigger('data:filter',[{field:$(e.target).attr('umi-field'),value:value}]);
    },

    showMenu:function (e) {
        if (this.menu === null) {
            this.menu = $.cmenu.getMenu(dc_application.columnsMenu);
        }
        $.cmenu.lockHiding = true;
        $.cmenu.show(this.menu, $('div.container').get(0), e);
    },

    hideMenu:function () {
        $.cmenu.lockHiding = false;
    }
});

module.exports = umiTableHeaderView;