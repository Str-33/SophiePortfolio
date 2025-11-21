// Stockage des données pour éviter les appels API répétés
let allWorks = [];
let allCategories = [];

// Fonction pour récupérer tous les projets
async function fetchWorks() {
    const url = "http://localhost:5678/api/works";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allWorks = await response.json();
        return allWorks;
    } catch (error) {
        console.error("Erreur lors du chargement des projets:", error.message);
        return [];
    }
}

// Fonction pour récupérer toutes les catégories
async function fetchCategories() {
    const url = "http://localhost:5678/api/categories";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allCategories = await response.json();
        return allCategories;
    } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error.message);
        return [];
    }
}

// Fonction pour créer un élément figure
function createFigure(data) {
    const figure = document.createElement("figure");
    figure.innerHTML = `
        <img src="${data.imageUrl}" alt="${data.title}">
        <figcaption>${data.title}</figcaption>
    `;
    return figure;
}

// Fonction pour afficher les projets (avec ou sans filtre)
function displayWorks(filterId = null) {
    const gallery = document.querySelector(".gallery");
    
    // Vérifier que la galerie existe
    if (!gallery) {
        console.error("La galerie n'existe pas dans le DOM");
        return;
    }
    
    // Vider la galerie
    gallery.innerHTML = "";
    
    // Filtrer les projets si nécessaire
    const worksToDisplay = filterId 
        ? allWorks.filter(work => work.categoryId === filterId)
        : allWorks;
    
    // Créer et ajouter les figures
    const fragment = document.createDocumentFragment();
    worksToDisplay.forEach(work => {
        fragment.appendChild(createFigure(work));
    });
    gallery.appendChild(fragment);
}

// Fonction pour créer un bouton de filtre
function createFilterButton(category) {
    const button = document.createElement("div");
    button.className = `filter-btn filter-${category.id}`;
    button.textContent = category.name;
    button.addEventListener("click", () => displayWorks(category.id));
    return button;
}

// Fonction pour afficher les filtres
function displayFilters() {
    const filterContainer = document.querySelector(".div-filtre");
    
    // Vérifier que le conteneur existe
    if (!filterContainer) {
        console.error("Le conteneur de filtres n'existe pas dans le DOM");
        return;
    }
    
    // Créer les boutons de filtre
    const fragment = document.createDocumentFragment();
    allCategories.forEach(category => {
        fragment.appendChild(createFilterButton(category));
    });
    filterContainer.appendChild(fragment);
}

// Fonction d'initialisation
async function init() {
    // Récupérer les données
    await fetchWorks();
    await fetchCategories();
    
    // Afficher les projets et les filtres
    displayWorks();
    displayFilters();
    
    // Ajouter l'événement pour le bouton "Tous"
    const buttonAll = document.querySelector(".Tous");
    if (buttonAll) {
        buttonAll.addEventListener("click", () => displayWorks());
    }
}

// Lancer l'application
init();

// Sortir de la fonction parametre la liste et la stocké dans une variable
// INNER HTML 
// Fonction init : renomer appel get cate et getwork 
// plus faire tableau pour stocker dans une constante; filtrer ou pas oins d'appel api 
// Git hub pour voir les mise à jour git push 