// #Copyright (c) 2011 Alan Hamlett <alan.hamlett@gmail.com>
// #
// # Permission is hereby granted, free of charge, to any person obtaining a copy
// # of this software and associated documentation files (the "Software"), to deal
// # in the Software without restriction, including without limitation the rights
// # to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// # copies of the Software, and to permit persons to whom the Software is
// # furnished to do so, subject to the following conditions:
// #
// # The above copyright notice and this permission notice shall be included in
// # all copies or substantial portions of the Software.
// #
// # THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// # IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// # FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// # AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// # LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// # OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// # THE SOFTWARE.

(function( window, $, undefined ) {

    var VERSION = '1.0';

    // Private methods
    var busy = false;

    var picasagallery_load_albums = function() {
        if(busy)
            return;
        busy = true;

        var data = this.data('picasagallery'); // original options passed to picasagallery()
        if(!data)
            data = $(this).parent().data('picasagallery');

        // restore album list from hidden div if exists
        if(data.loaded) {
            this.children('div:last').html('<div class="loader"><div class="innerLoader"></div></div>').hide();
            this.children('span[class="picasagallery_title"]:first').html('');
            this.children('div:first').show();
            busy = false;
            return;
        }

        var protocol = document.location.protocol == 'http:' ? 'http:' : 'https:';
        var url    = protocol + '//picasaweb.google.com/data/feed/api/user/' + data.username + '?kind=album&access=public&alt=json';

        // print loading message
        this.html('<div class="loader"><div class="innerLoader"></div></div>');

        // make ajax call to get public picasaweb albums
        $.getJSON(url, 'callback=?', $.proxy(function(json) {

            // initialize album html content
            this.html("<span class='picasagallery_header' onclick=\"javascript: _gaq.push(['_trackPageview', 'Albums']);\" role='link'>&larr;</span><span class='picasagallery_title'></span><div id='album_wrap'></div><div id='image_wrap'></div>");
            this.children('span.picasagallery_header, span.picasagallery_title').hide();
            this.children('div:last').hide();
            this.children('span[class="picasagallery_header"]:first').click($.proxy(picasagallery_load_albums, this));

            // loop through albums
            for(var i = 0; i < json.feed.entry.length; i++) {
                var album_title = htmlencode(json.feed.entry[i].title.$t);
                var album_link = '#';
                for(var j = 0; j < json.feed.entry[i].link.length; j++) {
                    if (json.feed.entry[i].link[j].type == 'text/html')
                        album_link = htmlencode(json.feed.entry[i].link[j].href);
                }

                // skip this album if in hide_albums array
                if($.inArray(album_title, data.hide_albums) > -1) {
                    continue;
                }

                // get album thumbnail
                var img_src = json.feed.entry[i].media$group.media$content[0].url.split('/');
                var img_filename = img_src.pop();
                var img_src = img_src.join('/');

                // append html for this album
                this.children('div:first').append(
                    "<div class='picasagallery_album' onclick=\"javascript: _gaq.push(['_trackPageview', 'Album/"+album_title+"']);\" style='background-image: url(" +
                    img_src + '/s' + data.thumbnail_width + ( data.thumbnail_cropped ? '-c' : '' ) + '/' + img_filename +
                    ")'><img src='" +
                    img_src + '/s' + data.thumbnail_width + ( data.thumbnail_cropped ? '-c' : '' ) + '/' + img_filename +
                    "' alt='" + json.feed.entry[i].gphoto$name.$t + "' title='" + album_title +
                    "' style='display:none;'/><strong>" + album_title + "</strong><em>" +
                    json.feed.entry[i].gphoto$numphotos.$t +
                    ' photos' +
                    ( data.link_to_picasa ? '<a href="'+album_link+'" title="View Album on Picasa" style="position:relative;margin-left:6px;" target="_blank"><img src="chain-icon.gif" alt="chain-icon" style="margin:0;top:4px;position:relative;"/></a>' : '') +
                    '</em></div>'
                ).children('div:last').data('album', json.feed.entry[i].gphoto$name.$t).click(picasagallery_load_album);
            }

            // append blank div to resize parent elements
            this.children('div:first').append('<div style="clear:both"></div>');

            data.loaded = true;
            busy = false;
        }, this));
    };

    var picasagallery_load_album = function() {
        if(busy)
            return;
        busy = true;

        var dom = $('.picasagallery');
        var data = dom.data('picasagallery'); // original options passed to picasagallery()
        var album = $(this).data('album');
        var protocol = document.location.protocol == 'http:' ? 'http:' : 'https:';
        var url = protocol + '//picasaweb.google.com/data/feed/api/user/' + data.username + '/album/' + album + '?kind=photo&alt=json';

        // initialize album html content
        dom.children('div:last').html('<div class="loader"><div class="innerLoader"></div></div>').show();
        dom.children('div:first').hide();

        // make ajax call to get album's images
        $.getJSON(url, 'callback=?', $.proxy(function(json) {

            // set album's title
            var album_header = dom.children('span[class="picasagallery_title"]:first').html('<span class="picasagallery_album_name">' + json.feed.title.$t + '</span>').hide();
            if (data.inline)
                album_header.find('span:last').wrap("<a onclick=\"javascript: _gaq.push(['_trackPageview', '"+json.feed.title.$t+"']);\" href='#'></a>").parent().data('album', album).click(function(e) {
                    if (!e)
                        e = window.event;
                    if (e.preventDefault)
                        e.preventDefault();
                    else
                        e.returnValue = false;
                    picasagallery_load_album.apply(this);
                    return false;
                });

            // reset album html
            dom.children('div:last').html('');
            dom.children('span.picasagallery_header, span.picasagallery_title').show();

            // loop through album's images
            for(i = 0; i < json.feed.entry.length; i++) {

                // get image properties
                var summary = htmlencode(json.feed.entry[i].summary.$t);
                var img_src = json.feed.entry[i].content.src.split('/');
                var img_filename = img_src.pop();
                var img_src = img_src.join('/');
                var screen_width = $(window).width();
                // add html for this image
                var html = "<a rel='picasagallery_thumbnail' class='picasagallery_thumbnail' onclick=\"javascript: _gaq.push(['_trackPageview', '"+json.feed.title.$t+"/"+img_filename+"']);\" href='" +
                           img_src + '/s' + screen_width + '/' + img_filename +
                           "' title='" +
                           summary +
                           "'><img src='" +
                           img_src + '/s' + data.thumbnail_width + ( data.thumbnail_cropped ? '-c' : '' ) + '/' + img_filename +
                           "' alt='" +
                           summary +
                           "' title='" +
                           summary +
                           "'/></a>"
                ;
                dom.children('div:last').append(html);
            }

            // append blank div to resize parent elements
            dom.children('div:last')
            .append('<span id="googleAd" class="picasagallery_thumbnail gAd"></span>')
            .append('<div id="clear" style="clear:both"></div>');


            // setup fancybox to show larger images
            $("a[rel=picasagallery_thumbnail]").click(function(e) {
                if (!e)
                    e = window.event;
                if (e.preventDefault)
                    e.preventDefault();
                else
                    e.returnValue = false;
                //dom.children('div:last').html('<img data-kuzya="Pics" src="'+ $(this).prop('href') +'" />');
                dom.children('#image_wrap').html('<span role="image" id="image" style="background-image:url('+ $(this).prop('href') +')" />');
                dom.children('span.picasagallery_header').hide();
                dom.children('span.picasagallery_title').show().find(".picasagallery_album_name").html('&larr;');
                return false;
            });

            // setup fancybox to show larger images
            $("span.picasagallery_header").click(function(e) {
                if (!e)
                    e = window.event;
                if (e.preventDefault)
                    e.preventDefault();
                else
                    e.returnValue = false;
                $(this).hide();
                $(".picasagallery_title").hide();
                return false;
            });

            var googleAds = function() {
              // ugly global vars :-P
              window.google_ad_client = "ca-pub-9651184030086049";
              window.google_ad_slot = "8225907609";
              window.google_ad_width = 300;
              window.google_ad_height = 250;
              // inject script, bypassing same-source
              var container = document.getElementById("googleAd");
                var w = document.write;
                document.write = function (content) {
                    container.innerHTML = content;
                    document.write = w;
                };

              var script = document.createElement('script');
              script.type = 'text/javascript';
              script.src = 'http://pagead2.googlesyndication.com/pagead/show_ads.js';
              document.body.appendChild(script);
              //target.appendChild(script);
              console.log('fired google ad');
            }

            googleAds();



            busy = false;
        }, this));
    };

    var htmlencode = function(str) {
        while(str.search("'") + str.search('"') + str.search("<") + str.search(">") > -4) {
            str = str.replace("'","&#39;").replace('"', "&#34;").replace("<","&lt;").replace(">","&gt;");
        }
        return str;
    }

    var picasagallery_error = function(msg) {
        if (typeof console === "undefined" || typeof console.error === "undefined") {
            if( typeof console.log === "undefined" ) {
                alert('Picasa Gallery Error: ' + msg);
            } else {
                console.log('Picasa Gallery Error: ' + msg);
            }
        } else {
            console.error('Picasa Gallery Error: ' + msg);
        }
    }

    // Public method
    $.fn.picasagallery = function(options) {
        this.data('picasagallery', $.extend({
            'username': '',
            'hide_albums': ['Profile Photos', 'Scrapbook Photos', 'Instant Upload', 'Photos from posts'],
            'link_to_picasa': false,
            'thumbnail_width': '160',
            'thumbnail_cropped': true,
            'title': 'Photos',
            'inline': false,
            'loaded': false
        }, options));
        if (this.data('picasagallery') === undefined) {
            picasagallery_error('Cannot call method \'picasagallery\' of undefined. Must be called on a jQuery DOM object.');
            return;
        }
        if (!this.data('picasagallery').username) {
            picasagallery_error('Missing username.');
            return;
        }
        this.addClass('picasagallery');
        picasagallery_load_albums.apply(this);
        return this;
    };

}) ( window, jQuery );
