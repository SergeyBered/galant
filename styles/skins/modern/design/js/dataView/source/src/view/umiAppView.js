/** Шаблон разметки под контрол данных */
var umiAppView = Backbone.Marionette.LayoutView.extend({
    template: 'umiAppView.twig',

    regions:{
        control: '#udcControlBody',
        toolbar: '#udcToolbar',
        controlHeader:'#udcControlHeader'
    },
    
    events:{
        'click #udcConfigBar a.per_page_limit':'limitChangeHandler',
        'change select':'changeDomainHandler'
	},

    /**
     * Обработчик события before:render,
     * определяет переменные для использования в шаблоне
     */
    onBeforeRender: function () {
        this.templateHelpers = {
            limits: (this.options.pageLimits.length > 0) ? this.options.pageLimits : false,
            current: this.options.perPageLimit,
            domainsList: this.options.domainsList
        };
    },

    /**
     * Обработчик события измения количества элементов на страницу в контроле настройки
     * @param e
     */
    limitChangeHandler:function (e) {
        $('#udcConfigBar a.per_page_limit.current').removeClass('current');
        $(e.target).addClass('current');
        dc_application.vent.trigger('b:limitchange',$(e.target).text());
    },

    /**
     * Обработчик события измения выбранного домена в контроле
     * @param e
     */
    changeDomainHandler: function (e) {
		var element = $(e.currentTarget);

		if (typeof element.attr('umi-field') == 'undefined') {
			dc_application.vent.trigger('domainchange',element.val());
		}
    }

});

module.exports = umiAppView;
