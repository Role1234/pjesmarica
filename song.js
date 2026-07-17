async function loadSong() {


    const params = new URLSearchParams(window.location.search);


    const id = params.get("id");



    const { data, error } = await client

        .from("songs")

        .select("*")

        .eq("id", id)

        .single();



    if (error) {

        console.error(error);

        return;

    }



    document.getElementById("title").textContent = data.title;


    document.getElementById("artist").textContent = data.artist;


    document.getElementById("lyrics").textContent = data.lyrics;



}



loadSong();