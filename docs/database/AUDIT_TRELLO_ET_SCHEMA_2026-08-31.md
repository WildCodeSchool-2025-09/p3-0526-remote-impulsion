# Audit du schéma SQL et du Trello — 31 août 2026

## Périmètre contrôlé

- Schéma source : `server/database/schema.sql`
- Base MySQL locale configurée dans `server/.env`
- 43 cartes ouvertes du board **P3-Impulsion** : US00 à US42
- Descriptions, critères d'acceptation, dépendances, priorités et 303 éléments de checklist
- État réel du dépôt : compilation TypeScript et tests serveur/client

Le dataset local des 151 exercices reste uniquement une source de seed. Les images restent hors BDD et sont résolues grâce au `slug`.

## Résultat exécutif

Le modèle de données est cohérent dans son ensemble, mais le backlog n'est pas encore directement exécutable. Les principaux blocages sont :

1. Deux cycles de dépendances empêchent de planifier US16, US34 et US35.
2. Plusieurs checklists utilisent encore les anciens noms SQL `session`, `session_exercise`, `set`, `reps` et `weight`.
3. US00 interdit un workspace `shared`, alors que onze checklists exigent des fichiers `shared/types/*`.
4. US01/US11 et US42 se renvoient mutuellement la responsabilité de la pagination.
5. L'architecture d'authentification n'est pas décidée alors que US25, US27, US28 et US40 en dépendent.
6. Le dépôt ne satisfait pas encore sa propre Definition of Done : 9 erreurs TypeScript et 6 tests serveur sur 14 en échec ; le client ne possède aucun script de test.

État du board : 42 cartes sont en **BACKLOG**, US00 est en **IN PROGRESS**, et les listes SPRINT/REVIEW/TESTS/DONE sont vides. Seulement 22 cartes sur 43 ont une checklist technique et 20 sur 43 une Definition of Done. Sur les 303 éléments de checklist, 11 sont cochés.

## Corrections SQL réalisées

Les corrections suivantes ont été ajoutées au schéma, testées sur une base temporaire MySQL 8 puis appliquées sans perte de données à la base locale :

- `INDEX idx_exercise_name (name)` pour le catalogue alphabétique ;
- unicité de `workout_template(program_id, position)` ;
- unicité de `workout_template_exercise(workout_template_id, exercise_id)` ;
- unicité de `workout_template_exercise(workout_template_id, position)` ;
- unicité de `workout_session_exercise(workout_session_id, position)` ;
- `workout_session.created_at` pour dater une séance préparée avant son démarrage ;
- `workout_session.source_workout_session_id`, FK auto-référencée en `ON DELETE SET NULL`, pour tracer US32 sans casser l'historique.

Les MCD, MLD et MPD du dépôt ont été régénérés pour refléter ces changements.

### Décisions SQL encore nécessaires

- **Une seule séance en cours par utilisateur (US04)** : une simple contrainte unique ne convient pas, car plusieurs séances `prepared` et `completed` doivent rester autorisées. L'implémentation doit utiliser une transaction avec verrouillage, ou une table dédiée à la séance active.
- **Série réalisée (US31)** : décider si `is_completed = TRUE` exige `repetitions`, `duration_seconds`, ou l'un des deux selon le type d'exercice, puis valider cette règle côté serveur et éventuellement par `CHECK` SQL.
- **Réinitialisation du mot de passe (US40)** : ajouter le stockage des jetons à usage unique et le mécanisme d'invalidation seulement après le choix JWT/cookie/session persistée.

## Conflits transverses à corriger en priorité

### P0 — Bloquants de planification

- **US16 ↔ US34** : US16 dépend d'US34 et US34 dépend d'US16.
- **US16 ↔ US35** : US16 dépend d'US35 et US35 dépend d'US16.
- Correction proposée : US16 dépend uniquement d'US14 et US33. US34 et US35 étendent ensuite US16 ; US06 ne doit pas dépendre obligatoirement d'US34.
- **US11 ↔ US42, cycle implicite** : US11 exige déjà la pagination US42, tandis qu'US42 dépend d'US11. US11 doit livrer une liste fonctionnelle ; US42 l'étend ensuite.
- **Priorités incohérentes** : US35 et US36 sont Must Have mais dépendent d'US16, classée Should Have. US06 Must Have dépend d'US34 Should Have. Ces dépendances rendent les stories Should Have effectivement obligatoires pour le MVP.

### P0 — Socle US00 non terminé

- `npm run check-types --workspaces --if-present` échoue avec 9 erreurs dans les seeders, causées par le typage de `AbstractSeeder.insert()`.
- Les tests serveur donnent 8 succès et 6 échecs : tests du module exemple `item`, table `item` supprimée du schéma et corps JSON non parsé car `express.json()` est commenté.
- Le client n'a pas de script `test`.
- Le script serveur `build` lance la migration destructive ; un build ne doit jamais supprimer/recréer une base.
- Les éléments US00 « schéma complet », « backend », « utilisateur courant centralisé » et « filtrage user_id » sont correctement encore non cochés.

### P0 — Architecture partagée contradictoire

