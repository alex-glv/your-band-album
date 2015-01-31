"use strict";

var jsonAjaxRequest = function jsonAjaxRequest(reqUrl, successFunction, argJsonpname) {
    var jsonpName = argJsonpname || "callback";
    $.ajax({
	url: reqUrl
      , jsonp: jsonpName
      , dataType: "jsonp"
    }).done(successFunction);
};

var getRandomWikiTitle = function(onDone) {
    jsonAjaxRequest("http://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnlimit=1&rnnamespace=0"
      , function(data) {
	  var randomTitle = data.query.random[0].title;
	  console.log("Title: " + randomTitle);
	  onDone(randomTitle);
      });
};

var getRandomFlickrImage = function(onDone) {
    jsonAjaxRequest("http://api.flickr.com/services/feeds/photos_public.gne?format=json"
		    , function(data) {
			var randomImage = data.items[5].media.m;
			console.log("Rand title cover: " + randomImage);
			onDone(randomImage);
		    }
		    , "jsoncallback"
		   );
};

var getRandomWikiQuote = function(onDone) {
    var randomId;
    var randomQuote;
    var successFunc = function(data) {
	randomId = data.query.random[0].id;
	jsonAjaxRequest(
	    "http://en.wikiquote.org/w/api.php?action=parse&format=json&pageid=" + randomId
	    ,function(data) {
		var parsedText = $.parseHTML(data.parse.text["*"]);
		var quotes = $("li",parsedText);
		var randomElement = Math.round(Math.random() * quotes.length);
		var randomQuote = $(quotes[randomElement]).text().replace(/^(.*?)[\.,:;-].*/, '$1');
		console.log("Random quote is fetched: " + randomQuote);
		onDone(randomQuote);
	   }
	);
    };
    jsonAjaxRequest(
	"http://en.wikiquote.org/w/api.php?action=query&format=json&list=random&rnlimit=1&rnnamespace=0"
	, function(data) { successFunc(data); }
    );
};


var Album = React.createClass({
    render: function() {
	return (
	    <div className='album'>
	    <img src={this.props.cover} />
	    <span className='band'>{this.props.band} - {this.props.title}</span>
	    </div>
	);
    }
});

var AlbumList = React.createClass({
    render: function() {
	var albums = this.props.children.map(function (album) {
	    return ( <Album cover={album.cover} title={album.title} band={album.band} /> );
	});
	
	return (
		<div className="albumsList">{albums}</div>
	);
    }
});


var newAlbum = {};
var albums = [];

var pushAlbum = function(album) {
    if (album.title !== undefined && album.band !== undefined && album.cover !== undefined) {
	console.log("Pushing now:");
	console.log(album);
	albums.push(album);
	console.log(albums);

	React.render(
		<AlbumList>
		{albums}
		</AlbumList>
		, document.body);
    }
    return album;
};

$(document).ready(function () {
    getRandomWikiTitle(function (band) { newAlbum.band = band; pushAlbum(newAlbum); });
    getRandomWikiQuote(function (title) { newAlbum.title = title; pushAlbum(newAlbum); });
    getRandomFlickrImage(function (cover) { newAlbum.cover = cover; pushAlbum(newAlbum); });

});

// var albums = [{title: "Amauta (genus)", cover: "http://farm8.staticflickr.com/7346/16224197550_1790f5249c_m.jpg", band: "Band"}];
//  React.render(
//  	<Album cover="http://farm8.staticflickr.com/7346/16224197550_1790f5249c_m.jpg" title="test2" band="test3" />
//  	, document.body
// );
