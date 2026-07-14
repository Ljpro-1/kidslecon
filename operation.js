// ==========================================================================
// CONFIGURATION GLOBALE ET LOGIQUE DE NAVIGATION
// ==========================================================================
let nombreTentatives = 0;
let scoreExercice = parseInt(localStorage.getItem("scoreOperations")) || 0;

let operationSelectionnee = "";
let modeSelectionne = "";
let valeurReponseCorrecte = 0;
let intervalVideoSimulation = null;
let indexExempleActuel = 0;

const sections = {
    menuOp: document.getElementById('menu-operations'),
    menuModes: document.getElementById('menu-modes'),
    zoneAffichage: document.getElementById('zone-affichage'),
    contentLecon: document.getElementById('content-lecon'),
    contentExercice: document.getElementById('content-exercice')
};

// Banque de 10 exemples progressifs en français par opération
const banqueExemplesLecons = {
    addition: [
        { n1: 5, n2: 4, res: 9 }, { n1: 8, n2: 7, res: 15 }, { n1: 6, n2: 6, res: 12 },
        { n1: 9, n2: 3, res: 12 }, { n1: 4, n2: 7, res: 11 }, { n1: 10, n2: 5, res: 15 },
        { n1: 7, n2: 6, res: 13 }, { n1: 3, n2: 9, res: 12 }, { n1: 8, n2: 4, res: 12 },
        { n1: 9, n2: 8, res: 17 }
    ],
    soustraction: [
        { n1: 9, n2: 4, res: 5 }, { n1: 7, n2: 3, res: 4 }, { n1: 10, n2: 6, res: 4 },
        { n1: 8, n2: 5, res: 3 }, { n1: 12, n2: 4, res: 8 }, { n1: 6, n2: 2, res: 4 },
        { n1: 11, n2: 7, res: 4 }, { n1: 15, n2: 5, res: 10 }, { n1: 9, n2: 6, res: 3 },
        { n1: 14, n2: 8, res: 6 }
    ],
    division: [
        { n1: 12, n2: 3, res: 4 }, { n1: 6, n2: 2, res: 3 }, { n1: 8, n2: 4, res: 2 },
        { n1: 10, n2: 5, res: 2 }, { n1: 15, n2: 3, res: 5 }, { n1: 9, n2: 3, res: 3 },
        { n1: 16, n2: 4, res: 4 }, { n1: 14, n2: 2, res: 7 }, { n1: 20, n2: 5, res: 4 },
        { n1: 18, n2: 3, res: 6 }
    ]
};

function choisirOperation(typeOp) {
    operationSelectionnee = typeOp;
    sections.menuOp.classList.add('hidden');
    sections.menuModes.classList.remove('hidden');
    
    const nomsOp = { 
        addition: "L'Addition (+)", soustraction: "La Soustraction (-)", 
        multiplication: "La Multiplication (×)", division: "La Division (÷)" 
    };
    document.getElementById('selected-op-title').textContent = nomsOp[typeOp];
}

function retourMenuOperations() {
    sections.menuModes.classList.add('hidden');
    sections.menuOp.classList.remove('hidden');
    arreterVideoSimulation();
}

function ouvrirMode(typeMode) {
    modeSelectionne = typeMode;
    sections.menuModes.classList.add('hidden');
    sections.zoneAffichage.classList.remove('hidden');

    if (modeSelectionne === "lecon") {
        sections.contentLecon.classList.remove('hidden');
        sections.contentExercice.classList.add('hidden');
        indexExempleActuel = 0;
        genererLeconStructure();
    } else {
    sections.contentExercice.classList.remove('hidden');
    sections.contentLecon.classList.add('hidden');

    document.getElementById('exercise-score-val').textContent = scoreExercice;

    genererNouvelExerciceAutomatique();
}
}

function retourMenuModes() {
    sections.zoneAffichage.classList.add('hidden');
    sections.menuModes.classList.remove('hidden');
    arreterVideoSimulation();
}

function changerExempleLecon(direction) {
    indexExempleActuel += direction;
    if (indexExempleActuel < 0) indexExempleActuel = 9;
    if (indexExempleActuel > 9) indexExempleActuel = 0;
    genererLeconStructure();
}

