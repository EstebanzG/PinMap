# Synopsis

J'ai réalisé une application web permettant à un utilisateur d'uploader sa propre carte (ou d'utiliser celle par défaut) et d'y ajouter des points d'intérêt (appelés *pins*).

Lors de l'ajout d'un *pin*, l'utilisateur accède à un éditeur interactif offrant les fonctionnalités suivantes :
- **Zoom** : Possible via la molette de la souris, le trackpad ou directement sur smartphone.
- **Déplacement** : La carte peut être déplacée à l'aide d'un clic droit maintenu.
- **Personnalisation des contrôles** : Si l'utilisateur souhaite désactiver le déplacement et n'utiliser que le zoom, cette option est disponible dans l'onglet paramètres.

Dans l'onglet *Pins*, l'utilisateur peut :
1. Ajouter un titre, une taille et une couleur au *pin*.
2. Cliquer sur la carte pour positionner le *pin*.
3. Modifier un *pin* existant en cliquant dessus.

Les *pins* proches se fusionnent automatiquement afin d'éviter de surcharger la carte. Ce comportement est visible lors du zoom/dézoom, où la taille des *pins* reste constante.

Enfin, deux raccourcis clavier facilitent l'utilisation :
- **Ctrl (ou Cmd sur Mac) + S** : Exporte la vue actuelle de la carte au format PNG.
- **Ctrl (ou Cmd sur Mac) + Z** : Annule la dernière création de *pin*.

---

# Lancement

## Installation

1. Installez les dépendances :

```bash
npm install
```

## Serveur de développement

2. Lancez le serveur de développement (accessible sur `http://localhost:3000`) :

```bash
npm run dev
```

---

# Architecture

L'application utilise le meta-framework **NuxtJS** et plusieurs bibliothèques externes :
- **@panzoom/panzoom** : Gestion du zoom et du déplacement de la carte.
- **html2canvas** : Export de la vue en fichier PNG.
- **uuid** : Génération d'identifiants uniques pour les *pins*.

### Structure du projet
- **Components/** : Contient les composants VueJS principaux (ex. éditeur, gestion des *pins*).
- **Pages/** : Gère la route principale de l'application.

---

# Aides IA

Durant le projet, j'ai utilisé deux outils d'IA générative pour m'assister :
- **ChatGPT** : Compréhension de bibliothèques (notamment @panzoom) et aide à la conception d'algorithmes (fusion des *pins*, par exemple).
- **GitHub Copilot** : Accélération de l'écriture de code grâce à ses suggestions.