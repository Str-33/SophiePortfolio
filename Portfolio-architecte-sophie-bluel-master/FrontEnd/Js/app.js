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
// Fonction pour créer un élément de la galerie modale
function createModalItem(data) {
    const container = document.createElement("div");
    container.className = "modal-item";
    container.dataset.id = data.id;
    
    // Créer l'image
    const img = document.createElement("img");
    img.src = data.imageUrl;
    img.alt = data.title;
    
    // Créer l'icône de suppression
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteBtn.addEventListener("click", () => deleteWork(data.id));
    
    // Assembler
    container.appendChild(img);
    container.appendChild(deleteBtn);
    
    return container;
}

// Fonction pour afficher la galerie dans la modale
function displayModalGallery() {
    const modalGallery = document.querySelector(".modal-gallery");
    
    if (!modalGallery) {
        console.error("La galerie modale n'existe pas dans le DOM");
        return;
    }
    
    // Vider la galerie modale
    modalGallery.innerHTML = "";
    
    // Créer et ajouter les éléments
    const fragment = document.createDocumentFragment();
    allWorks.forEach(work => {
        fragment.appendChild(createModalItem(work));
    });
    modalGallery.appendChild(fragment);
}

// Fonction de suppression (a faire ???)
function deleteWork(workId) {
    console.log("Suppression du projet:", workId);
}

// Fonction pour remplir le select des catégories
function populateCategorySelect() {
    const select = document.getElementById("category-input");
    
    if (!select) return;
    
    // Vider le select (garder juste l'option vide)
    select.innerHTML = '<option value=""></option>';
    
    // Ajouter les catégories
    allCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

// Fonction pour gérer la prévisualisation de l'image
function handleImagePreview() {
    const fileInput = document.getElementById("file-input");
    const preview = document.getElementById("preview-image");
    const uploadZone = document.querySelector(".upload-zone");
    
    console.log("=== INIT handleImagePreview ===");
    console.log("fileInput trouvé:", fileInput);
    console.log("preview trouvé:", preview);
    console.log("uploadZone trouvé:", uploadZone);
    
    if (!fileInput) {
        console.error("❌ file-input non trouvé !");
        return;
    }
    
    if (!preview) {
        console.error("❌ preview-image non trouvé !");
        return;
    }
    
    if (!uploadZone) {
        console.error("❌ upload-zone non trouvée !");
        return;
    }
    
    // Écouter l'événement change
    fileInput.addEventListener("change", function(e) {
        console.log("🎯 EVENT CHANGE DÉCLENCHÉ !");
        console.log("Fichiers:", e.target.files);
        console.log("Nombre de fichiers:", e.target.files.length);
        
        const file = e.target.files[0];
        
        if (!file) {
            console.log("❌ Aucun fichier sélectionné");
            return;
        }
        
        console.log("✅ Fichier sélectionné:");
        console.log("  - Nom:", file.name);
        console.log("  - Type:", file.type);
        console.log("  - Taille:", file.size, "octets");
        
        // Vérifier la taille (4Mo max)
        if (file.size > 4 * 1024 * 1024) {
            alert("Le fichier est trop volumineux (max 4Mo)");
            fileInput.value = "";
            return;
        }
        
        // Afficher la prévisualisation
        const reader = new FileReader();
        
        reader.onload = function(event) {
            console.log("📸 Image chargée, src length:", event.target.result.length);
            
            // Mettre à jour l'image
            preview.src = event.target.result;
            
            // Afficher l'image et cacher les autres éléments
            preview.classList.remove("preview-hidden");
            preview.classList.add("preview-visible");
            uploadZone.classList.add("has-image");
            
            console.log("Classes de preview:", preview.className);
            console.log("Classes de uploadZone:", uploadZone.className);
            console.log("Style display de preview:", window.getComputedStyle(preview).display);
            
            // Vérifier la validité du formulaire
            checkFormValidity();
        };
        
        reader.onerror = function(error) {
            console.error("❌ Erreur lors de la lecture du fichier:", error);
        };
        
        console.log("📖 Début de la lecture du fichier...");
        reader.readAsDataURL(file);
    });
    
    console.log("✅ Event listener ajouté sur file-input");
}

// Fonction pour vérifier si le formulaire est valide
function checkFormValidity() {
    const fileInput = document.getElementById("file-input");
    const titleInput = document.getElementById("title-input");
    const categoryInput = document.getElementById("category-input");
    const validateBtn = document.querySelector(".btn-validate");
    
    const isValid = fileInput.files.length > 0 && 
                    titleInput.value.trim() !== "" && 
                    categoryInput.value !== "";
    
    validateBtn.disabled = !isValid;
}

// Fonction pour envoyer le nouveau projet
async function submitNewWork(formData) {
    const url = "http://localhost:5678/api/works";
    const token = localStorage.getItem("authToken");
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const newWork = await response.json();
        
        // Ajouter le nouveau projet au tableau
        allWorks.push(newWork);
        
        // Rafraîchir les galeries
        displayWorks();
        displayModalGallery();
        
        // Fermer la modale d'ajout et revenir à la galerie
        document.getElementById("modal-add").style.display = "none";
        document.getElementById("modal").style.display = "flex";
        
        // Réinitialiser le formulaire
        document.getElementById("add-work-form").reset();
        document.getElementById("preview-image").classList.remove("preview-visible");
        document.getElementById("preview-image").classList.add("preview-hidden");
        document.querySelector(".upload-zone").classList.remove("has-image");
        
        alert("Projet ajouté avec succès !");
        
    } catch (error) {
        console.error("Erreur lors de l'ajout du projet:", error);
        alert("Erreur lors de l'ajout du projet");
    }
}

