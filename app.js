const { response } = require('express');
const express = require('express');
const fetch = require('node-fetch');

// express app
const app = express();

async function searchApi(){
    const response = await fetch('http://www.omdbapi.com/?apikey=12b69f05&s=star+wars')
    
    var data = await response.json();
    console.log(data);
    return data;
}

// connect to OMDb w/ API key
const dbURI = 'http://www.omdbapi.com/?apikey=12b69f05&'
// search by title:
    // http://www.omdbapi.com/?apikey=12b69f05&t=lion+king
// search by id (obtain from title JSON if unknown):
    // http://www.omdbapi.com/?apikey=12b69f05&i=tt0110357
// obtain poster image:
    // http://img.omdbapi.com/?apikey=12b69f05&i=tt0110357

// register view engine
app.set('view engine', 'ejs');

// listen for requests
app.listen(3000);

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}))

app.get('/', (req, res) => {
    const blogs = [
        {title: 'help', snippet: 'Lorem ipsum dotor sit amet consectetur'},
        {title: 'me', snippet: 'Lorem ipsum dotor sit amet consectetur'},
        {title: 'please', snippet: 'Lorem ipsum dotor sit amet consectetur'},
    ]
    const movies = searchApi();
    res.render('mainSearch', {blogs, movies});
});