// ==========================================================================
// CONSTRUCTEUR DE LEÇONS ET ANIMATIONS INTERACTIVES
// ==========================================================================

function genererLeconStructure() {
    arreterVideoSimulation();
    const titleObj = document.getElementById('lecon-title');
    const boxVisual = document.getElementById('lecon-visual-box');
    const btnPlay = document.getElementById('btn-play-video');

    boxVisual.innerHTML = "";
    btnPlay.classList.remove('hidden');

    let navExemplesHtml = "";
    if (operationSelectionnee !== "multiplication") {
        navExemplesHtml = `
            <div style="margin-bottom: 20px; display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
                <button class="btn-back" onclick="changerExempleLecon(-1)">◀ Précédent</button>
                <span style="font-weight: 700; align-self: center; font-size: 1rem;">Exemple ${indexExempleActuel + 1} / 10</span>
                <button class="btn-back" onclick="changerExempleLecon(1)">Suivant ▶</button>
            </div>
        `;
    }

    if (operationSelectionnee === "addition") {
        const exemple = banqueExemplesLecons.addition[indexExempleActuel];
        titleObj.innerHTML = `${navExemplesHtml} Leçon animée : ${exemple.n1} + ${exemple.n2}`;
        boxVisual.innerHTML = `<div class="baton-group" id="group-a"></div><div class="math-text" id="signe-op">+</div><div class="baton-group" id="group-b"></div><div class="math-text" id="resultat-lecon"></div>`;
        btnPlay.onclick = () => simulerVideoAddition(exemple.n1, exemple.n2, exemple.res);
    } 
    else if (operationSelectionnee === "soustraction") {
        const exemple = banqueExemplesLecons.soustraction[indexExempleActuel];
        titleObj.innerHTML = `${navExemplesHtml} Leçon animée : ${exemple.n1} - ${exemple.n2}`;
        let batonsInitiaux = "";
        for(let i=0; i < exemple.n1; i++) batonsInitiaux += "|";
        // Correction ici : affiche bien "= ?" au lieu de tricher avec le premier nombre
        boxVisual.innerHTML = `<div class="baton-group" id="group-main">${batonsInitiaux}</div><div class="math-text" id="resultat-lecon">= ?</div>`;
        btnPlay.onclick = () => simulerVideoSoustraction(exemple.n1, exemple.n2, exemple.res);
    } 

    else if (operationSelectionnee === "multiplication") {
        titleObj.textContent = "Tables de Multiplication (de 1 à 10)";
        btnPlay.classList.add('hidden');
        let scroller = `<div class="tables-scroller">`;
        for (let t = 1; t <= 10; t++) {
            scroller += `<div class="table-card"><h4>Table de ${t}</h4>`;
            for (let i = 1; i <= 10; i++) scroller += `<p>${t} × ${i} = ${t * i}</p>`;
            scroller += `</div>`;
        }
        scroller += `</div>`;
        boxVisual.innerHTML = scroller;
    } 
    else if (operationSelectionnee === "division") {
        const exemple = banqueExemplesLecons.division[indexExempleActuel];
        titleObj.innerHTML = `${navExemplesHtml} Leçon animée : ${exemple.n1} ÷ ${exemple.n2}`;
        let batonsInitiaux = "";
        for(let i=0; i < exemple.n1; i++) batonsInitiaux += "|";
        boxVisual.innerHTML = `<div class="baton-group" id="div-main">${batonsInitiaux}</div><div class="math-text" id="resultat-lecon">On va partager ${exemple.n1} en ${exemple.n2} paquets...</div>`;
        btnPlay.onclick = () => simulerVideoDivision(exemple.n1, exemple.n2, exemple.res);
    }
}

