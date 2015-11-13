// Self envoking function! once the document is ready, bootstrap our application.
// We do this to make sure that all the HTML is rendered before we do things 
// like attach event listeners and any dom manipulation.  
(function(){
  $(document).ready(function(){
    bootstrapSpotifySearch();
  });
})();

/**
  This function bootstraps the spotify request functionality.
*/
function bootstrapSpotifySearch(){

  var userInput, searchUrl, results;
  var outputArea = $("#q-results");

  $('#spotify-q-button').on("click", function(){
      var spotifyQueryRequest;
      spotifyQueryString = $('#spotify-q').val();
      searchUrl = "https://api.spotify.com/v1/search?type=artist&q=" + spotifyQueryString+'&limit=4';

      // Generate the request object
      spotifyQueryRequest = $.ajax({
          type: "GET",
          dataType: 'json',
          url: searchUrl
      });

      // Attach the callback for success 
      // (We could have used the success callback directly)
      spotifyQueryRequest.done(function (data) {
        var artists = data.artists;

        // Clear the output area
        outputArea.html('');

        // The spotify API sends back an arrat 'items' 
        // Which contains the first 20 matching elements.
        // In our case they are artists.
        artists.items.forEach(function(artist){
          var artistLi = $("<li><b>" + artist.name + "</b> - " + artist.id + "</li>");
          artistLi.attr('data-spotify-id', artist.id);
          outputArea.append(artistLi);

          artistLi.click(displayAlbumsAndTracks);
        });
      });

      // Attach the callback for failure 
      // (Again, we could have used the error callback direcetly)
      spotifyQueryRequest.fail(function (error) {
        console.log("Something Failed During Spotify Q Request:");
        console.log(error);
      });
  });
}

//helper stuff

/* COMPLETE THIS FUNCTION! */
function displayAlbumsAndTracks(event) {
  var appendToMe = $('#albums-and-tracks');
  var artistID = $(this).attr('data-spotify-id'); //changed 'event.target' to 'this' to fix bug introduced by <b> tag
  console.log(artistID); //artistID is sometimes undefined
  var albumsRequest;
  albumsRequest = $.ajax({
    type:'GET',
    dataType:'json',
    url: 'https://api.spotify.com/v1/artists/'+artistID+'/albums?limit=4'
  });

  albumsRequest.done(function(data){
    appendToMe.html('');

    data.items.forEach(function(album){
      var albumLi = $('<li><b>' + album.name + '</b></li>');
      var releaseDateRequest = $.ajax({
        type:'GET',
        dataType:'json',
        url:'https://api.spotify.com/v1/albums/'+album.id
      });

      releaseDateRequest.done(function(data){
        albumLi.append(' released on ' + data.release_date + '<ul id="'+data.id+'"></ul>');
        appendToMe.append(albumLi);
        //data is the album object with id string identifying the album and tracks object (with an items array containing track objects with names)
        data.tracks.items.forEach(function(track){
          var appendTrackHere = $('#'+data.id);
          appendTrackHere.append('<li>'+track.name+'</li>');
        });

      });

    });
  }); // albumsRequest.done()

}


/*
var helper = {};
helper.appendTrack = function(track){
  var appendTrackHere = $('#'+data.id);
  appendTrackHere.append('<li>'+track.name+'</li>');
  console.log(data);
};
*/




/* YOU MAY WANT TO CREATE HELPER FUNCTIONS OF YOUR OWN */
/* THEN CALL THEM OR REFERENCE THEM FROM displayAlbumsAndTracks */
/* THATS PERFECTLY FINE, CREATE AS MANY AS YOU'D LIKE */

//JUNKYARD

// function doReleaseDateRequest(input){
//   var releaseDateRequest = $.ajax({
//     type:'GET',
//     dataType:'json',
//     url:'https://api.spotify.com/v1/albums/'+input
//   });
//   releaseDateRequest.done(function(data){
//     //console.log(data.release_date);
//     return data.release_date;
//   });
// }

/*partiall working but too complicated 
function displayAlbumsAndTracks(event) {
  var appendToMe = $('#albums-and-tracks');
  //console.log($(event.target).attr('data-spotify-id'));//.attr('data-spotify-id'));
  var artistID = $(event.target).attr('data-spotify-id');
  var albumsRequest;
  albumsRequest = $.ajax({
    type:'GET',
    dataType:'json',
    url: 'https://api.spotify.com/v1/artists/'+artistID+'/albums?limit=4'
  });
  //var albumIdList = [];
  var albumIdSearch = 'https://api.spotify.com/v1/albums?ids=';
  albumsRequest.done(function(data){
    appendToMe.html('');
    data.items.forEach(function(album){
      //albumIdList.push(album.id);
      if (albumIdSearch.length === 38) {
        albumIdSearch += album.id;
      } else {
        albumIdSearch = albumIdSearch + ',' + album.id;
      }
      //albumIdSearch += album.id;
      var albumLi = $('<li>' + album.name +'</li>');
      albumLi.attr('albumId',album.id);
      //artistLi.attr('')
      appendToMe.append(albumLi);
    });
    //console.log(albumIdList);
    //albumIdList.forEach(function(x){console.log(x);});
    console.log(albumIdSearch);
    var albumsInfoRequest;
    albumsInfoRequest = $.ajax({
      type:'GET',
      dataType:'json',
      url:albumIdSearch
    });
    albumsInfoRequest.done(function(data){
      console.log(data);
      data.albums.forEach(function(uh){
        console.log(uh.release_date);
        
      });
    });
  });
}
*/