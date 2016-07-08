// Vérification de la longueur du mot de passe saisi
document.getElementById("password").addEventListener("input", function (e) {
    var mdp = e.target.value; // Valeur saisie dans le champ mdp
    var longueurMdp = "weak :(";
    var couleurMsg = "red"; // Longueur faible => couleur rouge
    if (mdp.length >= 8) {
        longueurMdp = "good enough";
        couleurMsg = "green"; // Longueur suffisante => couleur verte
    } else if (mdp.length >= 5) {
        longueurMdp = "almost..";
        couleurMsg = "orange"; // Longueur moyenne => couleur orange
    }
    var aideMdpElt = document.getElementById("helpPassword");
    aideMdpElt.textContent = longueurMdp; // Texte de l'aide
    aideMdpElt.style.color = couleurMsg; // Couleur du texte de l'aide
});

document.getElementById("password").addEventListener("blur", function (e) {
    var aideMdpElt = document.getElementById("helpPassword");
    var mdp = e.target.value;
    if (mdp.length == 0) {
        aideMdpElt.textContent = '';
    }
});
