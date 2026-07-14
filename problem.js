// ============================================================================
// GEO.JS - MOTEUR INTELLIGENT DE PROBLÈMES GÉOMÉTRIQUES
// PARTIE 1/12 : CONFIGURATION ET BASE DE DONNÉES DES FORMES
// ============================================================================


// ============================================================================
// VARIABLES GLOBALES
// ============================================================================

let currentShape = null;
let currentExercise = null;

let scoreTotal = 0;
let nombreExercices = 0;

let niveauActuel = "facile";


// ============================================================================
// PARAMÈTRES DU JEU
// ============================================================================

const GAME_CONFIG = {

    pi: 3.14,

    noteMax: 10,

    toleranceResultat: 0.2,

    encouragements: [
        "Excellent travail !",
        "Bravo, tu progresses !",
        "Très bonne réflexion !",
        "Continue comme ça !",
        "Tu deviens un champion des maths !",
        "Super calcul !"
    ]

};


// ============================================================================
// BASE DE DONNÉES DES FORMES
// ============================================================================

const shapeDatabase = {


    // ------------------------------------------------------------------------
    // CARRÉ
    // ------------------------------------------------------------------------

    carre: {

        nom: "Carré",

        titre: "Le Carré",

        cssClass: "square-draw",

        symboles: {

            cote: "c"

        },

        formules: {

            perimetre: "c × 4",

            aire: "c × c"

        },


        unitePerimetre: "m",

        uniteAire: "m²",


        lesson: `

            <h3>Formules du carré</h3>

            <p>
            <strong>Périmètre :</strong>
            Côté × 4
            </p>

            <span class="explain-text">
            Un carré possède 4 côtés identiques.
            </span>


            <p>
            <strong>Aire :</strong>
            Côté × Côté
            </p>

            <span class="explain-text">
            On multiplie un côté par lui-même.
            </span>

        `

    },



    // ------------------------------------------------------------------------
    // RECTANGLE
    // ------------------------------------------------------------------------

    rectangle: {


        nom: "Rectangle",

        titre: "Le Rectangle",

        cssClass: "rectangle-draw",


        symboles: {

            longueur: "L",

            largeur: "l"

        },


        formules: {

            perimetre: "(L + l) × 2",

            aire: "L × l"

        },


        unitePerimetre: "m",

        uniteAire: "m²",



        lesson: `

            <h3>Formules du rectangle</h3>


            <p>
            <strong>Périmètre :</strong>
            (Longueur + Largeur) × 2
            </p>


            <span class="explain-text">
            On additionne les deux dimensions puis on multiplie par 2.
            </span>


            <p>
            <strong>Aire :</strong>
            Longueur × Largeur
            </p>


            <span class="explain-text">
            L'aire représente l'espace occupé par le rectangle.
            </span>


        `

    },




    // ------------------------------------------------------------------------
    // TRIANGLE
    // ------------------------------------------------------------------------

    triangle: {


        nom: "Triangle",

        titre: "Le Triangle",

        cssClass: "triangle-draw",


        symboles: {

            base: "b",

            hauteur: "h"

        },


        formules: {

            aire: "(b × h) ÷ 2"

        },


        uniteAire: "m²",


        lesson: `

            <h3>Formule du triangle</h3>


            <p>
            <strong>Aire :</strong>
            (Base × Hauteur) ÷ 2
            </p>


            <span class="explain-text">
            On calcule d'abord le rectangle imaginaire,
            puis on prend la moitié.
            </span>

        `


    },




    // ------------------------------------------------------------------------
    // PARALLÉLOGRAMME
    // ------------------------------------------------------------------------

    parallelogramme: {


        nom: "Parallélogramme",

        titre: "Le Parallélogramme",

        cssClass: "parallelogram-draw",


        symboles: {

            base:"b",

            hauteur:"h"

        },


        formules: {

            aire:"b × h"

        },


        uniteAire:"m²",



        lesson: `

            <h3>Formule du parallélogramme</h3>


            <p>
            <strong>Aire :</strong>
            Base × Hauteur
            </p>


            <span class="explain-text">
            La base et la hauteur permettent de trouver sa surface.
            </span>

        `


    },





    // ------------------------------------------------------------------------
    // TRAPÈZE
    // ------------------------------------------------------------------------

    trapeze:{


        nom:"Trapèze",

        titre:"Le Trapèze",

        cssClass:"trapezoid-draw",


        symboles:{


            grandeBase:"B",

            petiteBase:"b",

            hauteur:"h"


        },


        formules:{


            aire:"((B+b) × h) ÷ 2"


        },


        uniteAire:"m²",



        lesson:`

            <h3>Formule du trapèze</h3>


            <p>
            <strong>Aire :</strong>
            ((Grande base + Petite base) × Hauteur) ÷ 2
            </p>


            <span class="explain-text">
            On additionne les deux bases avant de multiplier.
            </span>


        `



    },





    // ------------------------------------------------------------------------
    // CERCLE
    // ------------------------------------------------------------------------

    cercle:{


        nom:"Cercle",

        titre:"Le Cercle",

        cssClass:"circle-draw",


        symboles:{


            rayon:"r",

            diametre:"d"


        },


        formules:{


            perimetre:"d × π"


        },


        unitePerimetre:"m",



        lesson:`

            <h3>Formule du cercle</h3>


            <p>
            <strong>Périmètre :</strong>
            Diamètre × π
            </p>


            <span class="explain-text">
            On utilise π = 3,14 pour calculer le tour du cercle.
            </span>


        `


    }


};



// ============================================================================
// FIN PARTIE 1
// ============================================================================



// ============================================================================
// GEO.JS
// PARTIE 2/12 : MOTEUR INTELLIGENT DE COMPARAISON
// ============================================================================



// ============================================================================
// NORMALISATION DES RÉPONSES
// Transforme différentes écritures en une forme comparable
// ============================================================================