US00 indique de ne pas créer de workspace `shared`. Pourtant US01, US03, US04, US05, US09, US11, US12, US13, US14, US15 et US16 demandent `shared/types/*`.

Il faut choisir une seule convention :

- soit ajouter officiellement un workspace `shared` au monorepo et modifier US00 ;
- soit conserver uniquement `client` et `server`, placer les contrats dans une structure autorisée et réécrire les onze checklists.

### P1 — Nommage et contrats API obsolètes

- US04, US09 et US10 écrivent encore dans `session` au lieu de `workout_session`.
- US05, US07, US10, US12, US18 et US20 citent `session_exercise` au lieu de `workout_session_exercise`.
- US07 et US08 utilisent `set`, `reps` et `weight` au lieu de `exercise_set`, `repetitions` et `weight_kg`.
- Les routes peuvent conserver `/api/sessions` et les DTO camelCase, mais les tâches repository/SQL doivent employer les noms physiques exacts.
- Choisir une convention HTTP cohérente pour les modifications (`PATCH` recommandé pour les changements partiels ; plusieurs cartes utilisent encore `PUT`).
- Pour une ressource appartenant à un autre utilisateur, choisir partout `404` ou `403`. `404` limite mieux l'énumération des ressources privées.

### P1 — Couverture des checklists insuffisante

Les cartes suivantes n'ont aucune checklist technique : US06, US23 et US24 à US42. US02 n'a pas de Definition of Done ; US23 à US42 non plus, ainsi qu'US06 et US00. Cette asymétrie rend les estimations et les revues difficiles à comparer.

## Revue carte par carte

