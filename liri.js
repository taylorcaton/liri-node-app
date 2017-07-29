var arg = process.argv[2];
var arg2 = process.argv[3];
var keys = require("./keys.js")

switch (arg) {
    case "movie-this":
        
        var request = require("request");

        // Run a request to the OMDB API with the movie specified
        request("http://www.omdbapi.com/?t="+arg2+"&y=&plot=short&apikey=40e9cece", function(error, response, body) {

            // If the request is successful (i.e. if the response status code is 200)
            if (!error && response.statusCode === 200) {

                // Parse the body of the site and recover just the imdbRating
                console.log("Title: \t" + JSON.parse(body).Title);
                console.log("Year : \t" + JSON.parse(body).Year);
                console.log("Rated: \t" + JSON.parse(body).Rated)
                console.log("Genre: \t" + JSON.parse(body).Genre);
                console.log("Plot : \t" + JSON.parse(body).Plot)
            }
        });

        break;
    
    case "my-tweets":
            var Twitter = require("twitter");

            var client = new Twitter({
                consumer_key: keys.twitterKeys.consumer_key,
                consumer_secret: keys.twitterKeys.consumer_secret,
                access_token_key: keys.twitterKeys.access_token_key,
                access_token_secret: keys.twitterKeys.access_token_secret
            });

            var params = {screen_name: 'TaylorLiri'};
            client.get('statuses/user_timeline', params, function(error, tweets, response) {
            
                // console.log(response);
                
                if (!error) {
                    var myTweets = tweets;
                    for (var i = 0; i < myTweets.length; i++) {
                        console.log(myTweets[i].created_at);
                        console.log(myTweets[i].text + "\n");
                    }
                }
            });

        break;
    
    case "spotify-this-song":
        
        var Spotify = require('node-spotify-api');
 
        var spotify = new Spotify({
            id: keys.spotifyKeys.client_id,
            secret: keys.spotifyKeys.client_secret
        });
        
        spotify.search({ type: 'track', query: arg2, limit: 1 }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        
        var songData = data.tracks.items[0];
        console.log("Artist: \t" + songData.artists[0].name);
        console.log("Track: \t\t"+ songData.name);
        console.log("Album: \t\t" + songData.album.name)
        console.log("Link: \t\t" + songData.external_urls.spotify);

        });
                

    break;

    
    default:
    break;
}