function simulerVideoAddition(n1, n2, total) {
    arreterVideoSimulation();
    const gA = document.getElementById('group-a');
    const gB = document.getElementById('group-b');
    const res = document.getElementById('resultat-lecon');
    gA.textContent = ""; gB.textContent = ""; res.textContent = "";

    let step = 0;
    intervalVideoSimulation = setInterval(() => {
        // ÉTAPE 1 : On dessine le groupe A, un par un
        if (step < n1) { 
            gA.textContent += "|"; 
        } 
        // ÉTAPE 2 : On dessine le groupe B, un par un
        else if (step < (n1 + n2)) { 
            gB.textContent += "|"; 
        } 
        // ÉTAPE 3 : Message de transition
        else if (step === (n1 + n2)) { 
            res.textContent = "On compte et on coche un par un..."; 
        } 
        // ÉTAPE 4 : COCHAGE UN PAR UN STRICT (D'abord tout le groupe A, puis tout le groupe B)
        else {
            const indexCochageGlobal = step - (n1 + n2 + 1); // Nombre total de bâtonnets cochés

            if (indexCochageGlobal < (n1 + n2)) {
                let htmlA = "";
                let htmlB = "";

                // On coche le groupe A un par un
                for (let i = 0; i < n1; i++) {
                    if (indexCochageGlobal >= i) {
                        htmlA += `<span class="baton-crossed">|</span>`;
                    } else {
                        htmlA += "|";
                    }
                }

                // On coche le groupe B seulement quand le groupe A est entièrement fini
                for (let i = 0; i < n2; i++) {
                    if (indexCochageGlobal >= (n1 + i)) {
                        htmlB += `<span class="baton-crossed">|</span>`;
                    } else {
                        htmlB += "|";
                    }
                }

                gA.innerHTML = htmlA;
                gB.innerHTML = htmlB;
                
                // On affiche le compteur qui monte un par un en direct !
                res.textContent = `= ${indexCochageGlobal + 1}`;
            } else {
                // Fin de l'animation quand tout est coché
                res.innerHTML = `= ${total} <br><small style="font-size:0.9rem; color:green;">Parfait ! On a compté ${total} bâtonnets en tout !</small>`;
                arreterVideoSimulation();
            }
        }
        step++;
    }, 450); // Vitesse de 250ms pour que l'enfant ait le temps de suivre le rythme du comptage
}

function simulerVideoSoustraction(n1, n2, reste) {
    arreterVideoSimulation();
    const gMain = document.getElementById('group-main');
    const res = document.getElementById('resultat-lecon');
    let batonsArray = [];
    for(let i=0; i<n1; i++) batonsArray.push("|");
    gMain.innerHTML = batonsArray.join(""); res.textContent = `= ${n1}`;

    let step = 0;
    intervalVideoSimulation = setInterval(() => {
        if (step < n2) {
            batonsArray[step] = `<span class="baton-crossed">|</span>`;
            gMain.innerHTML = batonsArray.join("");
            res.textContent = `On enlève ${step + 1} ... il reste = ${n1 - (step + 1)}`;
            step++;
        } else {
            res.innerHTML = `= ${reste} <br><small style="font-size:0.9rem; color:blue;">Il reste ${reste} bâtonnets non cochés !</small>`;
            arreterVideoSimulation();
        }
    }, 400);
}

function simulerVideoDivision(n1, n2, quotient) {
    arreterVideoSimulation();
    const box = document.getElementById('lecon-visual-box');
    box.innerHTML = `<div class="baton-group" id="div-main"></div><div class="math-text" id="resultat-lecon">Partage en cours...</div>`;
    const divMain = document.getElementById('div-main');
    for(let i=0; i < n1; i++) divMain.textContent += "|";

    setTimeout(() => {
        let paquetsHtml = `<div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">`;
        for (let p = 0; p < n2; p++) {
            let batonsPaquet = "";
            for(let b=0; b < quotient; b++) batonsPaquet += "|";
            paquetsHtml += `<div class="table-card" style="border:2px solid var(--secondary)">📦 Paquet ${p+1}<br><span style="font-size:1.5rem; letter-spacing:2px; font-weight:700; color:purple;">${batonsPaquet}</span></div>`;
        }
        paquetsHtml += `</div><div class="math-text" style="margin-top:16px; font-size:1.3rem;">On obtient ${n2} paquets contenant chacun ${quotient} bâtonnets ! (Réponse = ${quotient})</div>`;
        box.innerHTML = paquetsHtml;
    }, 1200);
}

