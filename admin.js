let allSongs = [];

let filteredSongs = [];

let currentPage = 1;

const songsPerPage = 50;

let editId = null;





// =========================
// PROVJERA LOGIN
// =========================


async function checkLogin(){


    const { data } =
    await client.auth.getSession();



    if(!data.session){

        window.location.href =
        "login.html";

    }


}







// =========================
// UČITAVANJE PJESAMA
// =========================


async function loadSongs(){



    const { data, error } = await client

    .from("songs")

    .select("id,title,artist,lyrics")

    .order("artist");





    if(error){


        console.error(error);

        return;


    }






    allSongs = data;

    filteredSongs = data;






    fillArtistFilter();


    renderSongs();


}







// =========================
// FILTER IZVOĐAČA
// =========================


function fillArtistFilter(){



    const select =
    document.getElementById("artistFilter");



    select.innerHTML = `

    <option value="">
    🎤 Svi izvođači
    </option>

    `;





    const artists = [

        ...new Set(

            allSongs.map(song=>song.artist)

        )

    ].sort();







    artists.forEach(artist=>{



        select.innerHTML += `

        <option value="${artist}">
        ${artist}
        </option>

        `;



    });



}







// =========================
// PRIKAZ PJESAMA
// =========================


function renderSongs(){



    const div =
    document.getElementById("adminSongs");



    const counter =
    document.getElementById("songCounter");



    div.innerHTML = "";





    if(counter){


        counter.textContent =

        `${filteredSongs.length} pjesama`;


    }






    const start =

    (currentPage - 1)
    *
    songsPerPage;





    const end =

    start + songsPerPage;






    const pageSongs =

    filteredSongs.slice(
        start,
        end
    );







    pageSongs.forEach(song=>{



        div.innerHTML += `



        <div class="admin-song">


            <div>


                <h3>
                ${song.title}
                </h3>


                <p>
                ${song.artist}
                </p>


            </div>





            <div>


                <button onclick="openEdit(${song.id})">

                ✏️

                </button>



                <button onclick="deleteSong(${song.id})">

                🗑️

                </button>



            </div>


        </div>


        `;



    });






    renderPagination();



}







// =========================
// PAGINATION
// =========================


function renderPagination(){



    const div =
    document.getElementById("pagination");



    if(!div){

        return;

    }





    div.innerHTML = "";





    const pages =

    Math.ceil(
        filteredSongs.length /
        songsPerPage
    );






    for(let i=1;i<=pages;i++){



        div.innerHTML += `


        <button

        onclick="changePage(${i})"

        class="cancel-button">


        ${i}


        </button>


        `;



    }



}







function changePage(page){



    currentPage = page;


    renderSongs();


}







// =========================
// PRETRAGA
// =========================


document.addEventListener(

"DOMContentLoaded",

()=>{


const search =
document.getElementById("adminSearch");



const filter =
document.getElementById("artistFilter");





if(search){



search.addEventListener(
"input",
applyFilters
);


}





if(filter){



filter.addEventListener(
"change",
applyFilters
);


}





checkLogin();


loadSongs();



}



);

// =========================
// PRIMJENA FILTERA
// =========================


function applyFilters(){



    const text =

    document
    .getElementById("adminSearch")
    .value
    .toLowerCase();





    const artist =

    document
    .getElementById("artistFilter")
    .value;






    filteredSongs = allSongs.filter(song=>{



        const matchesText =


        song.title
        .toLowerCase()
        .includes(text)



        ||



        song.artist
        .toLowerCase()
        .includes(text);






        const matchesArtist =


        artist === ""

        ||

        song.artist === artist;






        return matchesText && matchesArtist;



    });






    currentPage = 1;


    renderSongs();



}








// =========================
// DODAVANJE PJESME
// =========================


async function saveSong(){



    const title =
    document.getElementById("title")
    .value
    .trim();



    const artist =
    document.getElementById("artist")
    .value
    .trim();



    const lyrics =
    document.getElementById("lyrics")
    .value
    .trim();






    if(!title || !artist || !lyrics){


        showMessage(
        "Ispuni sva polja."
        );


        return;


    }






    const {error} =

    await client
    .from("songs")
    .insert({

        title:title,

        artist:artist,

        lyrics:lyrics

    });







    if(error){



        console.error(error);


        showMessage(
        error.message
        );


        return;


    }






    clearForm();


    showMessage(
    "Pjesma dodana ✅"
    );



    await loadSongs();



}








// =========================
// OTVORI MODAL
// =========================


function openEdit(id){



    const song =

    allSongs.find(

        s=>s.id===id

    );





    if(!song){

        return;

    }






    editId = id;






    document.getElementById("editTitle")
    .value = song.title;



    document.getElementById("editArtist")
    .value = song.artist;



    document.getElementById("editLyrics")
    .value = song.lyrics;







    document.getElementById("editModal")
    .style.display="block";



}








// =========================
// ZATVORI MODAL
// =========================


function closeModal(){



    document.getElementById("editModal")
    .style.display="none";



    editId=null;



}








// =========================
// UPDATE PJESME
// =========================


async function updateSong(){



    if(!editId){

        return;

    }






    const title =

    document
    .getElementById("editTitle")
    .value
    .trim();





    const artist =

    document
    .getElementById("editArtist")
    .value
    .trim();





    const lyrics =

    document
    .getElementById("editLyrics")
    .value
    .trim();






    const {error}=

    await client
    .from("songs")
    .update({

        title:title,

        artist:artist,

        lyrics:lyrics

    })

    .eq(
        "id",
        editId
    );








    if(error){


        console.error(error);


        showMessage(
        "Greška kod spremanja."
        );


        return;


    }






    closeModal();


    showMessage(
    "Izmjene spremljene ✅"
    );



    await loadSongs();



}








// =========================
// BRISANJE
// =========================


async function deleteSong(id){



    const song =

    allSongs.find(

        s=>s.id===id

    );





    if(!song){

        return;

    }






    const confirmDelete =

    confirm(

    `Obrisati "${song.title}"?`

    );






    if(!confirmDelete){

        return;

    }







    const {error}=

    await client
    .from("songs")
    .delete()
    .eq(
        "id",
        id
    );








    if(error){



        console.error(error);


        showMessage(
        "Greška kod brisanja."
        );


        return;


    }







    showMessage(
    "Pjesma obrisana 🗑️"
    );



    await loadSongs();



}








// =========================
// ČIŠĆENJE
// =========================


function clearForm(){



    document.getElementById("title")
    .value="";



    document.getElementById("artist")
    .value="";



    document.getElementById("lyrics")
    .value="";



}








// =========================
// PORUKA
// =========================


function showMessage(text){



    const box =
    document.getElementById("message");



    if(box){


        box.textContent=text;



        setTimeout(()=>{


            box.textContent="";


        },3000);



    }



}








// =========================
// LOGOUT
// =========================


async function logout(){



    await client.auth.signOut();



    window.location.href =
    "login.html";



}
