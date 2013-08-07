////////////////////////////////////////////////////////////////////////////////
// ON DOM READY
////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {

	// PICASA
	////////////////////////
	$('#galleries').picasagallery({username:'secretGspot', inline: true});

    // CURSOR
    $('body').mousemove(function(e){
        var cursor = $('.cursor'),
            ancho = cursor.width() + 60,
            alto = cursor.height() - 100,
            W = ancho/2,
            H = alto/2,
            Y = (e.pageY - W),
            X = (e.pageX - H);
        cursor.css(
            'transform', 'translateY(' + Y + 'px) translateX(' + X + 'px)'
        );

    });

});



////////////////////////////////////////////////////////////////////////////////
// ON WINDOW LOAD
////////////////////////////////////////////////////////////////////////////////
$(window).load(function() {

	$('.picasagallery_album').click(function() {
		$(".logo").addClass('hide');
	});

	$('.picasagallery_header').click(function() {
		$(".logo").removeClass('hide');
	});

	// Start the show
	var curtains = new Curtains();
	curtains.open();

});


////////////////////////////////////////////////////////////////////////////////
// ON WINDOW UNLOAD
////////////////////////////////////////////////////////////////////////////////
$(window).bind('beforeunload', function() {
	// send analytics
	_gaq.push(['_trackEvent', 'User', 'Left the Building']);
});


////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

// CURTAINS
////////////////////////
function Curtains() {
    var isOpen = false;

    this.open = function () {
    	if ( isOpen == false ) {
    		console.log( "opening curtains");
    		$("#content").stop().delay(2000).animate({opacity:'1'}, 1 );
    		$(".logo").addClass("open");

    		isOpen = true;
    		console.log( "curtains opened");
    		// send analytics
    		_gaq.push(['_trackEvent', 'Curtains', 'opened']);
    	}
    },
    this.close = function () {
    	console.log( "closing curtains" );
    	$("#content").stop().animate({opacity:'0'}, 0.6 );
    	$(".logo").removeClass("open");

    	isOpen = false;
    	console.log( "curtains closed");
  		// send analytics
  		_gaq.push(['_trackEvent', 'Curtains', 'closed']);
    },
    this.status = function () { console.log( "Curtain open? " + isOpen ) }
}
