const dbURI = 'http://www.omdbapi.com/?apikey=12b69f05&'


// Function that handles search requests via the top menu, which then produces a list of results on the left scrolling section of the webpage
async function searchMovies(){

    // Replaces the list sections HTML with a pulsating search indicator
    document.getElementById("movieList").innerHTML = `<div class="searchIndicator"><h1>Searching...</h1></div>`;

    // Retrieves the type constraints options, including the checked result
    // then, filters through the constraint list to find the specified type
    // Options: Any, Movies, Series, Episodes
    let types = document.getElementsByName("type")
    let type = null;
    types.forEach(option => {
        if (option.checked) {
            type = option.value;
        }
    });

    // Retrieves the search key terms, processes them into an API request 
    // with the dbURI constant kept in app.js, which is then sent to the OMDB API
    let search = document.getElementById("search").value;
    let searchURI = encodeURIComponent(search);
    let response = await fetch(dbURI + `s=${searchURI}`);

    // Awaits the response from API request and converts the response into JSON format,
    // then distributes desired search and result data to allocated variables.
    let data = await response.json();

    // "Search" retrieves the list of movies found from the search term keys, 
    // totalResults is a count of all items
    let result = data["Search"];
    let totalResults = data["totalResults"];

    // filteredTotal exists to retrieve an accurate total by removing filtered options
    // and invalid ones such as games
    let filteredTotal = 0;

    // As OMDB API is restricted by pagination in units of 10 (0 - 9, 10 - 19...)
    // if the total is higher than ten, several more requests will need to be made
    // in order to pull the full list of movies
    if(totalResults > 10){

        // Math.ceil rounds up to the nearest integer, this is important to make sure that the
        // resulting number of pages is inclusive of any tailing incomplete pages under all 
        // conditions. Example, a result of 10.4 means 11 pages in total, not 10.
        let pages = Math.ceil(totalResults/10);

        // push - appends every set of 10 or less items from each page until all pages are processed
        for (let x = 2; x < pages; x++) {
            response = await fetch(dbURI + `s=${searchURI}&page=${x}`);
            data = await response.json();
            data["Search"].forEach(movie => {
                result.push(movie);
            });
        }
    }

    // Recalculates an accurate total based on the chosen search menu constraints
    switch (type) {
        case "any":
            result.forEach(movie => {
                if(movie.Type != 'game'){
                    filteredTotal++;
                }
            });
            break;

        case "movies":
            result.forEach(movie => {
                if(movie.Type == 'movie'){
                    filteredTotal++;
                }
            });
            break;

        case "series":
            result.forEach(movie => {
                if(movie.Type == 'series'){
                    filteredTotal++;
                }
            });
            break;
        
        case "episodes":
            result.forEach(movie => {
                if(movie.Type == 'episode'){
                    filteredTotal++;
                }
            });
            break;
    
        default:
            result.forEach(movie => {
                if(movie.Type != 'game'){
                    filteredTotal++;
                }
            });
            break;
    }

    // clears the search indicator ONLY after all API requests are complete and processed
    document.getElementById("movieList").innerHTML = ``;

    // If there are any results, this section displays the final information 
    // to the item list on the left-hand side of the webpage
    if (result != null && result.length > 0){

        // Display the true count of items post-filtration
        document.getElementById("movieList").innerHTML += `<p class="resultCount">${filteredTotal} Results</p>`;

        // Checks that each movie has a poster and if not, replace it with a default no poster image
        result.forEach(movie => {
            if(movie["Poster"] == null || movie["Poster"] == "N/A"){
                movie["Poster"] = "/NoMoviePoster.jpg"
            }
        });

        // Based on the constraints, generates HTML for all relevant results to the movie list 
        switch (type) {
            case "any":
                result.forEach(movie => {
                    if(movie.Type != 'game'){
                        document.getElementById("movieList").innerHTML +=
                        `<div class="movie" onclick="displayMovie(event)">
                            <img src="${movie["Poster"]} alt="" class="listImage">
                            <h3 class="title">${movie.Title}</h3>
                        </div>`;
                    }
                });
                break;
    
            case "movies":
                result.forEach(movie => {
                    if(movie.Type == 'movie'){
                        document.getElementById("movieList").innerHTML +=
                        `<div class="movie" onclick="displayMovie(event)">
                            <img src="${movie["Poster"]} alt="" class="listImage">
                            <h3 class="title">${movie.Title}</h3>
                        </div>`;
                    }
                });
                break;
    
            case "series":
                result.forEach(movie => {
                    if(movie.Type == 'series'){
                        document.getElementById("movieList").innerHTML +=
                        `<div class="movie" onclick="displayMovie(event)">
                            <img src="${movie["Poster"]} alt="" class="listImage">
                            <h3 class="title">${movie.Title}</h3>
                        </div>`;
                    }
                });
                break;
            
            case "episodes":
                result.forEach(movie => {
                    if(movie.Type == 'episode'){
                        document.getElementById("movieList").innerHTML +=
                        `<div class="movie" onclick="displayMovie(event)">
                            <img src="${movie["Poster"]} alt="" class="listImage">
                            <h3 class="title">${movie.Title}</h3>
                        </div>`;
                    }
                });
                break;
        
            default:
                result.forEach(movie => {
                    if(movie.Type != 'game'){
                        document.getElementById("movieList").innerHTML +=
                        `<div class="movie" onclick="displayMovie(event)">
                            <img src="${movie["Poster"]} alt="" class="listImage">
                            <h3 class="title">${movie.Title}</h3>
                        </div>`;
                    }
                });
                break;
        }
        
    } else{
        document.getElementById("movieList").innerHTML = `<p class="resultCount">0 Results</p>`
    }
}

