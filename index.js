require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser'); //to get form input with name field
const https = require('https');

const app = express();

app.use(express.static('public/css')) //to use css file //don't put ;

app.use(bodyParser.urlencoded({extended : true})); //to use body parser

app.set('view engine', 'ejs');

app.get("/", function(req, res) {
    res.status(200).render('home');
});

app.post(["/", '/change'], function(req, res) {
    const query = req.body.cityName;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${process.env.APPID}&units=metric`;

    https.get(url, function(response) {
        console.log(response.statusCode);

        response.on("data", async function(data) {
            const weatherData = await JSON.parse(data) //to get data as object
            const temp = await weatherData.main.temp; //to select specific data from object
            const weatherDescription = await weatherData.weather[0].description;
            const weatherIcon = await weatherData.weather[0].icon;
            const imageUrl = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
            const cityName = query.charAt(0).toUpperCase() + query.slice(1);
            res.render('output', {query: cityName, temp: temp, weatherDescription: weatherDescription, imageUrl: imageUrl});
        });
    });
});

const port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log(`Server is running on port: ${port}`);
});