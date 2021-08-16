const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors');
const {json} = require('body-parser');
const axios = require('axios');

//initilizes an Express application
const app = express();

//tell the new express app to use cors and json
app.use(cors());
app.use(json());


//get environment variables code here with the dotenv.config() method that returns a variable called parsed
const {parsed: config} = dotenv.config();

//create the cloudinary endpoint string to call from the request
const BASE_URL = `https://api.cloudinary.com/v1_1/${config.CLOUD_NAME}`;
const GET_PHOTOS_URL = `/resources/image`;
const SEARCH_PHOTOS_URL = `/resources/search`;

//create an object to hold our username and password for authentication to the cloudinary api
const auth = {
    username: config.API_KEY,
    password: config.API_SECRET
}

//create an endpoint that the react client can call
//name the endpoint and then create the request function
app.get('/photos', async (req, res) => {  //pass in two variables to the function -> request & response
    //using axios to get the request to the base url, and then pass in the config for the request as an object
    const response = await axios.get(BASE_URL + GET_PHOTOS_URL, {
        auth,
        //we passed the next_cursor value through to this server via the req variable params
        params: {
            next_cursor: req.query.next_cursor
        } 
    });
    return res.send(response.data);
});

//make new cloudinary api for search endpoint setup
app.get('/search', async(req, res) => {
    const response = await axios.get(BASE_URL + '/resources/search', {
        auth,
        params : {
            //the UI will send a search value that we need to send back to cloudinary
            expression: req.query.expression
        },
    });

    //return data as we get it from cloudinary api
    return res.send(response.data);
})


//tell the node server what port to listen to 
const PORT=7000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));