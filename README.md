# Impulsion

Application de suivi sportif pour athlètes hybrides : catalogue d'exercices, séances préparées et réalisées, programmes, historique et progression.

## Stack

- Frontend : React 19, TypeScript, Vite, React Router, Tailwind CSS v4 et daisyUI
- Backend : Node.js, Express et TypeScript, avec une architecture Actions + Repository
- Base de données : MySQL 8
- Qualité : Biome, TypeScript, Jest et Supertest

## Architecture du dépôt

```text
client/
  src/
    components/
    hooks/
    pages/
    services/
    types/

server/
  bin/
  data/
  database/
    fixtures/
    schema.sql
  src/
    modules/
    types/
  tests/

docs/
  database/
```

Le monorepo contient uniquement les workspaces `client` et `server`. Il n'existe pas de dossier ou workspace `shared` :

- les types frontend et les contrats consommés par React sont placés dans `client/src/types` ;
- les types backend sont placés dans le module concerné ou dans `server/src/types` lorsqu'ils sont transverses au serveur ;
- les réponses API assurent le contrat entre les deux applications, sans import TypeScript entre les workspaces.

## Installation

Prérequis : Node.js 20+, npm et MySQL 8.

```bash
npm install
```

Copier ensuite les fichiers d'environnement :

```bash
cp server/.env.sample server/.env
cp client/.env.sample client/.env
```

Renseigner les identifiants MySQL dans `server/.env`, puis initialiser la base :

```bash
npm run db:migrate
npm run db:seed
```

> `npm run db:migrate` recrée entièrement la base indiquée par `DB_NAME`. Cette commande supprime les données existantes et doit uniquement être lancée volontairement sur une base de développement.

Le dataset local contient 151 exercices en français. Il sert uniquement de source aux seeders ; l'application lit ensuite les données depuis MySQL.

## Démarrage

```bash
npm run dev
```

Par défaut :

- client : `http://localhost:3000` ;
- serveur : `http://localhost:3310` ;
- état de l'API : `GET http://localhost:3310/api/health`.

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | Démarre le client et le serveur |
| `npm run build` | Compile le client et vérifie les types du serveur, sans toucher à la BDD |
| `npm run check` | Vérifie le formatage, Biome et les types TypeScript |
| `npm run check:fix` | Applique les corrections automatiques Biome |
| `npm run test` | Exécute les tests disponibles dans les workspaces |
| `npm run db:migrate` | Recrée volontairement la base depuis `schema.sql` |
| `npm run db:seed` | Recharge les données initiales et les relations |

## Base de données et images

La source du schéma est [server/database/schema.sql](server/database/schema.sql).

Le catalogue normalisé repose notamment sur :

- `exercise`, `category`, `difficulty`, `muscle_group`, `equipment` ;
- `exercise_muscle`, avec le rôle `primary` ou `secondary` ;
- `exercise_equipment`.

Les instructions françaises du dataset alimentent `exercise.description`.

Les images ne sont pas stockées en base. Elles sont retrouvées grâce au slug :

- `/assets/images/{slug}.jpg` ;
- `/assets/muscle-maps/{slug}.svg`.

Les modèles à jour sont dans `docs/database` :

- `MCD_Impulsion_final.png` ;
- `MLD_Impulsion_final.png` ;
- `MPD_Impulsion_final.png`.

## Conventions

Les conventions SQL, backend, frontend et Git sont détaillées dans [convention-nommage-impulsion.md](convention-nommage-impulsion.md).

- SQL : `snake_case` ;
- TypeScript et API : `camelCase` ;
- branches : `<type>/US<numero>-<description>` ;
- commits : Conventional Commits avec l'US, par exemple `fix(US00): corriger les seeders`.

Avant une Pull Request :

```bash
npm run check
npm run test
npm run build
```
