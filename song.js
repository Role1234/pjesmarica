async function loadSong(){



    const params =
    new URLSearchParams(
        window.location.search
    );



    const id =
    params.get("id");



    if(!id){


        window.location.href =
        "index.html";


        return;

    }




    const { data, error } = await client

        .from("songs")

        .select("*")

        .eq("id", id)

        .single();





    if(error || !data){


        console.error(error);



        alert(
            "Pjesma nije pronađena."
        );



        window.location.href =
        "index.html";



        return;


    }







    document.getElementById("songTitle")
    .textContent =
    data.title;





    document.getElementById("songArtist")
    .textContent =
    data.artist;





    document.getElementById("songLyrics")
    .textContent =
    data.lyrics;





    document.title =
    `${data.title} - Pjesmarica`;







    const backButton =
    document.getElementById("backButton");



    const artist =
    params.get("artist")
    || data.artist;





    backButton.href =

    `index.html?artist=${encodeURIComponent(artist)}`;



}



loadSong();
