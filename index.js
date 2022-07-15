require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser'); //to get form input with name field
const https = require('https');
const fs = require('fs');

const app = express();

app.use(express.static('public/css')) //to use css file //don't put ;

app.use(bodyParser.urlencoded({extended : true})); //to use body parser

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post("/", function(req, res) {
    const query = req.body.cityName;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${process.env.APPID}`;

    https.get(url, async function(response) {
        console.log(response.statusCode);

        response.on("data", function(data) {
            const weatherData = await JSON.parse(data) //to get data as object
            const temp = await weatherData.main.temp; //to select specific data from object
            const weatherDescription = await weatherData.weather[0].description;
            const weatherIcon = await weatherData.weather[0].icon;
            const imageUrl = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
            fs.readFile(__dirname + '/output.html', function(err, data) {
                res.writeHead(200, {'Content-Type' : 'text/html'});
                res.write(data);
                res.write("<p>The weather is currently " + weatherDescription + "</p>");
                res.write("<img src=" + imageUrl + ">");
                res.write("<h1>The temperature in " + query + " is " + temp + "degrees Celcius.</h1>");
                res.send();
            });
        });
    });
});

const port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log(`Server is running on port: ${port}`);
});