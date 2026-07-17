async function login(){


    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;



    const { data, error } = await client.auth.signInWithPassword({

        email: email,

        password: password

    });



    if(error){

        console.error(error);


        document.getElementById("message").textContent =
        "Pogrešan email ili lozinka.";


        return;

    }



    document.getElementById("message").textContent =
    "Prijava uspješna...";


    setTimeout(() => {

        window.location.href = "admin.html";

    }, 500);


}