function arreterVideoSimulation() {
    if (intervalVideoSimulation) { clearInterval(intervalVideoSimulation); intervalVideoSimulation = null; }
}


// ==========================================================================
// MOTEUR GÉNÉRATEUR D'EXERCICES INFINIS ET AUTOMATIQUES
// ==========================================================================

function genererNouvelExerciceAutomatique() {

    // Nouvelle question = nouveau compteur d'erreurs
    nombreTentatives = 0;

    // Nettoyage de l'interface
    const input = document.getElementById('user-answer');
    const feedback = document.getElementById('exercise-feedback');
    const txtQ = document.getElementById('question-text');

    input.value = "";
    feedback.textContent = "";
    feedback.style.color = "";

    let n1 = 0;
    let n2 = 0;

    switch (operationSelectionnee) {

        case "addition":

            n1 = Math.floor(Math.random() * 50) + 1;
            n2 = Math.floor(Math.random() * 50) + 1;

            valeurReponseCorrecte = n1 + n2;

            txtQ.textContent = `${n1} + ${n2} = ?`;

            break;


        case "soustraction":

            // Toujours éviter un résultat négatif
            n1 = Math.floor(Math.random() * 80) + 20;
            n2 = Math.floor(Math.random() * (n1 - 1)) + 1;

            valeurReponseCorrecte = n1 - n2;

            txtQ.textContent = `${n1} - ${n2} = ?`;

            break;


        case "multiplication":

            n1 = Math.floor(Math.random() * 10) + 1;
            n2 = Math.floor(Math.random() * 10) + 1;

            valeurReponseCorrecte = n1 * n2;

            txtQ.textContent = `${n1} × ${n2} = ?`;

            break;


        case "division":

            // Division toujours exacte
            n2 = Math.floor(Math.random() * 9) + 2;
            valeurReponseCorrecte = Math.floor(Math.random() * 10) + 2;

            n1 = n2 * valeurReponseCorrecte;

            txtQ.textContent = `${n1} ÷ ${n2} = ?`;

            break;


        default:

            txtQ.textContent = "Choisis une opération";
            valeurReponseCorrecte = 0;

            break;
    }

    // Remet le focus directement dans la réponse
    input.focus();
}
function validerReponse(e) {
    e.preventDefault();

    const inputAns = document.getElementById('user-answer');
    const feedback = document.getElementById('exercise-feedback');
    const scoreAffichage = document.getElementById('exercise-score-val');

    const userSaisie = parseInt(inputAns.value.trim(), 10);

    if (isNaN(userSaisie)) return;

    nombreTentatives++;

    if (userSaisie === valeurReponseCorrecte) {

        // Bonne réponse
        scoreExercice += 1;

        feedback.textContent = "🏆 Excellent ! Ta réponse est juste ! +1 points 🎉";
        feedback.style.color = "var(--success)";

        // Mise à jour affichage score
        scoreAffichage.textContent = scoreExercice;

        // Sauvegarde locale
        localStorage.setItem("scoreOperations", scoreExercice);

        // Nouvelle question
        setTimeout(() => {
            nombreTentatives = 0;
            genererNouvelExerciceAutomatique();
        }, 1300);

    } 
    else {

        // Mauvaise réponse
        if (nombreTentatives < 3) {

            feedback.textContent = 
            `❌ Ce n'est pas correct. Essaie encore ! (${nombreTentatives}/3)`;

            feedback.style.color = "var(--primary)";

        } 
        else {

            // Après 3 erreurs : donner la réponse
            feedback.innerHTML = 
            `💡 La bonne réponse était : 
            <b>${valeurReponseCorrecte}</b><br>
            Regarde bien la méthode et essaie la prochaine question !`;

            feedback.style.color = "orange";


            // Pas de points, mais passage à la suivante
            setTimeout(() => {

                nombreTentatives = 0;
                genererNouvelExerciceAutomatique();

            }, 3000);
        }
    }
}