// Function called during displayMovie() to encode, request, and return the response
// data for a specific movie from the OMDB API
async function searchByTitle(title){
    let titleURI = encodeURIComponent(title.innerHTML);
    let response = await fetch(dbURI + `t=${titleURI}`);
    let data = await response.json();
    return data;
}

// This function is called when a movie is selected from the movie list on the left
// side of the webpage. The chosen movie is processed as an API request and finer details
// are pushed to the main display section of the webpage.
function displayMovie(event){
    let target = event.target || event.srcElement;

    // Retrieves title if parent element selected
    if(target.className == "movie"){
        target = target.getElementsByClassName("title")
        target = target[0];
    }

    // sends an API request for the specific movie to be displayed
    searchByTitle(target).then(result => {
        let movies = result["Title"];
        displayMovieResult(result);
    });
}

// Ensures critic ratings exist
// if not, converts the null to a default value
function criticChecker(critic){
    if(critic == null){
        return "Unrated";
    } else {
        return critic["Value"];
    }
}

// Main function for producing the major display of movie information
async function displayMovieResult(result){

    // Some ratings may not exist and will cause errors if not handled
    // before trying to push the data as HTML
    let ratings = result["Ratings"];

    let imdb = ratings[0];
    let rt = ratings[1];
    let mc = ratings[2];

    imdb = criticChecker(imdb);
    rt = criticChecker(rt);
    mc = criticChecker(mc);

    // Checks that the movie has a poster and if not, replace it with a default no poster image
    if(result["Poster"] == null || result["Poster"] == "N/A"){
        result["Poster"] = "/NoMoviePoster.jpg"
    }

    // Generates a large block of HTML that forms the main display of information for the selected movie
    // Includes: Poster, Title, Details(Rating, Actors, Release Year, Genres), Plot/Description, and Ratings
    document.getElementById("movieDisplay").innerHTML = 
        `<div class="displayHead">
            <img src="${result["Poster"]} alt="" class="displayImage">
            <div class="displayMain">
                <p class="displayTitle">${result["Title"]}</p>
                <p class="displayDetails">${result["Rated"]} - ${result["Year"]} - ${result["Genre"]} - ${result["Runtime"]}</p>
                <p class="displayActors">${result["Actors"]}</p>
            </div>
        </div>

        <div class="displayBody">
            <p class="displayDescription">
                ${result["Plot"]}
            </p>
        </div>

        <div class="displayFoot">
            <div class="displayIMDB">
                <p> ${imdb} </p>    
                <label for="">Internet Movie Database</label>
            </div>
            <div class="displayRT">
                <p> ${rt} </p>
                <label for="">Rotten Tomatoes</label>
            </div>
            <div class="displayMC">
                <p> ${mc} </p>
                <label for="">Metacritic</label>
            </div>
        </div>`;
};