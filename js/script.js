////////////////////////////////////////////////////////////////////////////////
// ON DOM READY
////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {

	// PICASA
	////////////////////////
	$('#galleries').picasagallery({username:'secretGspot', inline: true});

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
// FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

// CURTAINS
////////////////////////
function Curtains() {
    var isOpen = false;

    this.open = function () {
    	if ( isOpen == false ) {
    		console.log( "opening curtains");
    		$(".left").stop().animate({width:'0px'}, 0.1 ).addClass("open");
    		$(".right").stop().animate({width:'0px'}, 0.1 ).addClass("open");
    		$(".logo").addClass("open");

    		isOpen = true;
    		console.log( "curtains opened");
    		// send analytics
    		_gaq.push(['_trackEvent', 'Curtains', 'opened']);
    	}
    },
    this.close = function () {
    	console.log( "closing curtains" );
    	$(".left").stop().animate({width:'50%'}, 0.1 ).removeClass("open");
    	$(".right").stop().animate({width:'50%'}, 0.1 ).removeClass("open");
    	$(".logo").removeClass("open");

    	isOpen = false;
    	console.log( "curtains closed");
  		// send analytics
  		_gaq.push(['_trackEvent', 'Curtains', 'closed']);
    },
    this.status = function () { console.log( "Curtain open? " + isOpen ) }
}