function normalize(text) {

    if (!text) return "";

    return text

        .toString()

        .toLowerCase()

        // Supprime les espaces
        .replace(/\s+/g, "")

        // Transforme les symboles de multiplication
        .replace(/×/g, "*")
        .replace(/x/g, "*")

        // Transforme les divisions
        .replace(/÷/g, "/")

        // Remplace virgule par point
        .replace(/,/g, ".")

        // Supprime les accents
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")

        // Mots mathématiques courants
        .replace(/fois/g, "*")
        .replace(/multiplie/g, "*")
        .replace(/multiplication/g, "*")

        .replace(/plus/g, "+")
        .replace(/moins/g, "-")

        .trim();

}





// ============================================================================
// CALCULATEUR SÉCURISÉ
// Permet de comparer deux calculs équivalents
// Exemple:
// 8*4 = 8+8+8+8
// ============================================================================


function evaluateExpression(expression) {


    try {


        let clean = normalize(expression);



        // Autorise seulement les caractères mathématiques
        if (!/^[0-9+\-*/().]+$/.test(clean)) {

            return null;

        }



        return Function(
            `"use strict"; return (${clean})`
        )();



    }

    catch(error){

        return null;

    }


}





// ============================================================================
// COMPARAISON DES FORMULES
// Exemple accepté:
// c*4
// 4*c
// côté*4
// ============================================================================


function compareFormula(userFormula, validFormulas){


    const user = normalize(userFormula);


    if(user==="") return false;



    return validFormulas.some(formula => {


        return normalize(formula) === user;


    });


}







// ============================================================================
// COMPARAISON DES CALCULS
// Plus intelligente qu'une simple comparaison de texte
// ============================================================================


function compareCalculation(userCalculation, validCalculations){


    const userValue = evaluateExpression(userCalculation);



    if(userValue === null){

        return false;

    }



    return validCalculations.some(correct=>{


        const correctValue = evaluateExpression(correct);



        if(correctValue === null){

            return false;

        }



        return Math.abs(
            userValue - correctValue
        ) <= GAME_CONFIG.toleranceResultat;



    });



}





// ============================================================================
// COMPARAISON DU RÉSULTAT FINAL
// ============================================================================


function compareResult(userResult, expected){



    if(userResult === "" || userResult === null){

        return false;

    }



    const value = Number(
        userResult.replace(",", ".")
    );



    if(isNaN(value)){

        return false;

    }



    return Math.abs(
        value - expected
    ) <= GAME_CONFIG.toleranceResultat;



}






// ============================================================================
// CHOISIR UN ENCOURAGEMENT ALÉATOIRE
// ============================================================================


function getEncouragement(){


    const liste = GAME_CONFIG.encouragements;


    return liste[
        Math.floor(
            Math.random()*liste.length
        )
    ];


}





// ============================================================================
// FIN PARTIE 2
// ============================================================================

// ============================================================================
// GEO.JS
// PARTIE 3/12 : NAVIGATION ET AFFICHAGE DES LEÇONS
// ============================================================================




// ============================================================================
// CHANGER D'ÉCRAN
// ============================================================================

function showScreen(screenId){


    const screens = document.querySelectorAll(".screen");


    screens.forEach(screen=>{

        screen.classList.remove("active");

    });



    const target = document.getElementById(screenId);



    if(target){

        target.classList.add("active");

    }



    const modal = document.getElementById("result-modal");


    if(modal){

        modal.style.display="none";

    }



}







// ============================================================================
// SÉLECTION D'UNE FORME
// Appelé depuis les boutons du menu
// Exemple : selectShape("carre")
// ============================================================================


function selectShape(shape){



    if(!shapeDatabase[shape]){


        console.error(
            "Forme inconnue : ",
            shape
        );


        return;


    }



    currentShape = shape;



    const config = shapeDatabase[shape];



    const title = document.getElementById(
        "choice-title"
    );



    if(title){

        title.innerText =
        config.titre;

    }



    showScreen(
        "choice-screen"
    );



}







// ============================================================================
// DÉMARRER LA LEÇON
// ============================================================================


function startLesson(){



    const config =
    shapeDatabase[currentShape];



    if(!config){

        return;

    }




    const title =
    document.getElementById(
        "lesson-title"
    );



    if(title){


        title.innerText =
        "Leçon : " + config.titre;


    }





    const text =
    document.getElementById(
        "lesson-text"
    );



    if(text){


        text.innerHTML =
        config.lesson;


    }






    const draw =
    document.getElementById(
        "lesson-shape-draw"
    );



    if(draw){


        draw.className =
        "shape-icon-large " +
        config.cssClass;


    }






    showScreen(
        "lesson-screen"
    );



}








// ============================================================================
// RETOUR AU MENU PRINCIPAL
// ============================================================================


function backToMenu(){


    showScreen(
        "menu-screen"
    );


}







// ============================================================================
// INITIALISATION AU CHARGEMENT
// ============================================================================


document.addEventListener(
"DOMContentLoaded",
()=>{


    console.log(
        "Moteur géométrique chargé."
    );



});




// ============================================================================
// FIN PARTIE 3
// ============================================================================


// ============================================================================
// GEO.JS
// PARTIE 4/12 : GESTION DES EXERCICES
// ============================================================================





// ============================================================================
// TABLEAU DES GÉNÉRATEURS
// Chaque forme possède son créateur de problème
// ============================================================================


const exerciseGenerators = {


    carre: generateSquareExercise,

    rectangle: generateRectangleExercise,

    triangle: generateTriangleExercise,

    parallelogramme: generateParallelogramExercise,

    trapeze: generateTrapezoidExercise,

    cercle: generateCircleExercise


};








// ============================================================================
// DÉMARRER UN EXERCICE
// ============================================================================


function startExercise(){



    showScreen(
        "exercise-screen"
    );



    // Autoriser les champs vides
    // pour permettre la correction complète


    const inputs =
    document.querySelectorAll(
        "#exercise-form input"
    );



    inputs.forEach(input=>{


        input.removeAttribute(
            "required"
        );


    });





    generateNewExercise();



}








// ============================================================================
// CRÉER UN NOUVEL EXERCICE
// ============================================================================


function generateNewExercise(){



    const modal =
    document.getElementById(
        "result-modal"
    );



    if(modal){

        modal.style.display="none";

    }





    const form =
    document.getElementById(
        "exercise-form"
    );



    if(form){

        form.reset();

    }







    const generator =
    exerciseGenerators[currentShape];





    if(!generator){



        console.error(
            "Aucun générateur trouvé pour :",
            currentShape
        );


        return;



    }






    currentExercise =
    generator();





    displayExercise(
        currentExercise
    );



}









