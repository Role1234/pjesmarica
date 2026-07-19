const loginButton =
document.querySelector(".save-button");



// =========================
// PROVJERA POSTOJEĆE SESIJE
// =========================


async function checkSession(){


    const { data } =
    await client.auth.getSession();



    if(data.session){


        window.location.href =
        "admin.html";


    }


}



checkSession();







// =========================
// PORUKA
// =========================


function showMessage(text){


    document.getElementById("message")
    .textContent = text;


}









// =========================
// PRIJAVA
// =========================


async function login(){





    const email =
    document.getElementById("email")
    .value
    .trim();




    const password =
    document.getElementById("password")
    .value;






    if(!email || !password){



        showMessage(
            "Unesi email i lozinku."
        );



        return;


    }







    if(loginButton){


        loginButton.disabled = true;


        loginButton.textContent =
        "Prijava...";


    }







    try {



        const { error } =
        await client.auth.signInWithPassword({


            email,

            password


        });







        if(error){



            console.error(error);



            showMessage(
                "Pogrešan email ili lozinka."
            );



            return;


        }







        showMessage(
            "Prijava uspješna ✅"
        );






        setTimeout(()=>{



            window.location.href =
            "admin.html";



        },700);







    }

    catch(error){



        console.error(error);



        showMessage(
            "Greška kod prijave."
        );



    }

    finally {



        if(loginButton){



            loginButton.disabled = false;



            loginButton.textContent =
            "🔐 Prijavi se";


        }


    }



}
