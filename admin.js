let editId = null;



// =========================
// PROVJERA PRIJAVE
// =========================

async function checkLogin(){


    const { data } = await client.auth.getSession();



    if(!data.session){

        window.location.href = "login.html";

    }


}


checkLogin();





// =========================
// UČITAVANJE PJESAMA
// =========================


async function loadAdminSongs(){


    const { data, error } = await client

    .from("songs")

    .select("*")

    .order("artist");



    if(error){

        console.error(error);

        return;

    }



    const div = document.getElementById("adminSongs");


    div.innerHTML = "";



    data.forEach(song => {


        div.innerHTML += `


        <div class="admin-song">


            <div>

                <h3>${song.title}</h3>

                <p>${song.artist}</p>

            </div>


            <div>


                <button onclick="editSong(${song.id})">
                    ✏️
                </button>


                <button onclick="deleteSong(${song.id})">
                    🗑️
                </button>


            </div>


        </div>


        `;


    });



}





// =========================
// SPREMANJE PJESME
// =========================


async function saveSong(){



    const title = document.getElementById("title").value;

    const artist = document.getElementById("artist").value;

    const lyrics = document.getElementById("lyrics").value;



    if(!title || !artist || !lyrics){


        document.getElementById("message").textContent =
        "Ispuni sva polja.";


        return;

    }




    let result;



    if(editId){



        result = await client

        .from("songs")

        .update({

            title:title,

            artist:artist,

            lyrics:lyrics

        })

        .eq("id", editId);



    }

    else {



        result = await client

        .from("songs")

        .insert({

            title:title,

            artist:artist,

            lyrics:lyrics

        });


    }




    if(result.error){


        console.error(result.error);


        document.getElementById("message").textContent =
        result.error.message;


        return;


    }





    document.getElementById("message").textContent =
    "Spremljeno ✅";



    clearForm();


    loadAdminSongs();



}







// =========================
// UREĐIVANJE
// =========================


async function editSong(id){



    const { data, error } = await client

    .from("songs")

    .select("*")

    .eq("id", id)

    .single();



    if(error){

        console.error(error);

        return;

    }



    editId = id;



    document.getElementById("title").value =
    data.title;


    document.getElementById("artist").value =
    data.artist;


    document.getElementById("lyrics").value =
    data.lyrics;



    window.scrollTo({

        top:0,

        behavior:"smooth"

    });



}







// =========================
// BRISANJE
// =========================


async function deleteSong(id){



    const potvrda = confirm(
    "Želiš li obrisati ovu pjesmu?"
    );



    if(!potvrda){

        return;

    }




    const { error } = await client

    .from("songs")

    .delete()

    .eq("id", id);




    if(error){

        console.error(error);

        return;

    }




    loadAdminSongs();


}







// =========================
// ČIŠĆENJE FORME
// =========================


function clearForm(){



    editId = null;



    document.getElementById("title").value = "";

    document.getElementById("artist").value = "";

    document.getElementById("lyrics").value = "";



}







// =========================
// ODJAVA
// =========================


async function logout(){



    await client.auth.signOut();



    window.location.href = "login.html";


}







loadAdminSongs();