// ============================================================================
// AFFICHER L'EXERCICE DANS L'INTERFACE
// ============================================================================


function displayExercise(ex){



    if(!ex){

        return;

    }





    const statement =
    document.getElementById(
        "exercise-statement"
    );



    if(statement){


        statement.innerHTML =
        ex.enonce;


    }






    // Question 1

    if(ex.questions[0]){


        updateQuestionUI(
            1,
            ex.questions[0]
        );


    }







    // Question 2

    const q2 =
    document.querySelectorAll(
        ".question-block"
    )[1];



    const separator =
    document.querySelector(
        ".separator"
    );





    if(ex.questions.length > 1){



        if(q2){

            q2.style.display="block";

        }



        if(separator){

            separator.style.display="block";

        }





        updateQuestionUI(
            2,
            ex.questions[1]
        );



    }

    else{


        if(q2){

            q2.style.display="none";

        }


        if(separator){

            separator.style.display="none";

        }


    }



}








// ============================================================================
// METTRE À JOUR UNE QUESTION
// ============================================================================


function updateQuestionUI(number,question){



    const title =
    document.getElementById(
        `q${number}-text`
    );



    if(title){

        title.innerText =
        `${number}. ${question.titre}`;

    }






    const formula =
    document.getElementById(
        `q${number}-formula`
    );



    const calc =
    document.getElementById(
        `q${number}-calc`
    );



    const result =
    document.getElementById(
        `q${number}-res`
    );






    if(formula){

        

    }



    if(calc){

        calc.placeholder =
        ".";

    }



    if(result){

        result.placeholder =
        "Résultat final";

    }




}






// ============================================================================
// FIN PARTIE 4
// ============================================================================






const FORMULA_WEIGHT = 1;
const CALC_WEIGHT = 1;
const RESULT_WEIGHT = 1;


function normalizeMathText(text) {

    return text
        .toLowerCase()
        .trim()

        // accents
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")

        // symboles mathématiques
        .replace(/π/g, "pi")
        .replace(/,/g, ".")
        .replace(/×/g, "*")
        .replace(/x/g, "*")

        // mots mathématiques
        .replace(/fois/g, "*")
        .replace(/multiplie par/g, "*")
        .replace(/multiplie/g, "*")

        .replace(/divise par/g, "/")
        .replace(/divise/g, "/")

        // espaces
        .replace(/\s+/g, "")

        // variantes
        .replace(/3\.140+/g, "3.14")
        .replace(/diametre/g, "d")
        .replace(/rayon/g, "r")
        .replace(/base/g, "b")
        .replace(/hauteur/g, "h")
        .replace(/longueur/g, "l")
        .replace(/largeur/g, "la")

        .replace(/aire/g,"s")
        .replace(/surface/g,"s")
        .replace(/perimetre/g,"p");
}



function expressionsEquivalent(a,b){

    a = normalizeMathText(a);
    b = normalizeMathText(b);


    if(a === b) return true;


    // Multiplication inversée
    if(
        a.includes("*") &&
        b.includes("*")
    ){

        let partsA = a.split("*").sort();
        let partsB = b.split("*").sort();

        if(
            partsA.join("*") ===
            partsB.join("*")
        ){
            return true;
        }
    }


    // tolérance petite faute
    function distance(s1,s2){

        let matrix=[];

        for(let i=0;i<=s1.length;i++){
            matrix[i]=[i];
        }

        for(let j=0;j<=s2.length;j++){
            matrix[0][j]=j;
        }


        for(let i=1;i<=s1.length;i++){

            for(let j=1;j<=s2.length;j++){

                matrix[i][j]=Math.min(

                    matrix[i-1][j]+1,

                    matrix[i][j-1]+1,

                    matrix[i-1][j-1]+
                    (s1[i-1]===s2[j-1]?0:1)

                );
            }
        }

        return matrix[s1.length][s2.length];
    }


    return distance(a,b)<=2;
}





function numberEquivalent(user,expected){

    if(user==="") return false;


    user=user
        .replace(",",".")
        .trim();


    let n=parseFloat(user);


    if(isNaN(n)) return false;


    return Math.abs(n-expected)<0.1;
}






function checkAnswers(event){

    event.preventDefault();


    let totalBoxesCorrect=0;


    let totalSteps=
        currentExercise.questions.length*3;


    let correctionHtml="";



    currentExercise.questions.forEach((q,idx)=>{


        let id=idx+1;


        let formula=
            document.getElementById(
                `q${id}-formula`
            ).value;


        let calc=
            document.getElementById(
                `q${id}-calc`
            ).value;



        let result=
            document.getElementById(
                `q${id}-res`
            ).value;



        let formulaCorrect=
            q.formulesValides.some(
                f=>expressionsEquivalent(formula,f)
            );



        let calcCorrect=
            q.calculsValides.some(
                c=>expressionsEquivalent(calc,c)
            );



        let resultCorrect=
            numberEquivalent(
                result,
                q.resultatAttendu
            );




        if(formulaCorrect)
            totalBoxesCorrect++;


        if(calcCorrect)
            totalBoxesCorrect++;


        if(resultCorrect)
            totalBoxesCorrect++;




        correctionHtml += `

        <div class="correction-step">

            <h4>
            Question ${id} : ${q.titre}
            </h4>


            <p>
            Formule :
            ${formulaCorrect ? "✅ Correct" : "❌ À revoir"}
            </p>


            <p>
            Calcul :
            ${calcCorrect ? "✅ Correct" : "❌ À revoir"}
            </p>


            <p>
            Résultat :
            ${resultCorrect ? "✅ Correct" : "❌ À revoir"}
            </p>


            <div class="explain-text">

            ${q.explicationSimple}

            </div>


        </div>

        `;


    });



    let note =
        Math.round(
            (totalBoxesCorrect/totalSteps)*10
        );



    showResultModal(
        note,
        correctionHtml
    );

}


