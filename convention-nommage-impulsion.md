# Convention de nommage --- Impulsion

> Convention adaptée au repository P3 fourni pour **Impulsion**
> (monorepo React + Express + MySQL).

## 1. Base de données

  Élément             Convention                   Exemple
  ------------------- ---------------------------- -------------------
  Tables              `snake_case`, au singulier   `workout_session`
  Colonnes            `snake_case`                 `started_at`
  Clé primaire        `id`                         `id`
  Clé étrangère       `<table>_id`                 `exercise_id`
  Tables de liaison   `snake_case`                 `exercise_muscle`
  Booléens            préfixe `is_` / `has_`       `is_completed`
  Valeurs d'ENUM      minuscules en `snake_case`   `in_progress`

**SQL ↔ TypeScript :** la BDD reste en `snake_case`, tandis que
TypeScript et les contrats API utilisent `camelCase`.

``` text
started_at       → startedAt
target_weight_kg → targetWeightKg
is_completed     → isCompleted
```

## 2. Architecture backend

Le projet suit l'architecture par modules du repository fourni.

``` text
server/
├── src/
│   ├── modules/
│   │   ├── exercise/
│   │   │   ├── exerciseActions.ts
│   │   │   └── exerciseRepository.ts
│   │   ├── program/
│   │   │   ├── programActions.ts
│   │   │   └── programRepository.ts
│   │   └── workout-session/
│   │       ├── workoutSessionActions.ts
│   │       └── workoutSessionRepository.ts
│   ├── router.ts
│   └── main.ts
└── database/
    ├── client.ts
    ├── schema.sql
    └── fixtures/
```

### Modules

Dossiers en `kebab-case` : `exercise/`, `workout-session/`,
`workout-template/`, `muscle-group/`.

### Actions

Format : `<nom>Actions.ts` --- ex. `exerciseActions.ts`,
`workoutSessionActions.ts`.

Les actions gèrent la couche HTTP. Noms usuels : `browse`, `read`,
`add`, `edit`, `destroy`.

### Repositories

Format : `<nom>Repository.ts` --- ex. `exerciseRepository.ts`,
`workoutSessionRepository.ts`.

Les repositories gèrent l'accès à MySQL. Méthodes usuelles :
`readAll()`, `read()`, `create()`, `update()`, `delete()`.

### Données privées et utilisateur courant

Tant que l'authentification n'est pas branchée, l'identifiant de l'utilisateur
de démonstration est obtenu uniquement via
`server/src/helpers/currentUser.ts`. Il ne doit pas être dupliqué dans les
repositories.

Tout futur repository qui accède à une donnée privée (`program`,
`workout_session`, historique...) doit filtrer ses requêtes par `user_id`.
Après l'intégration de l'authentification, cet identifiant devra venir du
serveur et jamais d'un paramètre libre fourni par le client.

## 3. Routes API

Règles : ressources au pluriel, minuscules, `kebab-case` pour les noms
composés, pas de verbe dans l'URL.

``` text
GET    /api/exercises
GET    /api/exercises/:id
POST   /api/exercises
PUT    /api/exercises/:id
DELETE /api/exercises/:id

GET    /api/workout-sessions
GET    /api/workout-sessions/:id
```

À éviter : `/api/getExercises`, `/api/createWorkoutSession`.

## 4. Frontend React

``` text
client/
└── src/
    ├── components/
    ├── pages/
    ├── services/
    ├── types/
    ├── hooks/
    ├── utils/
    └── App.tsx
```

-   Composants/pages : `PascalCase` → `ExerciseCard.tsx`,
    `ExercisesPage.tsx`.
-   Hooks : préfixe `use` → `useExercises.ts`, `useWorkoutSession.ts`.
-   Services : `camelCase` → `exerciseService.ts`,
    `workoutSessionService.ts`.
-   Types/interfaces : `PascalCase` → `Exercise`, `WorkoutSession`,
    `ExerciseSet`.

## 5. TypeScript

