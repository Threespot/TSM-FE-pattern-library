/* Script for Tab Changing */
function MiniTabs( config ) {
    
    if( !$('html').hasClass('js') ) {
        $('html').addClass('js');
    }
    
    var config = {
        tabs : config.tabs || $('[role=tab]'),
        tabPanels : config.tabpanels || $('[role=tabpanel]'),
        selectedTab : config.selectedTab || ''
    }
    
    if ( config.tabs.length == 0 || config.tabPanels.length == 0 ) { return; }
    
    function clickTab( target, config ) {
        var tabContentHref = getTargetHref( target ),
            tab = '',
            tabpanel = '';
        
        resetSelected( config );
        if( $(target).is("LI") ) {
            tab = target;
        }
        else {
            tab = $(target).parent('LI');
        }
        
        tabpanel = '#' + $(tab).attr('aria-controls');
        
        $( tab ).addClass( 'selected' ).attr("aria-selected", "true");
        $( tabpanel ).addClass('selected').attr("aria-hidden", "false");

    }
    
    function getTargetHref( target ) {
        var tabContentHref = '';
        
        if( $(target).is("A") ) {
            tabContentHref = $(target).attr('href').split( '#' )[ 1 ];
        }
        else if( $(target).is("LI") ) {
            tabContentHref = "#" + $(target).attr('aria-controls');
        }
        return tabContentHref;
    }
    
    function resetSelected( config ) {
        $(config.tabs).removeClass('selected').attr('aria-selected', 'false');
        $(config.tabPanels).removeClass('selected').attr('aria-hidden', 'true');
    }
    
    if( config.selectedTab.length == 0 ) {
        config.tabs.eq(0).addClass( 'selected' ).attr('aria-selected', 'true');
        config.selectedTab = $( '[role=tab].selected' );
        clickTab( config.selectedTab.eq(0), config );
    }
    
    config.tabs.click( function() {
        clickTab( this, config );
        return false;
    });
    
}


$(document).ready(function() {
    var miniTab = new MiniTabs( config = {} );
});