function showResultModal(note,content){


    const modal =
    document.getElementById(
        "result-modal"
    );


    const icon =
    document.getElementById(
        "modal-status-icon"
    );


    const title =
    document.getElementById(
        "modal-title"
    );


    const body =
    document.getElementById(
        "modal-body"
    );


    const buttons =
    document.getElementById(
        "modal-buttons"
    );



    if(note===10){

        icon.innerHTML="🏆";

        title.innerText =
        `Note : ${note}/10 - ${getEncouragement()}`;

        title.style.color="#2ecc71";


    }
    else if(note>=5){


        icon.innerHTML="👍";

        title.innerText =
        `Note : ${note}/10 - Continue tes efforts`;

        title.style.color="#f39c12";


    }
    else{


        icon.innerHTML="📝";

        title.innerText =
        `Note : ${note}/10 - À améliorer`;

        title.style.color="#e74c3c";


    }



    body.innerHTML = content;



    buttons.innerHTML = `

    <button 
    class="btn-submit"
    onclick="closeModal()">

    Refaire

    </button>


    <button 
    class="btn-submit"
    onclick="generateNewExercise()">

    Sujet suivant ➡️

    </button>

    `;



    modal.style.display="flex";


}





function closeModal(){

    const modal =
    document.getElementById(
        "result-modal"
    );


    if(modal){

        modal.style.display="none";

    }

}





function generateSquareExercise(){
    // Génère un côté variable entre 5 et 20 mètres
    const side = Math.floor(Math.random() * 16) + 5;

    // Tableaux de scénarios avec 6 options au total (3 d'origine + 3 nouveaux)
    const scenarios = [
        {
            text: `Rabe possède un terrain carré de <strong>${side} m</strong> de côté. Il veut installer une clôture autour du terrain. Le mètre de clôture coûte <strong>5000 Ar</strong>.`,
            price: 5000,
            type: "clôture"
        },
        {
            text: `Une école construit une aire de jeu carrée de <strong>${side} m</strong> de côté. Elle place une bordure de protection autour. Le mètre coûte <strong>3000 Ar</strong>.`,
            price: 3000,
            type: "bordure"
        },
        {
            text: `Koto fabrique un bac à sable carré de <strong>${side} m</strong> de côté. Le contour nécessite des planches à <strong>4000 Ar</strong> le mètre.`,
            price: 4000,
            type: "planches"
        },
        {
            text: `Une commune aménage un jardin public carré de <strong>${side} m</strong> de côté. Elle souhaite l'entourer de barrières de sécurité. Le mètre de barrière coûte <strong>6000 Ar</strong>.`,
            price: 6000,
            type: "barrières"
        },
        {
            text: `Ranaivo achète des pavés LED pour baliser le contour de sa terrasse carrée de <strong>${side} m</strong> de côté. Le coût du ruban lumineux est de <strong>7500 Ar</strong> le mètre.`,
            price: 7500,
            type: "pavés LED"
        },
        {
            text: `Pour sécuriser un poulailler carré de <strong>${side} m</strong> de côté, un éleveur achète du grillage. Le prix du grillage est de <strong>3500 Ar</strong> le mètre.`,
            price: 3500,
            type: "grillage"
        }
    ];

    // Sélection aléatoire du scénario
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    // Calculs dynamiques
    const perimeter = side * 4;
    const cost = perimeter * scenario.price;

    return {
        enonce: scenario.text,
        questions: [
            {
                titre: "Calculer le périmètre du carré.",
                unite: "m",
                formulesValides: [
                    "c×4", "4×c", "c+c+c+c",
                    "cote×4", "4×cote",
                    "côté×4", "4×côté",
                    "cote fois 4", "4 fois cote",
                    "côté fois 4", "4 fois côté",
                    "cote multiplie par 4", "4 multiplie par cote",
                    "côté multiplie par 4", "4 multiplie par côté",
                    "cote multiplié par 4", "4 multiplié par cote",
                    "côté multiplié par 4", "4 multiplié par côté",
                    "cote × 4", "4 × cote",
                    "côté × 4", "4 × côté",
                    "p=c×4", "p=4×c",
                    "p=cote×4", "p=4×cote",
                    "p=côté×4", "p=4×côté"
                ],
                // Remplacement des chaînes template figées par des opérations réelles évaluées dynamiquement
                calculsValides: [
                    `${side}*4`,
                    `4*${side}`,
                    `${side}+${side}+${side}+${side}`
                ],
                resultatAttendu: perimeter,
                explicationSimple: `Un carré possède 4 côtés égaux.\n\nFormule : <strong>Côté × 4</strong>.\n\nCalcul :\n<strong>${side} × 4 = ${perimeter} m</strong>.`
            },
            {
                titre: `Calculer le prix total des ${scenario.type}.`,
                unite: "Ar",
                formulesValides: [
                    "p×prix", "prix×p",
                    "perimetre × prix du metre",
                    "prix du metre × perimetre",
                    "Périmètre × prix d'un mètre",
                    
                    
                    "perimetre×prix", "prix×perimetre",
                    "périmètre×prix", "prix×périmètre",
                    "longueur×prix", "prix×longueur",
                    "p × prix", "prix × p",
                    "P×prix", "prix×P",
                    "P × prix", "prix × P",
                    "perimetre × prix", "prix × perimetre",
                    "périmètre × prix", "prix × périmètre",
                    "longueur × prix", "prix × longueur",
                    "p fois prix", "prix fois p",
                    "perimetre fois prix", "prix fois perimetre",
                    "périmètre fois prix", "prix fois périmètre",
                    "longueur fois prix", "prix fois longueur"
                ],
                // Remplacement des chaînes template figées par des opérations réelles évaluées dynamiquement
                calculsValides: [
                    `${perimeter}*${scenario.price}`,
                    `${scenario.price}*${perimeter}`
                ],
                resultatAttendu: cost,
                explicationSimple: `On utilise :\n\n<strong>Périmètre × prix du mètre</strong>.\n\nCalcul :\n<strong>${perimeter} × ${scenario.price} = ${cost} Ar</strong>.`
            }
        ]
    };
}


