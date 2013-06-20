/**************************************************************************
 * Name:   EmbedPicasaGallery
 * Author: Tobias Oetiker <tobi@oetiker.ch>
 * Demo:   http://tobi.oetiker.ch/photo/
 * $Id$
 **************************************************************************
 Description:

 This little script asks picasa web for a list of albums and for a list
 of pictures in the album. It then emits a series of <div class="pic-thumb"/>
 elements containing thumbnail images. The divs are inserted inside the element
 marked with a particular id. Clicking on an album will display thumbnails of the
 images in the album and clicking on a thumbnail will show the image itself
 using slimbox.

 The script itself uses jQuery (http://www.jquery.org) and slimbox2
 (http://www.digitalia.be/software/slimbox2) to work. So you have to load
 these two guys before loading the gallery script. You can load them in the
 header or the body of the document, this does not matter.

  <script type="text/javascript" src="js/jquery.js"></script>
  <link rel="stylesheet" href="css/slimbox2.css" type="text/css" media="screen" />
  <script type="text/javascript" src="slimbox2.js"></script>
  <script type="text/javascript" src="js/jquery.EmbedPicasaGallery.js"></script>

 Once loaded, call the picasaGallery function. This activates the
 code. With the id argument you tell it, where to put the gallery.

  <script type="text/javascript">
  jQuery(document).ready(function() {
  jQuery("#images").EmbedPicasaGallery('oetiker',{
      matcher:            /./,         // string or regexp to match album title
      size:               72,        // thumbnail size (32, 48, 64, 72, 144, 160)
      authkey :           'optional-picasa-authkey',
      albumid :           'go-directly-to-this-album-ignore-matcher',
      thumb_class: 'zoomTarget',
      loading_animation: 'css/loading.gif'
   });
  });
  </script>

 Finally inside the document, add a div tag with the id set to the name
 chosen above.

 <div id="images"></div>

**********************************************************************************/

(function($) {
    // setup a namespace for us
    var nsp = 'EmbedPicasaGallery', authkey;

    // Private Variables and Functions in the _ object
    // note that this will refer to _ unless you
    // call using the call or apply methods

    // Public Variables and Methods
    $[nsp] = {
        defaultOptions: {
            matcher : RegExp('.+'),
            size    : 72,
            thumb_class: 'zoomTarget',
            loading_animation: null
        }
    };
    $.fn[nsp] = function(user,opts) {
        var localOpts,
            Cache = {};

        localOpts = $.extend(
            {}, // start with an empty map
            $[nsp].defaultOptions, // add defaults
            opts // add options
        );

        function showOverview() {
            var $this,
                meta_opts,
                authkey = '';

            if ( Cache.__overview ){
                 Cache.__overview.show();
                 return;
            }
            $this = $(this);
            $this.empty();
            meta_opts = localOpts;
            if ($.meta){
                meta_opts = $.extend({}, localOpts, $this.data());
            }

            if (meta_opts.authkey){
                authkey = '&authkey=' + meta_opts.authkey;
            }

            if (meta_opts.albumid) {
                   showAlbum($this,meta_opts,meta_opts.albumid)
            }

        };

        function showAlbum($this,meta_opts,album,title){
            if ( Cache[album] ){
               Cache[album].show();
               return;
            };

            var i,$album,albumPics=[],$picDiv;

            $album = $('<div/>').addClass('album');

            function makeLoader(){
               var $div = $('<div/>');
               if (meta_opts.loading_animation){
                   $div.css('background','url(' + meta_opts.loading_animation + ') no-repeat center center');
               }
               return $div;
            }


            $this.append($album);


            function makeImage(i,item){
              var title = item.media$group.media$description.$t || item.media$group.media$title.$t;
              var $div = albumPics[i] || makeLoader();

              var $img = $('<img/>')
                .hide()
                .addClass("image")
                .load(function(){
                  $img.show();
                });

              var images = item.media$group.media$thumbnail;
              var gotOne = false;

              for (var i = 0; i<images.length;i++){
                  $img.attr("src", item.content.src);
                  gotOne = true;
                  break;
              }

              if (!gotOne){
                $img.attr("alt","Sorry, no found.");
              }

              var $figure = $("<figure/>")
                .attr("data-targetsize",1)
                .attr("data-closeclick",true)
                .attr("class", meta_opts.thumb_class + " figure" )
                .attr("title",title)
                .append($img);

              $div
                .attr("id", 'image_wrapper_' + item.gphoto$id.$t )
                .addClass("figure_wrap")
                .append($figure);

              return $div;
            }


            function renderAlbum(data){
                var images = data.feed.entry;
                var hiddenImages = [];
                for (var i=0;i<images.length;i++){
                    var $div = makeImage(i,images[i]);
                    $div.show();
                    $album.append($div);
                }
                //console.log(meta_opts.link_mapper);
                Cache[album] = $album;
            }
            authkey = '';
            if (meta_opts.authkey){
               authkey = '&authkey=' + meta_opts.authkey;
            }
            $.getJSON('http://picasaweb.google.com/data/feed/api/user/'
                + user + '/albumid/'
                + album + '?kind=photo&access=visible' + authkey + '&alt=json-in-script&thumbsize='+meta_opts.size+'c&imgmax=800&callback=?',
                renderAlbum
            );
        };

        return this.each(showOverview);
    };
})(jQuery);
