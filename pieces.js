import { ajoutListenerAvis, ajoutListenerEnvoyerAvis } from "./avis.js";

// Récupération des piéces eventuellement stocké dans le localStorage
let pieces = window.localStorage.getItem("pieces");
console.log(pieces)
if (pieces === null) {
    //Récupération depuis l'API (pour récupérer depuis le fichier JSON on indiquera simpelemnt le nom du fichier json à la place de l'URL)
    const reponse = await fetch("http://localhost:8081/pieces");
    pieces = await reponse.json();
    //On peut également écrire:
    //const pieces = await fetch("http://localhost:8081/pieces").then(pieces => pieces.json());

    // Transformation des pièces en JSON
    const valeurPieces = JSON.stringify(pieces);

    // Stockage des informations dans le localStorage
    window.localStorage.setItem("pieces", valeurPieces);

} else {
    pieces = JSON.parse(pieces);
}



ajoutListenerEnvoyerAvis();

function genererPieces(pieces) {
    for (let i = 0; i < pieces.length; i++) {
        const article = pieces[i];

        //Création et remplissage des balises qui vont afficher les différents élément de l'article
        const imageElement = document.createElement("img");
        imageElement.src = article.image;

        const nomElement = document.createElement("h2");
        nomElement.innerText = article.nom;

        const prixElement = document.createElement("p");
        prixElement.innerText = `Prix: ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})`;

        const categorieElement = document.createElement("p");
        categorieElement.innerText = article.categorie ?? "(aucune catégorie)";

        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = `${article.description ?? "Pas de description pour le moment"}`;

        const disponibiliteElement = document.createElement("p");
        disponibiliteElement.innerText = article.disponibilité ? "En stock" : "Rupture de stock";

        const avisBouton = document.createElement("button");
        avisBouton.dataset.id = article.id;
        avisBouton.textContent = "Afficher les avis";

        //Rattachement des balises au DOM
        const sectionFiches = document.querySelector(".fiches");

        //On place chaque piece dans une balise article
        const pieceElement = document.createElement("article")
        sectionFiches.appendChild(pieceElement);

        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(nomElement);
        pieceElement.appendChild(prixElement);
        pieceElement.appendChild(categorieElement);
        pieceElement.appendChild(descriptionElement);
        pieceElement.appendChild(disponibiliteElement);
        pieceElement.appendChild(avisBouton);
    }
    ajoutListenerAvis();
}

genererPieces(pieces);

//Trie par prix croissant
const boutonTrierCroissant = document.querySelector(".btn-trier-croissant");
boutonTrierCroissant.addEventListener("click", () => {
    //copie de la liste à trier pour ne pas modifier l'original.
    const piecesOrdonnees = Array.from(pieces);
    /* Sort s'attend à recevoir un nombre de la fonction anonyme:
    si le nombre est positif, alors B sera rangé avant A ; 
    si le nombre est négatif, alors A sera rangé avant B ;
    si le nombre est zéro (0), alors l’ordre sera inchangé.*/
    piecesOrdonnees.sort(function (a, b) {
        return a.prix - b.prix;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnees);
})

//Trie par prix décroissant
const boutonTrierDecroissant = document.querySelector(".btn-trier-decroissant");
boutonTrierDecroissant.addEventListener("click", () => {
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function (a, b) {
        return b.prix - a.prix;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnees);
});

//Filtrer les pièces non abordables
const boutonFiltrerNonAbordable = document.querySelector(".btn-filtrer-non-abordable");
boutonFiltrerNonAbordable.addEventListener("click", () => {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.prix <= 35;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
});

//Filtrer les pièces sans description
const boutonFiltrerSansDescription = document.querySelector(".btn-filtrer-sans-description");
boutonFiltrerSansDescription.addEventListener("click", () => {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.description;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
});

//récupération uniquement des noms des articles (avec.map) inférieur à 35€ (on supprime avec splice)
const nomsAbordables = pieces.map(piece => piece.nom);
for (let i = pieces.length - 1; i >= 0; i--) {
    if (pieces[i].prix >= 35) {
        nomsAbordables.splice(i, 1);
    }
}
//création de la liste ul
const abordablesElements = document.createElement("ul");
//ajout de chaque noms à la liste
for (let i = 0; i < nomsAbordables.length; i++) {
    const abordableElement = document.createElement("li");
    abordableElement.innerText = nomsAbordables[i];
    abordablesElements.appendChild(abordableElement)
}
//Et on attache le tout dans la <div> prévu
document.querySelector(".abordables").appendChild(abordablesElements);


//récupération des noms et prix des articles (avec.map). On supprime les article indisponible avec splice
const nomsEtPrixDisponibles = pieces.map(piece => `${piece.nom} - ${piece.prix}€.`);
for (let i = pieces.length - 1; i >= 0; i--) {
    if (pieces[i].disponibilité === false) {
        nomsEtPrixDisponibles.splice(i, 1);
    }
}
// Ajout des éléments de la liste au html
const disponiblesElements = document.createElement("ul");
for (let i = 0; i < nomsEtPrixDisponibles.length; i++) {
    const disponibleElement = document.createElement("li");
    disponibleElement.innerText = nomsEtPrixDisponibles[i];
    disponiblesElements.appendChild(disponibleElement)
}
document.querySelector(".disponibles").appendChild(disponiblesElements);

//Ajout d'un addEventListener sur <input type="range" pour filtrer les prix
const rangePrix = document.querySelector(".filtres input");
rangePrix.addEventListener("input", () => {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.prix <= rangePrix.value;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
});

const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener("click", () => {
    window.localStorage.removeItem("pieces")
});