console.log("Le script connection.js est chargé !");

const loginApi = "http://localhost:5678/api/users/login";

// Attendre que le DOM soit complètement chargé
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM chargé, ajout de l'écouteur d'événement...");
    
    const form = document.getElementById("loginForm");
    console.log("Formulaire trouvé:", form);
    
    if (form) {
        form.addEventListener("submit", handleSubmit);
        console.log("Écouteur d'événement ajouté au formulaire");
    } else {
        console.error("Formulaire avec l'ID 'loginForm' non trouvé !");
    }
});

async function handleSubmit(event) {
    event.preventDefault();
    console.log("Formulaire soumis !");

    let user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    console.log("Données envoyées:", user);

    try {
        let response = await fetch(loginApi, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        console.log("Réponse reçue, status:", response.status);

        if (response.status === 401 || response.status === 404) {
            alert("Erreur dans l'identifiant ou le mot de passe");
            return;
        }

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        let result = await response.json();
        console.log("Réponse de l'API:", result);
        
        if (result.token) {
            console.log("Connexion réussie!");
            localStorage.setItem("authToken", result.token);
            if (result.userId) {
                localStorage.setItem("userId", result.userId);
            }
            window.location.href = "index.html";
        }
        
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        alert("Erreur de connexion au serveur");
    }
}