function generateRectangleExercise(){
    // Génération dynamique des dimensions
    const largeur = Math.floor(Math.random() * 6) + 4;
    const longueur = largeur + Math.floor(Math.random() * 6) + 3;

    // Tableaux de scénarios avec 6 options au total (3 d'origine + 3 nouveaux)
    const scenarios = [
        {
            text: `Un maçon prépare une cour rectangulaire de <strong>${longueur} m</strong> de longueur et <strong>${largeur} m</strong> de largeur. Il utilise <strong>2 sacs de ciment</strong> par mètre carré.`,
            quantity: 2,
            unit: "sacs de ciment"
        },
        {
            text: `Soa possède un potager rectangulaire de <strong>${longueur} m</strong> sur <strong>${largeur} m</strong>. Elle plante <strong>3 graines</strong> par mètre carré.`,
            quantity: 3,
            unit: "graines"
        },
        {
            text: `Un peintre travaille dans une salle rectangulaire de <strong>${longueur} m</strong> sur <strong>${largeur} m</strong>. Il faut <strong>4 pots</strong> de peinture par mètre carré.`,
            quantity: 4,
            unit: "pots de peinture"
        },
        {
            text: `Une association installe du gazon synthétique sur un terrain de sport de <strong>${longueur} m</strong> sur <strong>${largeur} m</strong>. Le rouleau coûte <strong>5 modules</strong> de fixation par mètre carré.`,
            quantity: 5,
            unit: "modules de fixation"
        },
        {
            text: `Un jardinier prépare un espace fleuri rectangulaire de <strong>${longueur} m</strong> de long et <strong>${largeur} m</strong> de large. Il prévoit <strong>6 bulbes</strong> de fleurs par mètre carré.`,
            quantity: 6,
            unit: "bulbes de fleurs"
        },
        {
            text: `Pour nettoyer une dalle rectangulaire de <strong>${longueur} m</strong> sur <strong>${largeur} m</strong>, une entreprise consomme <strong>2 litres</strong> de produit nettoyant par mètre carré.`,
            quantity: 2,
            unit: "litres de nettoyant"
        }
    ];

    // Sélection aléatoire du scénario
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    // Calculs dynamiques
    const area = longueur * largeur;
    const total = area * scenario.quantity;

    return {
        enonce: scenario.text,
        questions: [
            {
                titre: "Calculer l'aire du rectangle.",
                unite: "m²",
                // Correction du crochet ouvrant en trop qui rendait le tableau invalide
                formulesValides: [
                    "l×la", "la×l",
                    "l × la", "la × l",
                    "longueur×largeur", "largeur×longueur",
                    "longueur × largeur", "largeur × longueur",
                    "longueur fois largeur", "largeur fois longueur",
                    "longueur multiplié par largeur", "largeur multiplié par longueur",
                    "longueur multiplie par largeur", "largeur multiplie par longueur",
                    "longueur x largeur", "largeur x longueur",
                    "aire=longueur×largeur", "aire=largeur×longueur",
                    "s=l×la", "s=la×l",
                    "s=longueur×largeur", "s=largeur×longueur"
                ],
                calculsValides: [
                    `${longueur}*${largeur}`,
                    `${largeur}*${longueur}`
                ],
                resultatAttendu: area,
                explicationSimple: `Pour un rectangle :\n\n<strong>Longueur × Largeur</strong>.\n\nCalcul :\n<strong>${longueur} × ${largeur} = ${area} m²</strong>.`
            },
            {
                titre: `Calculer le nombre total de ${scenario.unit}.`,
                unite: scenario.unit,
                // Correction : Remplacement des formules d'aire par des formules de quantité totale (Aire * Quantité)
                formulesValides: [
                    "aire×quantite", "quantite×aire",
                    "aire×quantité", "quantité×aire",
                    "aire × quantite", "quantite × aire",
                    "aire × quantité", "quantité × aire",
                    "Air × quantité",
                    "surface×quantite", "quantite×surface",
                    "surface×quantité", "quantité×surface",
                    "aire fois quantite", "quantite fois aire",
                    "aire fois quantité", "quantité fois aire"
                ],
                calculsValides: [
                    `${area}*${scenario.quantity}`,
                    `${scenario.quantity}*${area}`
                ],
                resultatAttendu: total,
                                explicationSimple: `Formule :\n<strong>Aire × Quantité</strong>.\n\nCalcul :\n<strong>${area} × ${scenario.quantity} = ${total} ${scenario.unit}</strong>.`

            }
        ]
    };
}


