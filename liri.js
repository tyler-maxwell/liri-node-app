// Require statements
require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require('twitter');
// var Spotify = require('node-spotify-api');
var request = require('request');

// Get keys for Spotify and Twitter
// var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Get node arguments
var nodeArgs = process.argv;
nodeArgs.splice(0,2);
var command = nodeArgs[0];

// Twitter
if (command === "my-tweets") {
    var params = {screen_name: 'TylerMa92237717'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            tweets.forEach(element => {
                console.log(element.text);
            });
        }
    });
}
// Spotify
else if (command === "spotify-this-song") {

} 
// OMDB
else if (command === "movie-this") {
    // Get movie from node arguments
    var movie = "";
    if (process.argv[3] === undefined) {
        movie = "Mr. Nobody";
    } else {
        for (var i = 1; i < nodeArgs.length; i++) {
            if (i > 1 && i < nodeArgs.length) {
                movie = movie + "+" + nodeArgs[i];
            } else {
                movie += nodeArgs[i];
            };
        };
    };

    // Send OMDB request
    var queryUrl = `http://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=trilogy`;
    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("\n--------------------\n");
            console.log(`Title: ${JSON.parse(body).Title}`);
            console.log(`Release Year: ${JSON.parse(body).Year}`);
            for (var i = 0; i < JSON.parse(body).Ratings.length; i++) {
                if (JSON.parse(body).Ratings[i].Source === "Internet Movie Database") {
                    console.log(`IMDB Rating: ${JSON.parse(body).Ratings[i].Value}`);
                } else if (JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
                    console.log(`Rotten Tomatoes Rating: ${JSON.parse(body).Ratings[i].Value}`);
                }
            }
            console.log(`Country: ${JSON.parse(body).Country}`);
            console.log(`Language: ${JSON.parse(body).Language}`);
            console.log(`Plot: ${JSON.parse(body).Plot}`);
            console.log(`Actors: ${JSON.parse(body).Actors}`);
            console.log("\n--------------------\n");
        }
    });
} 
// Default Spotify from random.txt
else if (command === "do-what-it-says") {
    
};