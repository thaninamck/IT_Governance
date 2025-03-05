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