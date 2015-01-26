var getRandomAlbum = function() {
    var selfData = {title: "TestTitle"}
    $.getJSON("http://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnlimit=1&rnnamespace=0&callback=?",
	      {
		  async: false
	      },
	      function(data) {
		  selfData.band = data.query.random[0].title;
	      }
    );
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=?",
	      {
		  async: false
	      },
	      function(data) {
		  selfData.cover = data.items[5].media.m;
	      }
    );
    return selfData;
}

var Album = React.createClass({
    render: function() {
	return (
	    <div class="album">
	    <span class="cover"><img src="{this.props.imageSRC}"/></span>
	    <span class="band">{this.props.bandTitle} - {this.props.albumTitle}</span>
	    </div>
	)
    }
});

var AlbumList = React.createClass({
    fetchAlbum: function() {
	return getRandomAlbum();
    },
    getInitialState: function() {
	var firstAlbum = this.fetchAlbum();
	console.log("Calling fetch album!");
	console.log(firstAlbum)
	    
	return { data: [firstAlbum] };
    },
    render: function() {
	console.log("state");
	console.log(this.state.data);
	var albumsNodes = this.state.data.map(function (album) {
	    console.log("Album:");
	    console.log(album);
	    return (
		<Album
		imageSRC="{album.cover}"
		bandTitle="{album.band}"
		albumTitle="{album.album}" />
	    )
	});
	return (
	    <div>
	    <div class="button">Generate album</div>
	    <div class="albumsList">{albumsNodes}</div>
	    </div>
	)
    }
});


$(document).ready(function () {
    React.render(
	<AlbumList />
    , document.body);
});
