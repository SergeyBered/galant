(function($, admin) {
    $(function() {
        if (typeof admin.tickets != 'object') {
            return;
        }

        var cssList = [
            '/styles/common/js/cms/panel/design.css',
            '/styles/common/js/jquery/ui.resizable.css',
            '/styles/common/js/jquery/ui.dialog.css'
        ];

        cssList.forEach(function(path){
            $('head').append('<link rel="stylesheet" type="text/css" href="' + path + '">');
        });

        var panelUrl = '/admin/content/frontendPanel/.json?r=' + Math.random();
        $.ajax({
            url: panelUrl,
            dataType: 'json',
            success: function(response) {
                if (typeof response.tickets != 'undefined' && typeof admin.tickets == 'object') {
                    admin.tickets.draw(response);
                    admin.tickets.enable();
                }
            }
        });
});

})(jQuery, uAdmin);