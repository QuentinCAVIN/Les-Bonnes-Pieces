/* global Chart */

//ajout de l'écoute du click sur le boutton "afficher commentaire" qui afficher les commentaires 
export function ajoutListenerAvis() {
    const piecesElements = document.querySelectorAll(".fiches article button");
    //On ajoute les avis sur chaque pieces
    for (let i = 0; i < piecesElements.length; i++) {
        piecesElements[i].addEventListener("click", async function (event) {
            const id = event.target.dataset.id;
            // on regarde en premier lieu si il y a des avis dans le localStorage
            let avis = window.localStorage.getItem(`${id}/avis`);
            // sinon, on récupére les avis depuis l'API
            if (avis === null) {
                const reponse = await fetch(`http://localhost:8081/pieces/${id}/avis`);
                avis = await reponse.json();
                // et on enregistre les avis dans le localStorage
                const valeurAvis = JSON.stringify(avis);
                window.localStorage.setItem(`${id}/avis`, valeurAvis);
            } else {
                avis = JSON.parse(avis)
            }
            const pieceElement = event.target.parentElement;
            //Pour chaque commentaire, on crée et rattache un <p> avec le commentaire à la pièce 
            const avisElement = document.createElement("p");
            for (let i = 0; i < avis.length; i++) {
                avisElement.innerHTML += `<b>${avis[i].utilisateur}:</b> ${avis[i].commentaire}<br>`;
            }
            pieceElement.appendChild(avisElement);
        });
    }
}

// ajout de l'écoute de la validation du formulaire d'ajout de commentaire
export function ajoutListenerEnvoyerAvis() {
    const formulaireAvis = document.querySelector(".formulaire-avis");
    formulaireAvis.addEventListener("submit", (event) => {
        //Pour empecher le comportement par defaut du navigateur(rechargement de la page)
        event.preventDefault();

        //Création de l'objet avis avec les valeurs du formulaire
        const avis = {
            pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
            utilisateur: event.target.querySelector("[name=utilisateur]").value,
            commentaire: event.target.querySelector("[name=commentaire]").value,
            nbEtoiles: parseInt(event.target.querySelector("[name=nbEtoiles]").value),
        }

        //Conversion de l'objet avis au format JSON
        const chargeUtile = JSON.stringify(avis);
        console.log(chargeUtile);
        // Envoie de la requête HTTP pour soumettre l'avis 
        fetch("http://localhost:8081/avis", {
            method: "POST", // pour la création
            headers: { "Content-Type": "application/json" }, // Indique que le corps de la requête est en JSON
            body: chargeUtile // le body au format JSON
        })
    })
}


export async function afficherGraphiqueAvis() {

    //Calcul du nombre de commentaire pour chaque nombre d'étoile
    const avis = await fetch(`http://localhost:8081/avis`).then(avis => avis.json());
    const nb_commentaires = [0, 0, 0, 0, 0];
    for (let commentaire of avis) {
        nb_commentaires[commentaire.nbEtoiles - 1]++;
    }

    // Légende qui s'affichera sur la gauche à côté de la barre horizontale
    const labels = ["5", "4", "3", "2", "1"];

    // Données et personnalisation du graphique
    const data = {
        labels: labels,
        datasets: [{
            label: "Étoiles attribuées",
            data: nb_commentaires.reverse(),
            backgroundColor: "rgba(255, 230, 0, 1)" //Jaune
        }]
    }

    // Objet de configuration final
    const config = {
        type: "bar",
        data: data,
        options: {
            indexAxis: "y",
        },
    };

    // Rendu du graphique dans l'élément canvas
    new Chart(
        document.querySelector("#graphique-avis"),
        config,
    );
}

export async function afficherGraphiqueDisponibilite() {

    //Calcul du nombre de commentaire pour le piéces disponible et indisponible
    //On récupère les piéces 
    const pieces = await fetch(`http://localhost:8081/pieces`).then(pieces => pieces.json());
    const nb_commentaires = [0, 0];
    for (let piece of pieces) {
        // on récupére les avis de chaque pieces
        const avis = await fetch(`http://localhost:8081/pieces/${piece.id}/avis`).then(avis => avis.json());
        // Pour chaque commentaire des avis d'une piece, si cette piéce est disponible on incrémente le 1er element de nb_commentaire 
        for (let i = 0; i < avis.length; i++) {
            if (piece.disponibilite === true) {
                nb_commentaires[0]++;
                // et le second élément dans le cas contraire
            } else {
                nb_commentaires[1]++;
            }
        }
    }

    // Légende qui s'affichera en dessosu des barres verticales
    const labels = ["Les pièces disponible", "Les pièce indisponible"];

    // Données et personnalisation du graphique
    const data = {
        labels: labels,
        datasets: [{
            label: "Nombre de commentaires sur: ",
            data: nb_commentaires,
            backgroundColor: "rgba(255, 230, 0, 1)" //Jaune
        }]
    }

    // Objet de configuration final
    const config = {
        type: "bar",
        data: data,
        options: {
            indexAxis: "x",
        },
    };

    // Rendu du graphique dans l'élément canvas
    new Chart(
        document.querySelector("#graphique-disponibilite"),
        config,
    );
}