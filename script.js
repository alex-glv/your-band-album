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
	  onDone(randomTitle);
      });
};

var getRandomFlickrImage = function(onDone) {
    jsonAjaxRequest("http://api.flickr.com/services/feeds/photos_public.gne?format=json"
		    , function(data) {
			var randomImage = data.items[5].media.m;
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
    getInitialState: function() {
	return {
	    loading: true,
	    band: null,
	    title: null,
	    cover: null
	};
    }
    , componentDidMount: function() {
	this.fetch();
    }
    , fetch: function() {
	getRandomWikiTitle(function (band) { 
	    this.setState({band: band});
	    this.isLoaded();
	}.bind(this));
	
	getRandomWikiQuote(function (title) { 
	    this.setState({title: title});
	    this.isLoaded();
	}.bind(this));

	getRandomFlickrImage(function (cover) { 
	    this.setState({cover: cover});
	    this.isLoaded();
	}.bind(this));
    }
    , isLoaded: function() {
	if (this.state.title !== null && this.state.band !== null && this.state.cover !== null) {
	    this.setState({ loading: false });
	} else {
	    this.setState({ loading: true });
	}
    }
    , render: function() {
	if (this.state.loading) {
	    return (
		    <div className='album'>
		    <div className='loading'>Loading...</div>
		    </div>
	    );
	} else {
	    return (
		    <div className='album'>
		    <span className='band'>{this.state.band}</span>
		    <span className='cover'><img src={this.state.cover} /></span>
		    <p className='title'>{this.state.title}</p>
		    </div>
	    );
	}
    }
});

var AlbumList = React.createClass({
    getInitialState: function() {
	return { albums: [{}] }
    }
    , getMore: function() {
	var albums = this.state.albums;
	albums.push({});
	this.setState({albums: albums});
    }
    , render: function() {
	var albums = this.state.albums.map(function (album) {
	    return <Album />;
	});
	
	return (
		<div>
		<button onClick={this.getMore}>More!</button>
		<div className="albumsList">{albums}</div>
		</div>
	);
    }
});

$(document).ready(function () {
    React.render(
	    <AlbumList/>
	    , document.body);
});
