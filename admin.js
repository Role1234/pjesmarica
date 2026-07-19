let editId = null;



// =========================
// PROVJERA PRIJAVE
// =========================


async function checkLogin(){


    const { data } =
    await client.auth.getSession();



    if(!data.session){

        window.location.href =
        "login.html";

        return false;

    }


    return true;


}



checkLogin();






// =========================
// PORUKE
// =========================


function showMessage(text){


    const message =
    document.getElementById("message");


    message.textContent = text;


}







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


        showMessage(
            "Greška kod učitavanja pjesama."
        );


        return;


    }





    const container =
    document.getElementById("adminSongs");



    container.innerHTML = "";



    const songs =
    data || [];





    if(songs.length === 0){


        container.textContent =
        "Nema dodanih pjesama.";


        return;


    }






    songs.forEach(song=>{





        const box =
        document.createElement("div");



        box.className =
        "admin-song";






        const info =
        document.createElement("div");



        info.innerHTML = `

            <h3>${song.title}</h3>

            <p>${song.artist}</p>

        `;







        const buttons =
        document.createElement("div");






        const editButton =
        document.createElement("button");



        editButton.type =
        "button";



        editButton.textContent =
        "✏️";



        editButton.onclick = ()=>{

            editSong(song.id);

        };








        const deleteButton =
        document.createElement("button");



        deleteButton.type =
        "button";



        deleteButton.textContent =
        "🗑️";



        deleteButton.onclick = ()=>{

            deleteSong(song.id);

        };






        buttons.appendChild(editButton);

        buttons.appendChild(deleteButton);






        box.appendChild(info);

        box.appendChild(buttons);




        container.appendChild(box);





    });



}









// =========================
// SPREMANJE
// =========================


async function saveSong(){





    const title =
    document.getElementById("title")
    .value.trim();



    const artist =
    document.getElementById("artist")
    .value.trim();



    const lyrics =
    document.getElementById("lyrics")
    .value.trim();






    if(!title || !artist || !lyrics){



        showMessage(
            "Ispuni sva polja."
        );


        return;


    }





    const button =
    document.querySelector(".save-button");



    button.disabled = true;



    button.textContent =
    "Spremanje...";







    let result;






    if(editId){



        result = await client

            .from("songs")

            .update({

                title,

                artist,

                lyrics

            })

            .eq("id", editId);





    }
    else {



        result = await client

            .from("songs")

            .insert({

                title,

                artist,

                lyrics

            });



    }







    button.disabled = false;



    button.textContent =
    "💾 Spremi pjesmu";







    if(result.error){



        console.error(result.error);



        showMessage(
            result.error.message
        );



        return;


    }







    showMessage(
        "Spremljeno ✅"
    );




    clearForm();



    await loadAdminSongs();





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





    document.getElementById("title")
    .value =
    data.title;



    document.getElementById("artist")
    .value =
    data.artist;



    document.getElementById("lyrics")
    .value =
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





    const potvrda =
    confirm(
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


        showMessage(
            "Greška kod brisanja."
        );


        return;


    }





    showMessage(
        "Pjesma obrisana."
    );



    await loadAdminSongs();





}









// =========================
// ČIŠĆENJE FORME
// =========================


function clearForm(){



    editId = null;



    document.getElementById("title")
    .value = "";



    document.getElementById("artist")
    .value = "";



    document.getElementById("lyrics")
    .value = "";



}









// =========================
// ODJAVA
// =========================


async function logout(){



    await client.auth.signOut();



    window.location.href =
    "login.html";



}







loadAdminSongs();
