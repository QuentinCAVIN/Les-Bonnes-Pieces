//Récupération depuis le fichier JSON (à voir en P3 pour l'instant on admet juste)
const reponse = await fetch("pieces-autos.json");
const pieces = await reponse.json();

//Récupération du premier article du json
const article = pieces[0];

//Création et remplissage des balises qui vont afficher les différents élément de l'article
const imageElement = document.createElement("img");
imageElement.src = article.image;

const nomElement = document.createElement("h2");
nomElement.innerText = article.nom;

const prixElement = document.createElement("p");
prixElement.innerText = `Prix: ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})`;

const categorieElement = document.createElement("p");
categorieElement.innerText = article.categorie ?? "(aucune catégorie)";

//Rattachement des balises au DOM
const sectionFiches = document.querySelector(".fiches");
sectionFiches.appendChild(imageElement);
sectionFiches.appendChild(nomElement);
sectionFiches.appendChild(prixElement);
sectionFiches.appendChild(categorieElement);