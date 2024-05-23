export function ajoutListenerAvis() {
    const piecesElements = document.querySelectorAll(".fiches article button");

    for (let i = 0; i < piecesElements.length; i++) {
        piecesElements[i].addEventListener("click", async function (event) {
            const id = event.target.dataset.id;
            const reponse = await fetch(`http://localhost:8081/pieces/${id}/avis`);
            const avis = await reponse.json();
            const pieceElement = event.target.parentElement;

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