# PinMap

## Liens
- **Git** : [https://github.com/EstebanzG/PinMap](https://github.com/EstebanzG/PinMap)

---

## Synopsis

PinMap est une application web permettant à un utilisateur d'uploader sa propre carte (ou d'utiliser celle par défaut) pour y ajouter des points d’intérêt, appelés *pins*.

### Fonctionnalités principales :
1. **Ajout de pins** :
    - Titre, taille et couleur personnalisables.
    - Positionnement par simple clic sur la carte.
    - Modification possible en cliquant sur un *pin* existant.

2. **Éditeur interactif** :
    - **Zoom** : Utilisable via la molette de souris, le trackpad ou directement sur smartphone.
    - **Déplacement** : Maintenez un clic droit pour déplacer la carte.
    - **Personnalisation des contrôles** : Désactivation possible du déplacement pour utiliser uniquement le zoom, accessible via l'onglet paramètres.

3. **Fusion automatique des pins** :
    - Les *pins* proches se regroupent automatiquement pour éviter la surcharge visuelle.
    - Cette fonctionnalité s'adapte dynamiquement au zoom, maintenant une taille constante des *pins*.

4. **Raccourcis clavier** :
    - **Ctrl (ou Cmd sur Mac) + S** : Exporte la vue actuelle de la carte en PNG.
    - **Ctrl (ou Cmd sur Mac) + Z** : Annule la dernière création de *pin*.

---

## Lancement

### Installation

1. Installez les dépendances :
   ```bash
   npm install
   ```  

### Serveur de développement

2. Lancez le serveur de développement (accessible sur `http://localhost:3000`) :
   ```bash
   npm run dev
   ```  

---

## Architecture

L’application repose sur **NuxtJS** et intègre plusieurs bibliothèques externes :
- **@panzoom/panzoom** : Pour le zoom et le déplacement de la carte.
- **html2canvas** : Pour l’export de la vue en PNG.
- **uuid** : Pour la génération d’identifiants uniques des *pins*.

### Structure du projet
- **Components/** : Contient les composants VueJS principaux, comme l’éditeur ou la gestion des *pins*.
- **Pages/** : Gère la route principale de l’application.

---

## Aide IA

Durant le développement, deux outils d’IA générative ont été utilisés :
- **ChatGPT** :
    - Compréhension de bibliothèques, notamment **@panzoom**.
    - Assistance dans la conception d’algorithmes, comme la fusion des *pins*.
- **GitHub Copilot** :
    - Accélération du codage grâce à des suggestions pertinentes.