(function($, window, DefaultModule) {
    'use strict';

    /** @type {String} MODULE_NAME системное имя модуля */
    const MODULE_NAME = 'emarket';
    /** @type {String} REQUEST_APPROVE_PAYMENT_METHOD метод, который подтверждает платеж */
    const REQUEST_APPROVE_PAYMENT_METHOD = 'approvePayment';
    /** @type {String} REQUEST_CANCEL_PAYMENT_METHOD метод, который отменяет платеж */
    const REQUEST_CANCEL_PAYMENT_METHOD = 'cancelPayment';
    /** @type {String} REQUEST_REFUND_PAYMENT_METHOD метод, который возвращает средства по платежу */
    const REQUEST_REFUND_PAYMENT_METHOD = 'refundPayment';

    /** "Конструктор" */
    $(function() {
        bindApprovePaymentButton();
        bindCancelPaymentButton();
        bindRefundPaymentButton();
    });

    /** Подключает действие к кнопке подтверждения платежа */
    let bindApprovePaymentButton = function() {
        bindPaymentActionToButton(getApprovePaymentButton(), approvePayment);
    };

    /** Подключает действие к кнопке отмены платежа */
    let bindCancelPaymentButton = function() {
        bindPaymentActionToButton(getCancelPaymentButton(), cancelPayment);
    };

    /** Подключает действие к кнопке возврата средств по платежу */
    let bindRefundPaymentButton = function() {
        bindPaymentActionToButton(getRefundPaymentButton(), refundPayment);
    };

    /**
     * Подключает действие к нажатию кнопки
     * @param {jQuery} $button кнопка
     * @param {Function} callback действие
     */
    let bindPaymentActionToButton = function($button, callback) {
        $button.on('click', function(event) {
            event.preventDefault();
            callback($button);
        });
    };

    /**
     * Возвращает кнопку подтверждения платежа
     * @returns {*|jQuery|HTMLElement}
     */
    let getApprovePaymentButton = function() {
        return $('#payment-approve');
    };

    /**
     * Возвращает кнопку отмены платежа
     * @returns {*|jQuery|HTMLElement}
     */
    let getCancelPaymentButton = function() {
        return $('#payment-cancel');
    };

    /**
     * Возвращает кнопку возврата средств по платежу
     * @returns {*|jQuery|HTMLElement}
     */
    let getRefundPaymentButton = function() {
        return $('#payment-refund');
    };

    /**
     * Отправляет запрос на подтверждение платежа
     * @param {jQuery} $button кнопка
     */
    let approvePayment = function($button) {
        callOnConfirm(
            getLabel('js-label-payment-approve-confirmation-header'),
            getLabel('js-label-payment-approve-confirmation-content'),
            getLabel('js-label-payment-confirmation-approve'),
            function() {
                sendRequest($button, REQUEST_APPROVE_PAYMENT_METHOD);
        });
    };

    /**
     * Отправляет запрос на отмену платежа
     * @param {jQuery} $button кнопка
     */
    let cancelPayment = function($button) {
        callOnConfirm(
            getLabel('js-label-payment-cancel-confirmation-header'),
            getLabel('js-label-payment-cancel-confirmation-content'),
            getLabel('js-label-payment-confirmation-cancel'),
            function() {
                sendRequest($button, REQUEST_CANCEL_PAYMENT_METHOD);
        });
    };

    /**
     * Отправляет запрос на возврат средств по платежу
     * @param {jQuery} $button кнопка
     */
    let refundPayment = function($button) {
        callOnConfirm(
            getLabel('js-label-payment-refund-confirmation-header'),
            getLabel('js-label-payment-refund-confirmation-content'),
            getLabel('js-label-payment-confirmation-refund'),
            function() {
                sendRequest($button, REQUEST_REFUND_PAYMENT_METHOD);
        });
    };

    /**
     * Вызывает функцию при подтверждении
     * @param {String} header заголовок окна
     * @param {String} content текст окна
     * @param {String} confirm текст кнопки подтверждения
     * @param {Function} callback функция обратного вызова
     */
    let callOnConfirm = function(header, content, confirm, callback) {
        showConfirmationForm(header, content, confirm,function() {
            callback();
        });
    }

    /**
     * Показывает окно подтверждения
     * @param {String} header заголовок окна
     * @param {String} content текст окна
     * @param {String} confirm текст кнопки подтверждения
     * @param {Function} callback функция обратного вызова
     */
    let showConfirmationForm = function(header, content, confirm, callback) {
        openDialog('', header, {
            html: content,
            confirmText: confirm,
            cancelButton: true,
            cancelText: getLabel('js-label-payment-confirmation-close'),
            confirmCallback: function (dialogName) {
                callback();
                closeDialog(dialogName);
            }
        });
    };

    /**
     * Отправляет запрос на изменение платежа
     * @param {jQuery} $button кнопка
     * @param {String} method метод бекенда
     */
    let sendRequest = function($button, method) {
        let requestParams = {
            type: 'POST',
            url: DefaultModule.getRequestUrl(MODULE_NAME, method),
            dataType: 'json',
            data: {
                'payment_id': $button.data('payment-id'),
                'order_id': window.object_id,
            }
        };

        DefaultModule.sendAjaxRequest(requestParams, function(response) {
            if (response.message) {
                DefaultModule.showMessage(response.message);
                return;
            }

            if (response.data && response.data.message) {
                DefaultModule.showMessage(response.data.message);
                let fiveSeconds = 5000;
                setTimeout(function() {
                    window.location.reload(true)
                }, fiveSeconds);
                return;
            }

            DefaultModule.showMessage(getLabel('js-server_error'));
        }, false);
    };

}(jQuery, window, DefaultModule));
