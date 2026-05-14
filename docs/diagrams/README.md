# Diagrammes PlantUML du projet PharmaSystem

Ces fichiers decrivent le projet complet lu depuis:

- Frontend React: `C:\Users\Saad\pharmacy-frontend`
- Backend Laravel: `D:\XAMPP\htdocs\pharmacy`

Fichiers generes:

- `mcd.puml` : modele conceptuel des donnees
- `mpd.puml` : modele physique des donnees
- `use-case.puml` : cas d'utilisation
- `classes.puml` : classes, composants frontend et backend
- `sequence-authentification.puml` : inscription, connexion et deconnexion
- `sequence-medicaments.puml` : consultation, ajout, modification et suppression des medicaments
- `sequence-vente.puml` : consultation des ventes et validation d'une vente
- `sequence-dashboard-rapport.puml` : dashboard, statistiques et rapport PDF
- `sequence-utilisateurs.puml` : gestion des utilisateurs
- `sequence-systeme.puml` : sauvegarde SQL et routes techniques

Les libelles sont en francais sans accents et sans caracteres speciaux fragiles.
Les diagrammes `.puml` contiennent aussi une mise en page compacte pour impression A4:
`scale max 1050 width`, police reduite, marge faible et ombres desactivees.

Points observes dans le code Laravel:

- Authentification API avec Laravel Sanctum.
- Roles utilises: `admin` et `pharmacien`.
- Les routes protegees utilisent `auth:sanctum`.
- `GET /api/backup` est public dans le code actuel.
- `Route::apiResource('users', UserController::class)` ajoute des routes REST, mais `UserController` ne contient pas `show`.
- Une migration cible la table `produits`, alors que la table metier creee est `medicaments`.
