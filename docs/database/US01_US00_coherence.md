# Vérification de cohérence US01 / US00

Source relue : carte Trello **[E1] US01 — Consulter le catalogue d'exercices**  
https://trello.com/c/ZO7FDHNQ/2-e1-us01-consulter-le-catalogue-dexercices

Référence technique : `server/database/schema.sql`, dataset local et seeders de l'US00.

## Écarts constatés

| Tâche US01 actuelle | Écart avec l'US00 | Formulation cohérente proposée |
|---|---|---|
| Créer `exercise` avec `muscle_group`, `equipment`, `image_url` | La table existe déjà et le modèle est normalisé. Les muscles et équipements passent par des tables de liaison. Les images ne sont pas en base. | Vérifier/réutiliser `exercise`, `category`, `difficulty`, `exercise_muscle`, `muscle_group`, `exercise_equipment` et `equipment`. |
| Seeder au moins 15 exercices avec `image_url` | L'US00 fournit déjà 151 exercices. Les images locales sont retrouvées par `slug`. | Vérifier que les seeders chargent les 151 exercices et leurs relations ; vérifier la présence de `/assets/images/{slug}.jpg`. |
| `readAll()` sélectionne `muscle_group` et `image_url` dans `exercise` | Ces colonnes n'existent pas. La carte US01 demande la catégorie/zone musculaire, pas les muscles précis. | Sélectionner `id`, `slug`, `name` et le nom de `category`; construire `imageUrl` à partir du slug dans le contrat API. |
| Type partagé avec `muscleGroup` et `imageUrl` | `muscleGroup` contredit la règle US01 qui réserve les muscles précis à US03. | Utiliser `{ id, slug, name, category, imageUrl }`; `imageUrl` est une valeur calculée, pas une colonne SQL. |
| `ExerciseCard` est un lien vers `/exercises/:id` | US03 définit une feuille modale sans changement de page. | Rendre la carte cliquable et ouvrir la modale US03 tout en conservant `/exercises`. |
| US01 affiche des cartes paginées, tandis qu'US42 dépend d'US01 | Dépendance circulaire implicite. | Soit retirer la pagination de la DoD US01 et la livrer dans US42, soit rendre US42 préalable à la clôture d'US01. |
| Ajouter un index sur `exercise.name` | L'index n'existait pas dans la première version du schéma US00. | Évolution appliquée : `INDEX idx_exercise_name (name)` est désormais déclaré dans `schema.sql`. |

## Tâches US01 déjà cohérentes

- `GET /api/exercises`, repository et action `browse`.
- Gestion d'un statut 500 sans exposer la stack.
- Test manuel du endpoint.
- Service frontend, hook avec chargement/erreur/retry et page `/exercises`.
- États chargement, catalogue vide, erreur et image de remplacement.
- Grille responsive mobile-first.

## Contrat catalogue recommandé

```ts
interface ExerciseSummary {
  id: number;
  slug: string;
  name: string;
  category: string;
  imageUrl: string;
}
```

Exemple de valeur calculée : `imageUrl = /assets/images/${slug}.jpg`.

La difficulté, le matériel et les muscles principaux/secondaires restent disponibles dans le modèle pour US02 et US03, mais n'ont pas besoin d'être renvoyés par le endpoint de catalogue minimal de l'US01.
