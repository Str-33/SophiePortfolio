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
    
    // Créer l'image
    const img = document.createElement("img");
    img.src = data.imageUrl;
    img.alt = data.title;
    
    // Créer la légende
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = data.title;
    
    // Assembler
    figure.appendChild(img);
    figure.appendChild(figcaption);
    
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
    
    if (!filterContainer) {
        console.error("Le conteneur de filtres n'existe pas dans le DOM");
        return;
    }
    
    // Si connecté, cacher tous les filtres
    if (localStorage.authToken) {
        filterContainer.style.display = 'none';
        return;
    }
    
    // Si déconnecté, afficher tous les filtres
    filterContainer.style.display = 'flex';
    
    // Vider le conteneur avant d'ajouter les filtres (évite les doublons)
    const dynamicFilters = filterContainer.querySelectorAll('.filter-btn');
    dynamicFilters.forEach(filter => filter.remove());
    
    // Créer les boutons de filtre
    const fragment = document.createDocumentFragment();
    allCategories.forEach(category => {
        fragment.appendChild(createFilterButton(category));
    });
    filterContainer.appendChild(fragment);
}

// Fonction pour afficher le mode admin 
function displayAdminMode() {
    if (localStorage.authToken) {
        console.log("Mode admin activé");
        
        // Créer la bannière
        const editBanner = document.createElement('div');
        editBanner.className = 'edition';
        
        // Créer le lien <a>
        const link = document.createElement("a");
        link.href = "#modal";           // <--- TON LIEN
        link.className = "open-modal";  // <--- pour gérer l'ouverture en JS
        link.style.color = "white";
        link.style.textDecoration = "none";
        link.style.cursor = "pointer";
        
        // Créer l'icône
        const icon = document.createElement('i');
        icon.className = 'fa-regular fa-pen-to-square';
        
        // Créer le texte
        const text = document.createTextNode(' Mode édition');
        
        // Assembler
        link.appendChild(icon);
        link.appendChild(text);
        editBanner.appendChild(link);
        
        // Ajouter au début du body
        document.body.prepend(editBanner);
    }
}


// Fonction d'initialisation
async function init() {
    // Afficher le mode admin
    displayAdminMode();
    
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
// Gestion de l'ouverture / fermeture de la modale
document.addEventListener("click", (event) => {

    // --- OUVRIR LA MODALE ---
    if (event.target.closest(".open-modal")) {
        const modal = document.getElementById("modal");
        if (modal) modal.style.display = "flex";
    }

    // --- FERMER LA MODALE EN CLIQUANT SUR LE FOND ---
    if (event.target.id === "modal") {
        event.target.style.display = "none";
    }
});

// Lancer l'application
init();