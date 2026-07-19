let allSongs = [];

let currentArtist = null;


// =========================
// POMOĆNE FUNKCIJE
// =========================

function clearContent(){

    document.getElementById("artists").innerHTML = "";

    document.getElementById("songs").innerHTML = "";

}



function scrollTop(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}



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

        document.getElementById("artists").textContent =
        "Greška kod učitavanja pjesama.";

        return;

    }



    allSongs = data || [];



    const params = new URLSearchParams(
        window.location.search
    );


    const artist = params.get("artist");



    if(artist){

        openArtist(artist);

    }

    else {

        displayArtists();

    }


}





// =========================
// PRIKAZ IZVOĐAČA
// =========================


function displayArtists(){


    currentArtist = null;



    window.history.replaceState(

        {},

        document.title,

        "index.html"

    );



    clearContent();



    document.getElementById("backButton").innerHTML = "";



    document.querySelector(".section-title").textContent =
    "🎤 Izvođači";



    const artists = [

        ...new Set(

            allSongs.map(song => song.artist)

        )

    ]

    .sort((a,b)=>

        a.localeCompare(b)

    );




    const artistsDiv =
    document.getElementById("artists");



    if(artists.length === 0){

        artistsDiv.textContent =
        "Nema dodanih pjesama.";

        return;

    }




    artists.forEach(artist=>{


        const count = allSongs.filter(

            song => song.artist === artist

        ).length;



        const box = document.createElement("div");


        box.className = "artist-box";


        box.onclick = ()=>{

            openArtist(artist);

        };



        box.innerHTML = `

            <h2>
            🎤 ${artist}
            </h2>

            <p>
            🎵 ${count} pjesama
            </p>

        `;



        artistsDiv.appendChild(box);


    });


}





// =========================
// PJESME IZVOĐAČA
// =========================


function openArtist(artist){


    currentArtist = artist;



    clearContent();



    const back =
    document.getElementById("backButton");



    back.innerHTML = `

        <button class="back-button">

        ← Svi izvođači

        </button>

    `;



    back.querySelector("button").onclick =
    displayArtists;



    document.querySelector(".section-title").textContent =
    "🎵 " + artist;




    const songs = allSongs.filter(

        song => song.artist === artist

    );



    const songsDiv =
    document.getElementById("songs");



    songs.forEach(song=>{


        const box = document.createElement("div");


        box.className="song";


        box.onclick = ()=>{

            openSong(song.id);

        };



        box.innerHTML = `

            <h2>${song.title}</h2>

            <h3>${song.artist}</h3>

        `;



        songsDiv.appendChild(box);



    });



    scrollTop();


}





// =========================
// PRETRAGA
// =========================


document.addEventListener(

"DOMContentLoaded",

()=>{


const searchInput =
document.getElementById("search");



if(!searchInput){

    return;

}



searchInput.addEventListener(

"input",

function(){


    const text =
    this.value.toLowerCase().trim();



    if(text === ""){

        displayArtists();

        return;

    }



    clearContent();



    const results =
    allSongs.filter(song=>

        song.title
        .toLowerCase()
        .includes(text)

        ||

        song.artist
        .toLowerCase()
        .includes(text)

    );



    const songsDiv =
    document.getElementById("songs");



    if(results.length===0){

        songsDiv.textContent =
        "Nema rezultata.";

        return;

    }




    results.forEach(song=>{


        const box =
        document.createElement("div");


        box.className="song";


        box.onclick=()=>{

            openSong(song.id);

        };



        box.innerHTML=`

            <h2>${song.title}</h2>

            <h3>${song.artist}</h3>

        `;



        songsDiv.appendChild(box);


    });


});


});






// =========================
// OTVARANJE PJESME
// =========================


function openSong(id){


    const song =
    allSongs.find(

        s=>s.id===id

    );



    if(!song){

        return;

    }



    window.location.href =

    `song.html?id=${id}&artist=${encodeURIComponent(song.artist)}`;


}





loadSongs();
