"use strict";

var jsonAjaxRequest = function jsonAjaxRequest(reqUrl, successFunction, sync, argJsonpname) {
    var jsonpName = argJsonpname || "callback";
    $.ajax({
	url: reqUrl
      , async: !sync
      , jsonp: jsonpName
      , dataType: "jsonp"
      , success: successFunction
    });
};

var getRandomWikiQuote = function() {
    var randomId;
    var successFunc = function(data) {
	randomId = data.query.random[0].id;
	jsonAjaxRequest(
	    "http://en.wikiquote.org/w/api.php?action=parse&format=json&pageid=" + randomId
	    ,function(data) {
	       var parsedText = $.parseHTML(data.parse.text["*"]);
	       var quotes = $("li",parsedText);
	       var randomElement = Math.round(Math.random() * quotes.length);
	       console.log($(quotes[randomElement]).text().replace(/^(.*?)[\.,:;-].*/, '$1'));
	   }
	);
    };
    jsonAjaxRequest(
	"http://en.wikiquote.org/w/api.php?action=query&format=json&list=random&rnlimit=1&rnnamespace=0"
      , successFunc
    );
};

var getRandomAlbum = function() {
    var selfData = {title: "TestTitle"};
    $.ajax({
	url:"http://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnlimit=1&rnnamespace=0&callback=?"
      , dataType: "jsonp"
      , async: false
      , success: function(data) {
	  selfData.band = data.query.random[0].id;
      }
    });
    $.ajax({
	url: "http://api.flickr.com/services/feeds/photos_public.gne?format=json"
      , dataType: "jsonp"
      , jsonp: "jsoncallback"
      , async: false
      , success: function(data) {
	  selfData.cover = data.items[5].media.m;
      }
    });
    getRandomWikiQuote();
    return selfData;
};

var Album = React.createClass({
    render: function() {
	return (
	    <div class="album">
	    <span class="cover"><img src="{this.props.imageSRC}"/></span>
	    <span class="band">{this.props.bandTitle} - {this.props.albumTitle}</span>
	    </div>
	);
    }
});

var AlbumList = React.createClass({
    fetchAlbum: function() {
	return getRandomAlbum();
    },
    getInitialState: function() {
	var firstAlbum = this.fetchAlbum();
	return { data: [firstAlbum] };
    },
    render: function() {
	var albumsNodes = this.state.data.map(function (album) {

	    return (
		<Album
		imageSRC="{album.cover}"
		bandTitle="{album.band}"
		albumTitle="{album.album}" />
	    );
	});
	return (
	    <div>
	    <div class="button">Generate album</div>
	    <div class="albumsList">{albumsNodes}</div>
	    </div>
	);
    }
});


$(document).ready(function () {
    React.render(
	<AlbumList />
    , document.body);
});