// Initialiser les événements de la modale d'ajout
function initAddModal() {
    populateCategorySelect();
    handleImagePreview();
    
    // Événements sur les champs du formulaire
    const titleInput = document.getElementById("title-input");
    const categoryInput = document.getElementById("category-input");
    
    titleInput.addEventListener("input", checkFormValidity);
    categoryInput.addEventListener("change", checkFormValidity);
    
    // Soumission du formulaire
    const form = document.getElementById("add-work-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const fileInput = document.getElementById("file-input");
        const titleInput = document.getElementById("title-input");
        const categoryInput = document.getElementById("category-input");
        
        const formData = new FormData();
        formData.append("image", fileInput.files[0]);
        formData.append("title", titleInput.value);
        formData.append("category", categoryInput.value);
        
        submitNewWork(formData);
    });
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

function displayAdminMode() {
    if (localStorage.authToken) {
        console.log("Mode admin activé");
        
        // Créer la bannière
        const editBanner = document.createElement('div');
        editBanner.className = 'edition';
        
        const link = document.createElement("a");
        link.href = "#modal";           
        link.className = "open-modal";  
        link.style.color = "white";
        link.style.textDecoration = "none";
        link.style.cursor = "pointer";
        
        const icon = document.createElement('i');
        icon.className = 'fa-regular fa-pen-to-square';
        
        const text = document.createTextNode(' Mode édition');
        
        link.appendChild(icon);
        link.appendChild(text);
        editBanner.appendChild(link);
        
        document.body.prepend(editBanner);
        
        // Afficher le bouton "modifier"
        const editProjectsBtn = document.querySelector('.edit-projects');
        if (editProjectsBtn) {
            editProjectsBtn.style.display = 'inline-flex';
        }
        
        // Changer "login" en "logout"
        const loginLink = document.getElementById('login-link');
        if (loginLink) {
            loginLink.textContent = 'logout';
            loginLink.href = '#';
            loginLink.addEventListener('click', handleLogout);
        }
    }
}
function handleLogout(event) {
    event.preventDefault();
    
    // Supprimer le token et userId
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    
    // Recharger la page
    window.location.reload();
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
// Gestion de l'ouverture / fermeture des modales
document.addEventListener("click", (event) => {

    // --- OUVRIR LA MODALE GALERIE ---
    if (event.target.closest(".open-modal")) {
        const modal = document.getElementById("modal");
        if (modal) {
            modal.style.display = "flex";
            displayModalGallery();
        }
    }

    // --- OUVRIR LA MODALE AJOUT ---
    if (event.target.closest(".btn-add-photo")) {
        document.getElementById("modal").style.display = "none";
        document.getElementById("modal-add").style.display = "flex";
    }

    // --- RETOUR À LA MODALE GALERIE ---
    if (event.target.closest(".back-modal")) {
        document.getElementById("modal-add").style.display = "none";
        document.getElementById("modal").style.display = "flex";
    }

    // --- FERMER LES MODALES ---
    if (event.target.id === "modal" || event.target.id === "modal-add" || event.target.closest(".close-modal")) {
        const modal = document.getElementById("modal");
        const modalAdd = document.getElementById("modal-add");
        if (modal) modal.style.display = "none";
        if (modalAdd) modalAdd.style.display = "none";
    }
});

// Lancer l'application
init();
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
    
    // Initialiser la modale d'ajout 
    initAddModal();
    
    // Ajouter l'événement pour le bouton "Tous"
    const buttonAll = document.querySelector(".Tous");
    if (buttonAll) {
        buttonAll.addEventListener("click", () => displayWorks());
    }
}