| Carte | État de cohérence | Corrections recommandées |
|---|---|---|
| US00 | **Bloquant** | Corriger les 9 erreurs TS, retirer/adapter le module exemple `item`, réactiver le parsing JSON, séparer build et migration destructive, décider de la stratégie `shared`. |
| US01 | Bon après révision | Le contrat doit préparer `page`, `limit`, `total`, `totalPages` pour US42. Remplacer ou autoriser explicitement `shared/types`. L'index SQL est déjà présent mais la tâche reste non cochée. |
| US02 | À préciser | Confirmer recherche et filtres côté serveur sur l'ensemble des 151 résultats, insensibles aux accents ; ajouter une DoD. |
| US03 | Bon | Conserver la modale sans route dédiée et corriger seulement la stratégie des types partagés. |
| US04 | **À réécrire** | Ne pas créer une nouvelle ligne `in_progress`. Faire un `PATCH` atomique de la séance existante `prepared` vers `in_progress`, renseigner `started_at`, compter ses exercices et gérer la concurrence. |
| US05 | **À corriger** | Dépendre d'US30 et US33, pas obligatoirement d'US04 ; employer `workout_session_exercise`; supprimer toute lecture d'image en BDD ; ajout multiple transactionnel. |
| US06 | **Incomplète** | Ajouter une checklist technique. Retirer la dépendance forte à US34 ; calculer `MAX(set_number)+1` dans une transaction/verrou ou gérer le conflit d'unicité. |
| US07 | **À corriger** | Remplacer table et champs obsolètes par `exercise_set`, `repetitions`, `weight_kg`; inclure `duration_seconds` si les exercices chronométrés sont supportés. |
| US08 | **À corriger** | Même renommage que US07 ; suppression et renumérotation doivent être transactionnelles et compatibles avec l'unicité `(workout_session_exercise_id, set_number)`. |
| US09 | **À réécrire** | Exiger au moins une série `is_completed = TRUE`, aligner les libellés, retourner à l'accueil et non `/sessions/:id`, définir précisément le plafond de durée et calculer avec les vrais noms SQL. |
| US10 | **À corriger** | Employer les vraies tables ; remplacer les références US22/US21 par US20 ; partager la confirmation avec US08 ou un composant transverse, pas avec une modale de récapitulatif US09. |
| US11 | **À corriger** | Remplacer `hasMore/loadMore()` par pagination numérotée, inclure filtres et total dans l'API, définir comment la séance en cours est épinglée hors pagination et casser le cycle avec US42. |
| US12 | **À corriger** | Employer les vraies tables/champs, n'afficher que les séries faites, choisir une réponse uniforme pour la non-appartenance et intégrer l'accès modale US03. |
| US13 | **Contradictoire** | La checklist crée `/progress` et un lien Header alors que le critère impose un sous-onglet de l'historique. Définir la métrique poids du corps et ne compter que les séries faites. Ajouter la carte résumé d'accueil. |
| US14 | Presque bon | `program.updated_at` existe aussi ; résoudre la stratégie des validations/types partagés. |
| US15 | Bon | Résoudre seulement la stratégie `shared` et garantir le filtrage par utilisateur. |
| US16 | **Bloquant** | Retirer les dépendances US34/US35 ; ajouter `target_duration_seconds` et `rest_seconds` aux tâches/DTO ; aligner flèches de déplacement et glisser-déposer ; utiliser les nouvelles contraintes uniques. |
| US17 | Bon | Préférer `PATCH`; décider `404`/`403` uniformément. |
| US18 | À reformuler | La suppression touche bien `workout_session` en mettant `workout_template_id` à NULL ; elle ne supprime pas l'historique. Corriger l'affirmation « aucune table session ne doit être touchée ». |
| US19 | **Contradictoire** | Route/action `prepare`, pas `start`; créer une séance `prepared` même si une autre est en cours après avertissement, conformément aux critères ; copier repos/durée ; retirer le cas « exercice supprimé », bloqué par la FK `RESTRICT`, ou adopter explicitement le soft-delete. |
| US20 | À corriger | Réutilise l'endpoint d'US10, pas US21 ; vrais noms SQL ; recharge de progression après suppression. |
| US21 | À compléter | Ajouter `rest_seconds` et `target_duration_seconds` aux mises à jour/validations ; renumérotation transactionnelle après retrait. |
| US22 | Bon | Reformuler avec `workout_session`; l'historique est conservé et le lien devient NULL. |
| US23 | Incomplète | Ajouter checklist et DoD ; rendre chaque bloc d'accueil indépendant ; ajouter US39 aux liens/dépendances et clarifier les données de chaque bloc. |
| US24 | Incomplète | Ajouter checklist ; remplacer « mot de passe chiffré » par « mot de passe haché » ; préciser règles exactes, unicité email insensible à la casse et politique de hash. |
| US25 | **Décision requise** | Choisir cookie de session ou JWT, stockage côté client, durée, CSRF et rotation avant d'écrire les tâches. |
| US26 | Incomplète | Ajouter checklist ; imposer `user_id` dans toutes les requêtes privées et uniformiser `401/403/404`. |
| US27 | Dépend d'une décision | La déconnexion dépend du choix US25 : destruction serveur du cookie/session ou invalidation/expiration du jeton. |
| US28 | Dépend d'une décision | Définir précisément durée de session, renouvellement, stockage et comportement multi-onglets. |
| US29 | Presque bon | `user.theme` est présent dans le schéma et la base ; ajouter checklist et utiliser `PATCH /api/users/me` de manière cohérente. |
| US30 | À compléter | Ajouter checklist ; `created_at` est désormais disponible ; définir récupération/création de la dernière séance préparée et autoriser plusieurs préparées. |
| US31 | À compléter | Ajouter checklist ; formaliser ce qui rend une série « faite » pour reps et exercices chronométrés ; ne jamais déduire cet état de la seule présence d'une ligne. |
| US32 | À compléter | Ajouter checklist ; utiliser `source_workout_session_id`; préciser comment les valeurs réalisées deviennent les nouvelles cibles et ne copier que les séries faites. |
| US33 | À compléter | Ajouter checklist ; ajout multiple transactionnel ; gérer les doublons avec les contraintes uniques déjà ajoutées pour séance réelle et séance type. |
| US34 | **Cycle** | Doit dépendre d'US16/US30 sans dépendance inverse ; définir persistance du timer via une heure de fin plutôt qu'un simple compteur mémoire. |
| US35 | **Cycle** | Doit étendre US05/US16 sans dépendance inverse ; employer les contraintes de position ; mise à jour en transaction en deux phases pour éviter les collisions temporaires. |
| US36 | À préciser | US16 devient de fait Must Have ; définir précisément la rotation après suppression/réorganisation d'une séance type et utiliser l'ordre unique par programme. |
| US37 | Ambiguë | Définir l'identité d'une « combinaison » (liste ordonnée d'exercise_id ou ensemble), la déduplication et la règle exacte « moins récente à plus récente ». |
| US38 | Dépendances fausses | « Séance » crée/reprend une séance : ajouter US30. Profil/thème implique US25/US29. Ajouter checklist et états mobile/desktop. |
| US39 | Incomplète | Ajouter checklist ; préciser file d'attente/priorité des messages, accessibilité et interaction avec les modales. |
| US40 | **Décision requise** | Ajouter checklist après US25 ; prévoir jeton haché, expiration, usage unique, réponse anti-énumération et invalidation globale des sessions. |
| US41 | À préciser | Ajouter checklist ; « une séance en cours n'est jamais perdue » nécessite une stratégie explicite de persistance/rechargement et dépend d'US28/US30/US39. |
| US42 | **Cycle implicite** | Ne doit pas bloquer US11 qui est sa propre base ; définir un contrat serveur commun `items/page/limit/total/totalPages` pour catalogue et historique ; ajouter checklist. |

## Ordre de correction conseillé

1. Finir réellement US00 : compilation, tests, parsing JSON, scripts et choix `shared`.
2. Corriger les cycles et priorités : US16/US34/US35, US06/US34 et US11/US42.
3. Réécrire les checklists US04 à US13 avec les noms SQL actuels.
4. Ajouter les checklists manquantes US06 et US23 à US42 avec une DoD commune.
5. Trancher l'authentification avant US25–US29 et US40.
6. Corriger ensuite les ambiguïtés fonctionnelles US13, US19, US31, US36, US37 et US41.

Cet audit n'a modifié aucune carte ni aucun état de checklist Trello ; il fournit la liste des modifications à valider avant une mise à jour groupée du board.
