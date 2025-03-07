# IT_Governance
### Backend

## Controlleurs
c'est les controlleurs standars responsables d'orchestrer les evenements et appeler les repositories,services,... .
# BaseController

Le `BaseController` est un contrôleur de base conçu pour standardiser les réponses JSON renvoyées par l'API. Il fournit deux méthodes principales pour gérer les réponses de succès et d'erreur de manière cohérente et réutilisable.

## Méthodes Disponibles

### **sendResponse($result, $message, $code = 200)**

**Description** : Renvoie une réponse JSON en cas de succès.

**Paramètres** :  
- **$result** : Les données à renvoyer au client.  
- **$message** : Un message optionnel décrivant la réponse.  
- **$code** : Le code HTTP de la réponse (par défaut : `200`).  

### **sendError($error, $errorMessage = [], $code = 400)**

**Description** : Renvoie une réponse JSON en cas d'erreur..

**Paramètres** :  
- **$error** :   Le message d'erreur principal.  
- **$errorMessage** : Un tableau ou un objet contenant des détails supplémentaires sur l'erreur (optionnel)..  
- **$code** : Le code HTTP de la réponse (par défaut : `400`).  
Nb:il faut faire extend du controlleur basique pour pouvoir utiliser ces méthodes

## Repositories
intermediaire entre les modeles et les controlleurs pour garder les controlleurs clean 
ils sont responsables de toute fonctionnalité CRUD 

## Resources
pour formater les données de la maniere qu'on veut 


## Services
pour implementer la logique métier , tout ce qui est calcul et métier doit etre implémenté ici 

## Documentation de l'API
on va  utiliser scramble pour pouvoir acceder a l'interface de documentation acceder à http://127.0.0.1:8000/docs/api 
pour plus de documentation sur l'outil la documentation est disponible sur https://scramble.dedoc.co/ 

au cas ou l'outil se beug voici la documentation au fur et à mesure
# Documentation des Endpoints d'Authentification

## Routes et Endpoints

### 1. Connexion
**URL:** `/login`
**Méthode:** `POST`
**Middleware:** `CheckPasswordReset`
**Description:** Authentifie un utilisateur avec son email et mot de passe.
**Paramètres:**
- `email` (string, requis) : Email de l'utilisateur.
- `password` (string, requis) : Mot de passe de l'utilisateur.

**Réponse:**
- `token` : Jeton d'authentification.
- `user` : Détails de l'utilisateur.
- `must_change_password` : Indique si l'utilisateur doit changer son mot de passe.

---
### 2. Déconnexion
**URL:** `/logout`
**Méthode:** `POST`
**Middleware:** `auth:sanctum`
**Description:** Déconnecte l'utilisateur en supprimant son token.
**Réponse:** Confirmation de déconnexion.

---
### 3. Changement forcé de mot de passe
**URL:** `/changePassword`
**Méthode:** `POST`
**Middleware:** `auth:sanctum`
**Description:** Permet à un utilisateur authentifié de changer son mot de passe.
**Paramètres:**
- `new_password` (string, requis) : Nouveau mot de passe.
- `new_password_confirmation` (string, requis) : Confirmation du mot de passe.

**Réponse:** Confirmation du changement de mot de passe.

---
### 4. Vérifier l'existence d'un email
**URL:** `/check-email`
**Méthode:** `POST`
**Description:** Vérifie si un email est enregistré dans la base de données.
**Paramètres:**
- `email` (string, requis) : Email à vérifier.

**Réponse:** Confirmation de l'existence ou erreur.

---
### 5. Stocker un code de réinitialisation
**URL:** `/store-reset-code`
**Méthode:** `POST`
**Description:** Génère et stocke un code de réinitialisation de mot de passe.
**Paramètres:**
- `email` (string, requis) : Email de l'utilisateur.
- `code` (string, requis, 4 caractères) : Code de réinitialisation.

**Réponse:** Confirmation de stockage du code.

---
### 6. Vérifier un code de réinitialisation
**URL:** `/verify-reset-code`
**Méthode:** `POST`
**Description:** Vérifie si un code de réinitialisation est valide.
**Paramètres:**
- `email` (string, requis) : Email de l'utilisateur.
- `code` (string, requis, 4 caractères) : Code de réinitialisation.

**Réponse:** Confirmation de la validité du code.

---
### 7. Réinitialiser le mot de passe
**URL:** `/reset-password`
**Méthode:** `POST`
**Description:** Permet de réinitialiser le mot de passe d'un utilisateur en utilisant un code de réinitialisation.
**Paramètres:**
- `email` (string, requis) : Email de l'utilisateur.
- `code` (string, requis, 4 caractères) : Code de réinitialisation.
- `new_password` (string, requis) : Nouveau mot de passe.
- `new_password_confirmation` (string, requis) : Confirmation du nouveau mot de passe.

**Réponse:** Confirmation du changement de mot de passe.

