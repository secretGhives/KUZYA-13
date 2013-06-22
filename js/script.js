////////////////////////////////////////////////////////////////////////////////
// ON DOM READY
////////////////////////////////////////////////////////////////////////////////

$(document).ready(function() {

	// CURTAINS
	////////////////////////
	$curtainOpen = false;

	$(".logo").click(function() {

		$(this).blur();

		if ( $curtainOpen == false ) {

			$(".left").stop().animate({width:'0px'}, 0.1 ).addClass("open");
			$(".right").stop().animate({width:'0px'}, 0.1 ).addClass("open");
			$(this).stop().addClass("open");
			$("#social-links, #sublogo").addClass('hide');

			$curtainOpen = true;

		} else {

			//$(this).stop().animate({background: '#0f0'}, {queue:false, duration:333});
			$(".left").stop().animate({width:'50%'}, 0.1 ).removeClass("open");
			$(".right").stop().animate({width:'50%'}, 0.1 ).removeClass("open");
			$(this).stop().removeClass("open");
			$("#social-links, #sublogo").removeClass('hide');

			$curtainOpen = false;

		}

		return false;

	});



	// PICASA
	////////////////////////
	$('#galleries').picasagallery({username:'secretGspot', inline: true});

	// jQuery("#digitals").EmbedPicasaGallery('secretGspot',{
	// 	albumid: "5520358457052524865",
	// 	size: 160, // thumb size (32,48,64,72,144,160))
	// 	loading_animation: "/img/loading.gif"
	//  });

	// jQuery("#studies").EmbedPicasaGallery('secretGspot',{
	// 	albumid: "5520358863500743169",
	// 	size: 160, // thumb size (32,48,64,72,144,160))
	// 	loading_animation: "/img/loading.gif"
	//  });

	// jQuery("#traditional").EmbedPicasaGallery('secretGspot',{
	// 	albumid: "5858417312742104513",
	// 	size: 160, // thumb size (32,48,64,72,144,160))
	// 	loading_animation: "/img/loading.gif"
	//  });



});

$(window).load(function() {

	$('.picasagallery_album').click(function() {
		$(".logo").addClass('hide');
	});

	$('.picasagallery_header').click(function() {
		$(".logo").removeClass('hide');
	});

	$('.picasagallery_header').html("");

});
