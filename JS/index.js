const API_KEY = "AIzaSyA--GxX0IZlDKy5-5xQwgBX-1_ofLuuNNk";
let search, nextToken, previousToken;

function displayResults(data) {
    let results = document.querySelector('.results');
    results.innerHTML = "";

    for(let i = 0; i < data.items.length; i++) {
        results.innerHTML +=
        `
        <div class="item">
            <a href="https://www.youtube.com/watch?v=${data.items[i].id.videoId}" target="_blank">
                <h3>${data.items[i].snippet.title}</h3>
                <img src="${data.items[i].snippet.thumbnails.high.url}"/>
            </a>
        </div>
        `
    }
}

function fetchVideos(search, token) {
    let url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&maxResults=10&q=${search}&type=video${token}`;

    let settings = {
        method: 'GET'
    };

    fetch(url, settings)
        .then(response => {
            if(response.ok) {
                return response.json();
            }

            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            displayResults(responseJSON);

            let navigationButtons = document.querySelectorAll('.navigation');
            navigationButtons.forEach(element => {
                element.style.display = "inline";
            });

            if(responseJSON.prevPageToken)
                previousToken = `&pageToken=${responseJSON.prevPageToken}`;
            else
                previousToken = '';
            
            if(responseJSON.nextPageToken)
                nextToken = `&pageToken=${responseJSON.nextPageToken}`;
            else
                nextToken = '';
        })
        .catch(error => {
            console.log(error);
        });
}

function watchForm() {
    let submitButtton = document.querySelector('.submitButton');
    submitButtton.addEventListener('click', (event) => {
        event.preventDefault();

        search = document.querySelector('#search').value;
        fetchVideos(search, null);
    });
}

function watchNavigation() {
    let navigationButtons = document.querySelectorAll('.navigation');

    //Previous button
    navigationButtons[0].addEventListener('click', (event) => {
        event.preventDefault();
        if(previousToken)
            fetchVideos(search, previousToken);
    });

    //Next button
    navigationButtons[1].addEventListener('click', (event) => {
        event.preventDefault();
        if(nextToken)
            fetchVideos(search, nextToken);
    });
}

function init(){
    watchForm();
    watchNavigation();
}

init();