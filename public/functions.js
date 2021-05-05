const dbURI = 'http://www.omdbapi.com/?apikey=12b69f05&'

async function searchMovies(){
    document.getElementById("movieList").innerHTML = `<div class="searchIndicator"><h1>Searching...</h1></div>`;

    let types = document.getElementsByName("type")
    let type = null;

    types.forEach(option => {
        if (option.checked) {
            type = option.value;
        }
    });

    let search = document.getElementById("search").value;
    let searchURI = encodeURIComponent(search);
    let response = await fetch(dbURI + `s=${searchURI}`);
    let data = await response.json();
    let result = data["Search"];
    let totalResults = data["totalResults"];
    let filteredTotal = 0;

    if(totalResults > 10){
        let pages = Math.ceil(totalResults/10);

        for (let x = 2; x < pages; x++) {
            response = await fetch(dbURI + `s=${searchURI}&page=${x}`);
            // console.log(response);
            data = await response.json();
            data["Search"].forEach(movie => {
                result.push(movie);
            });
        }
    }

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

    // result.forEach(movie => {
    //     if(movie.Type != 'game'){
    //         filteredTotal++;
    //     }
    // });

    document.getElementById("movieList").innerHTML = ``;

    if (result != null && result.length > 0){

        document.getElementById("movieList").innerHTML += `<p class="resultCount">${filteredTotal} Results</p>`;

        result.forEach(movie => {
            if(movie["Poster"] == null){
                movie["Poster"] = "/NoMoviePoster.jpg"
            }
        });

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

async function searchByTitle(title){
    let titleURI = encodeURIComponent(title.innerHTML);
    let response = await fetch(dbURI + `t=${titleURI}`);
    let data = await response.json();
    return data;
}

function displayMovie(event){
    let target = event.target || event.srcElement;

    // Retrieves title if parent element selected
    if(target.className == "movie"){
        target = target.getElementsByClassName("title")
        target = target[0];
    }

    searchByTitle(target).then(result => {
        // console.log(Object.keys(result["Title"]).length);
        let movies = result["Title"];
        displayMovieResult(result);
    });
}

// Ensures critic ratings exist
function criticChecker(critic){
    if(critic == null){
        return "Unrated";
    } else {
        return critic["Value"];
    }
}

async function displayMovieResult(result){
    let ratings = result["Ratings"];

    let imdb = ratings[0];
    let rt = ratings[1];
    let mc = ratings[2];

    imdb = criticChecker(imdb);
    rt = criticChecker(rt);
    mc = criticChecker(mc);

    if(result["Poster"] == null){
        result["Poster"] = "/NoMoviePoster.jpg"
    }

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