let allSongs = [];

let currentArtist = null;


// =========================
// UČITAVANJE PJESAMA
// =========================

async function loadSongs(){

    const { data, error } = await client
        .from("songs")
        .select("*")
        .order("artist");


    if(error){

        console.error(error);
        return;

    }


    allSongs = data;


    const params = new URLSearchParams(window.location.search);
    const artist = params.get("artist");


    if(artist){

        openArtist(artist);

    } else {

        displayArtists();

    }

}





// =========================
// PRIKAZ SVIH IZVOĐAČA
// =========================

function displayArtists(){


    // ukloni artist iz URL-a
    window.history.replaceState(
        {},
        document.title,
        "index.html"
    );


    const artistsDiv = document.getElementById("artists");

    const songsDiv = document.getElementById("songs");


    artistsDiv.innerHTML = "";

    songsDiv.innerHTML = "";


    document.getElementById("backButton").innerHTML = "";


    document.querySelector(".section-title").textContent =
    "🎤 Izvođači";



    const artists = [...new Set(

        allSongs.map(song => song.artist)

    )];



    artists.forEach(artist => {


        const count = allSongs.filter(

            song => song.artist === artist

        ).length;



        artistsDiv.innerHTML += `


        <div class="artist-box"
        onclick="openArtist('${artist}')">


            <h2>
            🎤 ${artist}
            </h2>


            <p>
            ${count} pjesama
            </p>


        </div>


        `;


    });


}





// =========================
// PRIKAZ PJESAMA IZVOĐAČA
// =========================

function openArtist(artist){


    currentArtist = artist;


    document.getElementById("artists").innerHTML = "";


    const songsDiv = document.getElementById("songs");


    songsDiv.innerHTML = "";



    document.getElementById("backButton").innerHTML = `


    <button class="back-button"

    onclick="displayArtists()">


    ← Svi izvođači


    </button>


    `;



    document.querySelector(".section-title").textContent =
    "🎵 " + artist;




    const songs = allSongs.filter(

        song => song.artist === artist

    );



    songs.forEach(song => {



        songsDiv.innerHTML += `


        <div class="song"

        onclick="openSong(${song.id})">


            <h2>
            ${song.title}
            </h2>


            <h3>
            ${song.artist}
            </h3>


        </div>


        `;


    });


}






// =========================
// PRETRAGA
// =========================

const searchInput = document.getElementById("search");


searchInput.addEventListener(

"input",

function(){


    const text = this.value.toLowerCase();



    if(text === ""){

        displayArtists();

        return;

    }




    const results = allSongs.filter(song =>


        song.title.toLowerCase().includes(text)

        ||

        song.artist.toLowerCase().includes(text)


    );




    document.getElementById("artists").innerHTML = "";

    document.getElementById("songs").innerHTML = "";




    results.forEach(song => {



        document.getElementById("songs").innerHTML += `


        <div class="song"

        onclick="openSong(${song.id})">


            <h2>
            ${song.title}
            </h2>


            <h3>
            ${song.artist}
            </h3>


        </div>


        `;



    });



});







// =========================
// OTVORI PJESMU
// =========================

function openSong(id){


    const song = allSongs.find(

        s => s.id === id

    );


    window.location.href =

    `song.html?id=${id}&artist=${encodeURIComponent(song.artist)}`;


}





loadSongs();
