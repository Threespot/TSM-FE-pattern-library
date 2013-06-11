$(window).load(function() {
    var toggleStr = '<div class="btn-toggle" data-orientation="stacked"><button name="toggle">Toggle Orientation</button></div>';
    var $form = $("form");
    
    $form.before($(toggleStr));
    var $btnToggle = $('.btn-toggle');
    $btnToggle.click(function(evt) {
        evt.preventDefault();
        var $btn = $(this);
        var $orientation = $btn.data('orientation');
        if( $orientation == 'adjacent' ) {
            $btn.data('orientation','stacked');
            $form.removeClass('stacked').addClass('adjacent');
        }
        else {
            $btn.data('orientation','adjacent');
            $form.removeClass('adjacent').addClass('stacked');
        }
    });
});
