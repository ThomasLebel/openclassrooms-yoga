# 🧘‍♀️ Yoga Frontend

Frontend pour le projet Yoga, développé en Angular 14

## 🚀 Installation & lancement

### 1. Cloner le projet

```bash
    git clone https://github.com/ThomasLebel/yoga-frontend.git
    cd telesport-olympics
```

### 2. Installer les dépendances

```bash
  npm install
```

### 3. Lancer l’application en mode développement

```bash
  ng serve
```
Puis ouvrir http://localhost:4200 dans le navigateur.

### 4. Build pour la production

```bash
  ng build
```

## 🛠️ Fonctionnement du code

- **Gestion des données**

  - Les données olympiques sont fournies via un Observable (olympics$).
  - Sur la page d'accueil, l'app calcule :

    - Le nombre total de JOs
    - Le nombre de pays
    - Les données du graphique circulaire avec le nombre de médailles reçues par pays

  - Lorsqu’un pays est sélectionné, l’app calcule :
    - Le nombre total de médailles,
    - Le nombre total d’athlètes,
    - Les données du graphique en ligne avec le nombre de médailles reçues par année du pays sélectionné

- **Gestion des erreurs**
  
  Si l'utilisateur essaie d'accéder à une route inexistante ou à un pays qui n'est pas présent dans les données, il est redirigé vers une page d'erreur.

- **Composants réutilisables**

  - Un composant Loader est utilisé pour l’affichage lors du chargement des données.
  - Les graphiques sont générés avec ngx-charts.

## 🧪 ️Lancer les tests

Tests unitaires avec Jest

```bash
  ng test
```

Le rapport de couverture sera dispo dans **coverage/jest/index.html**

Tests d'intégration avec Cypress

```bash
  ng e2e
```

Le rapport de couverture sera dispo dans **coverage/lcov-report/index.html**

## 📊 Rapports de couverture

Jest 
<img width="1917" height="622" alt="image" src="https://github.com/user-attachments/assets/b5e71958-8ce3-4970-bb0f-a360302d1637" />

Cypress
<img width="1921" height="853" alt="image" src="https://github.com/user-attachments/assets/0a7e6b9e-2f1a-47ac-9b8b-a19b684eb066" />