function generateTriangleExercise(){


    const base =
    (Math.floor(Math.random()*5)+4)*2;


    const hauteur =
    (Math.floor(Math.random()*4)+2)*2;


    const cote1 =
    Math.floor(Math.random()*5)+5;


    const cote2 =
    Math.floor(Math.random()*5)+6;


    const cote3 =
    Math.floor(Math.random()*5)+7;



    const scenarios = [

        {

            text:
            `Un élève fabrique un panneau triangulaire. Sa base mesure <strong>${base} m</strong> et sa hauteur mesure <strong>${hauteur} m</strong>. Il colle <strong>3 images</strong> par mètre carré.`,

            quantity:3,

            unit:"images"

        },


        {

            text:
            `Un menuisier crée une étagère triangulaire. La base mesure <strong>${base} m</strong> et la hauteur mesure <strong>${hauteur} m</strong>. Il applique <strong>2 couches</strong> de vernis par mètre carré.`,

            quantity:2,

            unit:"couches de vernis"

        },


        {

            text:
            `Un jardinier prépare une décoration triangulaire. Sa base mesure <strong>${base} m</strong> et sa hauteur mesure <strong>${hauteur} m</strong>. Il plante <strong>4 fleurs</strong> par mètre carré.`,

            quantity:4,

            unit:"fleurs"

        }

    ];



    const scenario =
    scenarios[
        Math.floor(Math.random()*scenarios.length)
    ];



    const aire =
    (base*hauteur)/2;



    const total =
    aire*scenario.quantity;



    const perimetre =
    cote1+cote2+cote3;



    return {


        enonce:

        scenario.text
        +
        `<br><br>
        Pour le périmètre, les trois côtés du triangle mesurent :
        <strong>${cote1} m</strong>,
        <strong>${cote2} m</strong> et
        <strong>${cote3} m</strong>.`,


        questions:[



            {


                titre:
                "Calculer l'aire du triangle.",


                unite:"m²",



                formulesValides:[


                    "b*h/2",

                    "(b*h)/2",

                    "base*hauteur/2",

                    "(base*hauteur)/2",

                    "base fois hauteur divise par 2",

                    "base x hauteur / 2",

                    "aire triangle",

                    "s=b*h/2"


                ],



                calculsValides:[


                    `${base}*${hauteur}/2`,

                    `(${base}*${hauteur})/2`,

                    `${hauteur}*${base}/2`,

                    `(${hauteur}*${base})/2`


                ],



                resultatAttendu:

                aire,



                explicationSimple:


                `
                Pour trouver l'aire d'un triangle :

                <strong>
                (Base × Hauteur) ÷ 2
                </strong>

                <br><br>

                Calcul :

                <strong>
                (${base} × ${hauteur}) ÷ 2 = ${aire} m²
                </strong>
                `


            },





            {


                titre:

                `Calculer la quantité totale de ${scenario.unit}.`,


                unite:

                scenario.unit,



                formulesValides:[


                    "aire*quantite",

                    "surface*quantite",

                    "s*quantite",

                    "aire fois quantite",

                    "surface fois quantite",
                    "A × Q",
                    "a × q"


                ],



                calculsValides:[


                    `${aire}*${scenario.quantity}`,

                    `${scenario.quantity}*${aire}`


                ],



                resultatAttendu:

                total,



                explicationSimple:


                `
                On multiplie la surface par la quantité nécessaire.

                <br><br>

                Calcul :

                <strong>
                ${aire} × ${scenario.quantity}
                = ${total}
                </strong>
                `


            },





            {


                titre:

                "Calculer le périmètre du triangle.",



                unite:"m",



                formulesValides:[


                    "a+b+c",

                    "cote1+cote2+cote3",

                    "cote+cote+cote",

                    "addition des trois cotes",

                    "perimetre=a+b+c",

                    "p=a+b+c"


                ],



                calculsValides:[


                    `${cote1}+${cote2}+${cote3}`,

                    `${cote3}+${cote2}+${cote1}`,

                    `${cote2}+${cote1}+${cote3}`


                ],



                resultatAttendu:

                perimetre,



                explicationSimple:


                `
                Le périmètre d'un triangle est la somme des trois côtés.

                <br><br>

                Calcul :

                <strong>
                ${cote1} + ${cote2} + ${cote3}
                = ${perimetre} m
                </strong>
                `


            }


        ]

    };


}


function generateParallelogramExercise(){


    const base =
    Math.floor(Math.random()*8)+8;


    const hauteur =
    Math.floor(Math.random()*5)+4;



    const scenarios=[


        {

            text:
            `Une allée de jardin a une forme de parallélogramme. Sa base mesure <strong>${base} m</strong> et sa hauteur <strong>${hauteur} m</strong>. Le gazon coûte <strong>4000 Ar</strong> par mètre carré.`,

            price:4000

        },


        {

            text:
            `Une scène de spectacle possède un sol en forme de parallélogramme. Sa base mesure <strong>${base} m</strong> et sa hauteur <strong>${hauteur} m</strong>. Le revêtement coûte <strong>6000 Ar</strong> par mètre carré.`,

            price:6000

        }


    ];



    const scenario =
    scenarios[
        Math.floor(Math.random()*scenarios.length)
    ];



    const area =
    base*hauteur;


    const cost =
    area*scenario.price;




    return {


        enonce:
        scenario.text,



        questions:[


            {


                titre:
                "Calculer l'aire du parallélogramme.",


                unite:"m²",



                formulesValides:[
"b*h",
"h*b",
"base*hauteur",
"hauteur*base",
"base fois hauteur",
"base x hauteur",
"s=b*h",
"aire parallelogramme"
],


                calculsValides:[

                    `${base}*${hauteur}`,
                    `${hauteur}*${base}`

                ],



                resultatAttendu:
                area,



                explicationSimple:

                `Formule :
                <strong>Base × Hauteur</strong>.
                
                Calcul :
                <strong>${base} × ${hauteur} = ${area} m²</strong>.`

            },




            {


                titre:
                "Calculer le prix total.",


                unite:"Ar",



                formulesValides:[

                    "aire*prix",
                    "surface*prix",
                    "s*prix",
                    "air × prix",
                    "prix × air",
                    "surface × prix",
                    "prix × surface"

                ],



                calculsValides:[

                    `${area}*${scenario.price}`,
                    `${scenario.price}*${area}`

                ],



                resultatAttendu:
                cost,



                explicationSimple:

                `Formule :
                <strong>Aire × Prix</strong>.
                
                Calcul :
                <strong>${area} × ${scenario.price} = ${cost} Ar</strong>.`

            }


        ]



    };


}



