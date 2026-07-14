/**
 * PAGE 2
 * Profil + Score + Abonnement + Installation PWA
 */


document.addEventListener(
"DOMContentLoaded",
()=>{


// =================================
// RECUPERATION UTILISATEUR
// =================================


const user =

JSON.parse(
localStorage.getItem("user")
);



let nomEnfant = "Joueur";


if(user && user.name){

nomEnfant = user.name;

}





// =================================
// SCORE
// =================================


const score =

Number(
localStorage.getItem("scoreTotal")
) || 0;





const nameField =

document.getElementById(
"player-name"
);



const avatarField =

document.getElementById(
"player-avatar"
);



const scoreField =

document.getElementById(
"score-counter"
);





// Afficher nom

if(nameField){

nameField.textContent =
nomEnfant;

}




// Avatar

if(avatarField){

avatarField.textContent =

nomEnfant
.charAt(0)
.toUpperCase();

}




// Score

if(scoreField){

scoreField.textContent =

`⭐ ${score}`;

}







// =================================
// BOUTONS MATIERES
// =================================


const boutons =

document.querySelectorAll(
".game-card-btn"
);



boutons.forEach(
bouton=>{


bouton.addEventListener(
"click",
()=>{


const matiere =

bouton.dataset.game;



console.log(
"Début exercice :",
matiere
);



});


});









// =================================
// ABONNEMENT
// =================================


const abonnementBtn =

document.getElementById(
"subscription-btn"
);





if(
user &&
abonnementBtn &&
user.dateFin
){



const date =

new Date(
user.dateFin
);





const jour =

String(
date.getDate()
)
.padStart(2,"0");





const mois =

String(
date.getMonth()+1
)
.padStart(2,"0");





const annee =

date.getFullYear();






abonnementBtn.innerHTML =

`

<span class="sub-title">

Abonnement manaraka

</span>


<span class="sub-date">

${jour}/${mois}/${annee}

</span>

`;



}



});









