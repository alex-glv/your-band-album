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
	var selfData = {title: "TestTitle"}
	$.ajax({
	    url: "http://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnlimit=1&rnnamespace=0",
	    dataType: "jsonp",
	    crossDomain: true,
	    success: function(data) {
		selfData.band = data.query.random[0].title
	    },
	});
    },
    getInitialState: function() {
	var firstAlbum = this.fetchAlbum();
	console.log("Calling fetch album!")
	return { data: [firstAlbum] };
    },
    render: function() {
	var albumsNodes = this.state.data.map(function (album) {
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