function generateTrapezoidExercise(){
    // Génération dynamique des dimensions
    const petiteBase = Math.floor(Math.random() * 5) + 5;
    const grandeBase = petiteBase + Math.floor(Math.random() * 6) + 4;
    const hauteur = Math.floor(Math.random() * 4) + 3;

    const area = ((grandeBase + petiteBase) * hauteur) / 2;

    // Tableaux de scénarios avec 5 options au total (2 d'origine + 3 nouveaux)
    const scenarios = [
        `Un potager d'école possède une forme de trapèze. La grande base mesure <strong>${grandeBase} m</strong>, la petite base mesure <strong>${petiteBase} m</strong> et la hauteur mesure <strong>${hauteur} m</strong>.`,
        `Une cour de jeu a une forme de trapèze. Elle possède une grande base de <strong>${grandeBase} m</strong>, une petite base de <strong>${petiteBase} m</strong> et une hauteur de <strong>${hauteur} m</strong>.`,
        `Le toit d'un hangar en construction a une face en forme de trapèze. Sa grande base est de <strong>${grandeBase} m</strong>, sa petite base est de <strong>${petiteBase} m</strong> et sa hauteur est de <strong>${hauteur} m</strong>.`,
        `Un terrain d'entraînement municipal est configuré en trapèze. Il présente une grande base de <strong>${grandeBase} m</strong>, une petite base de <strong>${petiteBase} m</strong> et une hauteur de <strong>${hauteur} m</strong>.`,
        `Une bâche de protection sur mesure a la forme d'un trapèze. Elle mesure <strong>${grandeBase} m</strong> de grande base, <strong>${petiteBase} m</strong> de petite base et <strong>${hauteur} m</strong> de hauteur.`
    ];

    return {
        enonce: scenarios[Math.floor(Math.random() * scenarios.length)],
        questions: [
            {
                titre: "Calculer l'aire du trapèze.",
                unite: "m²",
                // Correction du crochet ouvrant en trop qui rendait le tableau invalide
                formulesValides: [
                    "((gb+pb)×h)/2", "(gb+pb)×h/2", "(h×(gb+pb))/2", "h×(gb+pb)/2",
                    "((pb+gb)×h)/2", "(pb+gb)×h/2", "(h×(pb+gb))/2", "h×(pb+gb)/2",
                    "((grande base+petite base)×hauteur)/2", "(grande base+petite base)×hauteur/2", "(hauteur×(grande base+petite base))/2", "hauteur×(grande base+petite base)/2",
                    "((petite base+grande base)×hauteur)/2", "(petite base+grande base)×hauteur/2", "(hauteur×(petite base+grande base))/2", "hauteur×(petite base+grande base)/2",
                    "((gb+pb)/2)×h", "((pb+gb)/2)×h", "(h×((gb+pb)/2))", "(h×((pb+gb)/2))",
                    "((grande base+petite base)/2)×hauteur", "((petite base+grande base)/2)×hauteur", "hauteur×((grande base+petite base)/2)", "hauteur×((petite base+grande base)/2)",
                    "(grande base+petite base) fois hauteur divisé par 2", "(petite base+grande base) fois hauteur divisé par 2", "hauteur fois (grande base+petite base) divisé par 2", "hauteur fois (petite base+grande base) divisé par 2",
                    "addition des bases fois hauteur divisé par deux", "hauteur fois addition des bases divisé par deux",
                    "s=((gb+pb)×h)/2", "s=(gb+pb)×h/2", "s=((pb+gb)×h)/2", "s=(pb+gb)×h/2",
                    "s=((grande base+petite base)×hauteur)/2", "s=(grande base+petite base)×hauteur/2", "s=((petite base+grande base)×hauteur)/2", "s=(petite base+grande base)×hauteur/2"
                ],
                calculsValides: [
                    `((${grandeBase}+${petiteBase})*${hauteur})/2`,
                    `(${grandeBase}+${petiteBase})*${hauteur}/2`
                ],
                resultatAttendu: area,
                explicationSimple: `Formule :\n<strong>((Grande base + Petite base) × Hauteur) ÷ 2</strong>.\n\nCalcul :\n<strong>((${grandeBase}+${petiteBase}) × ${hauteur}) ÷ 2 = ${area} m²</strong>.`
            }
        ]
    };
}







function generateCircleExercise(){
    // Génère un rayon variable entre 3 et 8 mètres
    const rayon = Math.floor(Math.random() * 6) + 3;
    const diametre = rayon * 2;

    // Utilisation directe de 3.14 pour s'aligner sur l'énoncé et éviter les erreurs de variable globale manquante
    const piValue = 3.14; 
    const perimetre = Math.round(diametre * piValue * 100) / 100;

    // Tableaux de scénarios avec 5 options au total (2 d'origine + 3 nouveaux)
    const scenarios = [
        `Une table ronde possède un rayon de <strong>${rayon} m</strong>. Un menuisier veut placer une décoration tout autour.`,
        `Une fontaine circulaire possède un rayon de <strong>${rayon} m</strong>. Les ouvriers installent une bordure autour.`,
        `Un bassin de jardin circulaire possède un rayon de <strong>${rayon} m</strong>. Son propriétaire souhaite installer une barrière de protection tout autour.`,
        `La piste d'un manège de chevaux de bois possède un rayon de <strong>${rayon} m</strong>. Un technicien pose un ruban antidérapant sur son contour.`,
        `Une arène de cirque circulaire possède un rayon de <strong>${rayon} m</strong>. Les décorateurs installent une bande de tapis rouge autour de la piste.`
    ];

    return {
        enonce: scenarios[Math.floor(Math.random() * scenarios.length)] + ` On utilise <strong>π = 3,14</strong>.`,
        questions: [
            {
                titre: "Calculer le périmètre du cercle.",
                unite: "m",
                // Correction du crochet ouvrant en trop qui rendait le tableau invalide
                formulesValides: [
                    "d×3.14", "3.14×d", "d×π", "π×d", "d×pi", "pi×d",
                    "diametre×3.14", "3.14×diametre", "diametre×π", "π×diametre", "diametre×pi", "pi×diametre",
                    "diametre fois 3.14", "3.14 fois diametre", "diametre fois π", "π fois diametre", "diametre fois pi", "pi fois diametre",
                    "diametre × 3.14", "3.14 × diametre", "diametre × π", "π × diametre", "diametre × pi", "pi × diametre",
                    "2×3.14×r", "2×r×3.14", "3.14×2×r", "3.14×r×2", "r×2×3.14", "r×3.14×2",
                    "2×π×r", "2×r×π", "π×2×r", "π×r×2", "r×2×π", "r×π×2",
                    "2×pi×r", "2×r×pi", "pi×2×r", "pi×r×2", "r×2×pi", "r×pi×2",
                    "2 fois π fois rayon", "2 fois pi fois rayon", "π fois 2 fois rayon", "pi fois 2 fois rayon", "rayon fois 2 fois π", "rayon fois 2 fois pi",
                    "2 × 3.14 × rayon", "3.14 × 2 × rayon", "rayon × 2 × 3.14", "rayon × 3.14 × 2",
                    "p=d×π", "p=π×d", "p=d×pi", "p=pi×d", "p=d×3.14", "p=3.14×d"
                ],
                calculsValides: [
                    `${diametre}*3.14`,
                    `2*3.14*${rayon}`
                ],
                resultatAttendu: perimetre,
                explicationSimple: `Formule :\n<strong>Diamètre × π</strong>.\n\nCalcul :\n<strong>${diametre} × 3,14 = ${perimetre} m</strong>.`
            }
        ]
    };
}

