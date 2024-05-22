//Récupération depuis le fichier JSON (à voir en P3 pour l'instant on admet juste)
const reponse = await fetch("pieces-autos.json");
const pieces = await reponse.json();

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
}

const boutonTrier = document.querySelector(".btn-trier");
boutonTrier.addEventListener("click", () => {
    //copie de la liste à trier pour ne pas modifier l'original.
    const piecesOrdonnees = Array.from(pieces);
    /* Sort s'attend à recevoir un nombre de la fonction anonyme:
    si le nombre est positif, alors B sera rangé avant A ; 
    si le nombre est négatif, alors A sera rangé avant B ;
    si le nombre est zéro (0), alors l’ordre sera inchangé.*/
    piecesOrdonnees.sort(function (a, b) {
        return a.prix - b.prix;
    });
    console.log(pieces);
    console.log(piecesOrdonnees);
})

const boutonFiltrer = document.querySelector(".btn-filtrer");
boutonFiltrer.addEventListener("click", () => {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.prix <= 35;
    });
    console.log(piecesFiltrees);
});