Le projet conserve uniquement les workspaces `client` et `server` : aucun
dossier ou workspace `shared` n'est utilisé. Les types frontend vivent dans
`client/src/types`. Les types backend vivent dans le module concerné ou dans
`server/src/types` lorsqu'ils sont transverses au serveur. Le contrat HTTP
relie les deux applications sans import TypeScript entre les workspaces.

Variables et fonctions en `camelCase` :

``` ts
const workoutSession = ...
const targetWeightKg = ...
function getExercises() {}
```

Constantes globales en `UPPER_SNAKE_CASE` :

``` ts
const API_URL = ...
const DEFAULT_REST_SECONDS = 120;
```

## 6. CSS

Classes en `kebab-case` :

``` css
.exercise-card {}
.exercise-card-title {}
.workout-session-header {}
```

Variables CSS explicites :

``` css
:root {
  --background-color: ...;
  --surface-color: ...;
  --primary-color: ...;
  --accent-color: ...;
  --text-color: ...;
}
```

## 7. Branches Git

Format :

``` text
<type>/US<numero>-<description>
```

Types : `feature/`, `fix/`, `chore/`, `refactor/`.

Exemples :

``` text
chore/US00-initialisation-projet
feature/US08-catalogue-exercices
feature/US10-detail-exercice
feature/US16-demarrer-seance
fix/US18-validation-serie
```

Workflow :

``` text
main
 ↑
dev
 ↑
branche de travail
```

Ne pas développer directement sur `main` ou `dev`. Partir d'un `dev` à
jour :

``` bash
git switch dev
git pull origin dev
git switch -c chore/US00-initialisation-projet
```

## 8. Commits

Utiliser **Conventional Commits**.

Format :

``` text
<type>(USxx): description
```

Types courants : `feat`, `fix`, `chore`, `refactor`, `docs`, `test`,
`style`.

Exemples :

``` text
chore(US00): configure project environment
chore(US00): create database schema
feat(US08): add exercise repository
feat(US08): display exercise catalogue
fix(US18): prevent empty set validation
```

Toute l'équipe doit utiliser la même langue pour les messages de commit.

## 9. Pull Requests

Format :

``` text
[USxx] Description
```

Exemples :

``` text
[US00] Initialisation du projet
[US08] Catalogue des exercices
[US16] Démarrer une séance
```

Les branches de travail sont fusionnées vers `dev` via Pull Request.

## 10. Vérifications avant une PR

``` bash
npm run check
npm run test
```

Pour la BDD :

``` bash
npm run db:migrate
npm run db:seed
```

**Attention :** dans le template actuel, `npm run db:migrate` recrée la
base à partir de `server/database/schema.sql`.

## 11. Seeders

Les classes Seeder sont placées dans :

``` text
server/database/fixtures/
```

Format : `<Entité>Seeder.ts`.

Exemples :

``` text
CategorySeeder.ts
DifficultySeeder.ts
MuscleGroupSeeder.ts
EquipmentSeeder.ts
ExerciseSeeder.ts
ExerciseMuscleSeeder.ts
ExerciseEquipmentSeeder.ts
UserSeeder.ts
```

Seules les classes Seeder doivent être placées dans `fixtures/`, à
l'exception de `AbstractSeeder.ts` prévu par le template.

Les helpers et données doivent être placés ailleurs, par exemple dans
`server/data/`.

## 12. Résumé rapide

``` text
BDD               → snake_case
TypeScript        → camelCase
Composants React  → PascalCase
Types TS          → PascalCase
Hooks             → usePascalCase
CSS               → kebab-case

Backend :
module             → kebab-case/
actions            → camelCaseActions.ts
repository         → camelCaseRepository.ts
seeder             → PascalCaseSeeder.ts

Branches :
feature/US08-catalogue-exercices
fix/US18-validation-serie
chore/US00-initialisation-projet

Commits :
feat(US08): add exercise catalogue
fix(US18): fix set validation
chore(US00): create database schema

Pull Requests :
[US08] Catalogue des exercices
```