// Objet préservé pour le suivi des progrès de l'élève
const studentProgress = {
    exercices: 0,
    points: 0,
    reussites: 0,
    echecs: 0,
    formes: {
        carre: 0,
        rectangle: 0,
        triangle: 0,
        parallelogramme: 0,
        trapeze: 0,
        cercle: 0
    }
};


function loadProgress(){


    const saved =
    localStorage.getItem(
        "geoProgress"
    );



    if(saved){


        Object.assign(
            studentProgress,
            JSON.parse(saved)
        );


    }


}





function saveProgress(){


    localStorage.setItem(

        "geoProgress",

        JSON.stringify(
            studentProgress
        )

    );


}





function updateProgress(note){


    studentProgress.exercices++;


    studentProgress.points += note;



    if(note>=5){

        studentProgress.reussites++;

    }
    else{

        studentProgress.echecs++;

    }



    if(studentProgress.formes[currentShape]!==undefined){


        studentProgress.formes[currentShape]++;


    }



    updateLevel();


    saveProgress();



}







function updateLevel(){


    const moyenne =

    studentProgress.points /

    Math.max(
        studentProgress.exercices,
        1
    );



    if(moyenne>=9){


        niveauActuel="expert";


    }

    else if(moyenne>=7){


        niveauActuel="avancé";


    }

    else if(moyenne>=5){


        niveauActuel="moyen";


    }

    else{


        niveauActuel="débutant";


    }



}







function getDifficulty(){



    switch(niveauActuel){


        case "expert":

            return {
                min:20,
                max:200
            };


        case "avancé":

            return {
                min:10,
                max:100
            };


        case "moyen":

            return {
                min:5,
                max:30
            };


        default:

            return {
                min:2,
                max:15
            };


    }



}





function getStudentMessage(){



    const messages=[


        "Continue tes efforts !",


        "Tes progrès sont visibles !",


        "Chaque exercice te rend plus fort !",


        "Les mathématiques deviennent faciles avec l'entraînement !"


    ];



    return messages[
        Math.floor(
            Math.random()*messages.length
        )
    ];



}





loadProgress();


function showResultModal(note, correctionHtml){


    updateProgress(note);



    const modal =
    document.getElementById(
        "result-modal"
    );


    const icon =
    document.getElementById(
        "modal-status-icon"
    );


    const title =
    document.getElementById(
        "modal-title"
    );


    const body =
    document.getElementById(
        "modal-body"
    );


    const buttons =
    document.getElementById(
        "modal-buttons"
    );



    const moyenne =

    (
        studentProgress.points /

        studentProgress.exercices

    ).toFixed(1);




    if(note===10){


        icon.innerHTML="🏆";


        title.innerHTML =
        `Note : ${note}/10<br>${getEncouragement()}`;


        title.style.color="#2ecc71";


    }

    else if(note>=5){


        icon.innerHTML="⭐";


        title.innerHTML =
        `Note : ${note}/10<br>Bon travail !`;


        title.style.color="#f39c12";


    }

    else{


        icon.innerHTML="📚";


        title.innerHTML =
        `Note : ${note}/10<br>Continue l'entraînement`;


        title.style.color="#e74c3c";


    }






    body.innerHTML = `


    <div class="student-score">


        <p>
        ${getStudentMessage()}
        </p>


        <hr>


        <p>
        Exercices réalisés :
        <strong>
        ${studentProgress.exercices}
        </strong>
        </p>


        <p>
        Moyenne générale :
        <strong>
        ${moyenne}/10
        </strong>
        </p>


        <p>
        Niveau :
        <strong>
        ${niveauActuel}
        </strong>
        </p>


        <hr>


        ${correctionHtml}


    </div>


    `;




    buttons.innerHTML = `


    <button
    class="btn-submit"
    onclick="closeModal()">

    Revoir

    </button>



    <button
    class="btn-submit"
    onclick="generateNewExercise()">

    Nouvel exercice ➡️

    </button>


    `;




    modal.style.display="flex";


}







function resetProgress(){


    localStorage.removeItem(
        "geoProgress"
    );


    location.reload();


}





function getStatistics(){


    return {


        exercices:
        studentProgress.exercices,


        points:
        studentProgress.points,


        moyenne:

        (
            studentProgress.points /

            Math.max(
                studentProgress.exercices,
                1
            )

        ).toFixed(1),


        niveau:
        niveauActuel,


        formes:
        studentProgress.formes


    };


}




function initGeoGame(){


    loadProgress();



    const form =
    document.getElementById(
        "exercise-form"
    );



    if(form){


        form.addEventListener(
            "submit",
            checkAnswers
        );


    }




    const savedShape =
    localStorage.getItem(
        "lastShape"
    );



    if(savedShape && shapeDatabase[savedShape]){


        currentShape =
        savedShape;


    }





    document.querySelectorAll(
        ".shape-button"
    )
    .forEach(button=>{


        button.addEventListener(
            "click",
            ()=>{


                const shape =
                button.dataset.shape;



                if(shapeDatabase[shape]){


                    currentShape =
                    shape;


                    localStorage.setItem(
                        "lastShape",
                        shape
                    );


                    selectShape(shape);


                }


            }
        );


    });





}







window.addEventListener(
"DOMContentLoaded",
()=>{


    initGeoGame();


});








document.addEventListener(
"keydown",
(event)=>{


    if(event.key==="Enter"){


        const modal =
        document.getElementById(
            "result-modal"
        );



        if(
            modal &&
            modal.style.display==="flex"
        ){


            closeModal();


        }


    }



});







function clearCurrentExercise(){


    currentExercise=null;



    const form =
    document.getElementById(
        "exercise-form"
    );



    if(form){


        form.reset();


    }


}






function getGameData(){


    return {


        forme:
        currentShape,


        exercice:
        currentExercise,


        progression:
        studentProgress,


        niveau:
        niveauActuel


    };


}
