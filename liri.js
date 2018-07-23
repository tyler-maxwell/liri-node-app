// Require statements
require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");

// Get keys for Spotify and Twitter
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Get node arguments
var nodeArgs = process.argv;
nodeArgs.splice(0,2);
var command = nodeArgs[0];

var myTweets = function() {
    var params = {screen_name: 'TylerMa92237717'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            var output = "";
            tweets.forEach(element => {
                output += `${element.text}\n`;
            });
            output += "--------------------\n";
            console.log("\n--------------------");
            console.log(output);
        }

        // Append to log.txt
        fs.appendFile("log.txt", output, function(err) {
            if (err) {
              console.log(err);
            }
        });
    });
};

var spotifyThisSong = function(song) {
    // Send Spotify request
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        // Get data
        var topMatch = data.tracks.items[0];
        var artists = "";
        for (var i = 0; i < topMatch.artists.length; i++) {
            if (artists === "") {
                artists = topMatch.artists[i].name;
            } else {
                artists += `, ${topMatch.artists[i].name}`;
            };
        };
        var track = topMatch.name;
        var spotifyURL = topMatch.external_urls.spotify;
        var album = topMatch.album.name;

        // Log Data
        var output = "";
        output += `Artist(s): ${artists}`;
        output += `\nSong Name: ${track}`;
        output += `\nSpotify Link: ${spotifyURL}`;
        output += `\nAlbum: ${album}`;
        output += "\n--------------------\n";
        console.log("\n--------------------");
        console.log(output);

        // Append to log.txt
        fs.appendFile("log.txt", output, function(err) {
            if (err) {
              console.log(err);
            }
        });
    });
};

var movieThis = function(movie) {
    // Send OMDB request
    var queryUrl = `http://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=trilogy`;
    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            // Log Data
            var output = "";
            output += `Title: ${JSON.parse(body).Title}`;
            output += `\nRelease Year: ${JSON.parse(body).Year}`;
            for (var i = 0; i < JSON.parse(body).Ratings.length; i++) {
                if (JSON.parse(body).Ratings[i].Source === "Internet Movie Database") {
                    output += `\nIMDB Rating: ${JSON.parse(body).Ratings[i].Value}`;
                } else if (JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
                    output += `\nRotten Tomatoes Rating: ${JSON.parse(body).Ratings[i].Value}`;
                };
            }
            output += `\nCountry: ${JSON.parse(body).Country}`;
            output += `\nLanguage: ${JSON.parse(body).Language}`;
            output += `\nPlot: ${JSON.parse(body).Plot}`;
            output += `\nActors: ${JSON.parse(body).Actors}`;
            output += "\n--------------------\n";
            console.log("\n--------------------");
            console.log(output);

            // Append to log.txt
            fs.appendFile("log.txt", output, function(err) {
                if (err) {
                console.log(err);
                }
            });
        }
    });
};

// Twitter
if (command === "my-tweets") {
    myTweets();
}
// Spotify
else if (command === "spotify-this-song") {
    // Get song from node arguments
    var song = "";
    if (nodeArgs[1] === undefined) {
        console.log("No song entered.")
    } else {
        for (var i = 1; i < nodeArgs.length; i++) {
            if (i > 1 && i < nodeArgs.length) {
                song = song + " " + nodeArgs[i];
            } else {
                song = nodeArgs[i];
            };
        };
    };
    spotifyThisSong(song);
} 
// OMDB
else if (command === "movie-this") {
    // Get movie from node arguments
    var movie = "";
    if (nodeArgs[1] === undefined) {
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
    movieThis(movie);
} 
// Default Spotify from random.txt
else if (command === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }

        var dataArr = data.split(",");
        console.log(dataArr);

        if (dataArr[0] === "my-tweets") {
            myTweets();
        } else if (dataArr[0] === "spotify-this-song") {
            if (dataArr[1] === undefined) {
                console.log("No song entered.")
            } else {
                spotifyThisSong(dataArr[1]);
            };
        } else if (dataArr[0] === "movie-this") {
            if (dataArr[1] === undefined) {
                console.log("No movie entered.")
            } else {
                movieThis(dataArr[1]);
            };
        } else {
            console.log("Invalid command.");
        };
    });
};