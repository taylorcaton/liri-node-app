var param1 = process.argv[2];
var param2 = process.argv[3];
var keys = require("./keys.js");
var fs = require("fs");
var ora = require('ora');
var spinner = ora( {
    text:'Reticulating Splines...',
    spinner: {
        interval: 30, // optional 
        frames: ["◜", "◠", "◝",	"◞", "◡", "◟"]
    },
});

helloLiri(param1, param2);

function helloLiri(arg, arg2){
    switch (arg) {
    case "movie-this":
        
        spinnerFunc(true);
        var request = require("request");
        if(arg2 === undefined){
            arg2 = "Mr. Nobody";
        }
        // Run a request to the OMDB API with the movie specified
        request("http://www.omdbapi.com/?t="+arg2+"&y=&plot=short&apikey="+keys.omdbKeys.api_key, function(error, response, body) {

            // If the request is successful (i.e. if the response status code is 200)
            if (!error && response.statusCode === 200) {

                //check for Rotten Tomatoes Rating and store the index of the review
                var Ratings = JSON.parse(body).Ratings;
                if(Ratings === undefined){
                    console.log("\nNo Movie Found")
                    spinnerFunc(false);
                    return;
                }else{
                    var RotTomIndex = -1;
                    for (var i = 0; i < Ratings.length; i++) {
                        var source = Ratings[i].Source;
                        if(source === "Rotten Tomatoes"){
                            RotTomIndex = i;
                        }
                    }
                }
                
                var outputStr = "";
                // Parse the body of the site and recover just the imdbRating
                outputStr += "Title: \t\t" + JSON.parse(body).Title +"\n";
                outputStr += "Year : \t\t" + JSON.parse(body).Year +"\n";
                outputStr += "IMDB : \t\t" + JSON.parse(body).imdbRating +"\n";

                if(RotTomIndex === -1){
                    outputStr += "RotTom: \t" + "No Score" +"\n";
                }else{
                    outputStr += "RotTom: \t" + JSON.parse(body).Ratings[RotTomIndex].Value +"\n";
                }
                
                outputStr += "Country: \t" + JSON.parse(body).Country +"\n";
                outputStr += "Lang: \t\t" + JSON.parse(body).Language +"\n";              
                outputStr += "Rated: \t\t" + JSON.parse(body).Rated +"\n";
                outputStr += "Genre: \t\t" + JSON.parse(body).Genre +"\n";
                outputStr += "Plot : \t\t" + JSON.parse(body).Plot +"\n";
                outputStr += "Actors : \t\t" + JSON.parse(body).Actors +"\n";
            }else{
        
                console.log('Error occurred: ' + error);
                spinnerFunc(false);
                return; 
            
            }

            console.log("\n"+outputStr);
            date = new Date();
            writeToLog("\nTIME:\t\t"+date+"\nCMD:\t\t node liri.js movie-this "+arg2+"\n"+ outputStr);
            spinnerFunc(false);
        });

        break;
    
    case "my-tweets":
        spinnerFunc(true);
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
            var outputStr = "";

            if (!error) {
                var myTweets = tweets;
                var limit = 20;
                if(myTweets.length < 20){
                    limit = myTweets.length;
                }
                for (var i = 0; i < limit; i++) {
                    outputStr += myTweets[i].created_at + "\n";
                    outputStr += myTweets[i].text + "\n\n";
                }

                console.log(outputStr);
                date = new Date();
                writeToLog("\nTIME:\t"+date+"\nCMD:\t\t node liri.js my-tweets \n"+ outputStr);
                spinnerFunc(false);
            }else{
                console.log('Error occurred: ' + error);
                spinnerFunc(false);
                return; 
            }
        });

        break;
    
    case "spotify-this-song":
        
        spinnerFunc(true);
        var Spotify = require('node-spotify-api');
        
        if (arg2 == undefined){
            arg2 = "The Sign Ace of Base"
        }

        var spotify = new Spotify({
            id: keys.spotifyKeys.client_id,
            secret: keys.spotifyKeys.client_secret
        });
        
        spotify.search({ type: 'track', query: arg2, limit: 1 }, function(err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
                spinnerFunc(false);
                return;
            }
            var outputStr = "";
            var songData = data.tracks.items[0];
            outputStr += "Artist: \t" + songData.artists[0].name + "\n";
            outputStr += "Track: \t\t"+ songData.name + "\n";
            outputStr += "Album: \t\t" + songData.album.name + "\n";
            outputStr += "Link: \t\t" + songData.external_urls.spotify + "\n";

            console.log("\n"+outputStr);
            date = new Date();
            writeToLog("\nTIME:\t"+date+"\nCMD:\t\t node liri.js spotify-this-song "+arg2+"\n"+ outputStr);
            spinnerFunc(false);
        });
                

        break;

    case "do-what-it-says":

        data = ""+fs.readFileSync("random.txt");
        dataArr = data.split(",");
        helloLiri(dataArr[0], dataArr[1]);
        
        break;
    
    case "help":
        var chalk = require('chalk')
        console.log(chalk.yellowBright("movie-this [movie title]:")+ "displays movie info");
        console.log(chalk.yellowBright("my-tweets:")+" displays tweets from TaylorLiriBot");
        console.log(chalk.yellowBright("spotify-this-song [song title]:")+" displays song / album info");
        console.log(chalk.yellowBright("do-what-it-says:")+" show me BSB song info");
        break;

    default:
        var chalk = require('chalk');
        console.log(chalk.greenBright("type \'node liri help\' for a list of commands"))
        break;
    }
}

function writeToLog(input){

    fs.appendFile("log.txt", input, function(err){

        // If the code experiences any errors it will log the error to the console.
        if (err) {
            return console.log(err);
        }

        // Otherwise, it will print: "movies.txt was updated!"
        console.log("log.txt was updated!");

    })

}

function spinnerFunc(start){
    
    if(start){
        spinner.start();
    }else{
        spinner.succeed("Done!");
    }
    
}