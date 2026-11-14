# Portfolio professionnel — Ramdowan Mokshada

Application React + TypeScript / Express / PostgreSQL / Redis / Docker. Personnalisée à partir du CV fourni.

## Démarrage

1. Installer Docker Desktop et démarrer Docker.
2. Copier `.env.example` vers `.env` et remplacer `POSTGRES_PASSWORD` par un mot de passe fort. Ne pas publier `.env`.
3. Dans ce dossier : `docker compose up --build -d`
4. Ouvrir http://localhost:5173 (portfolio) et http://localhost:3000/api/health (API).
5. **Activer votre compte personnel** une seule fois :
   `docker compose exec backend npm run claim -- "VotreMotDePasseFort123!"`
   Puis ouvrir http://localhost:5173/login et utiliser `mokshadaramdowan9@gmail.com` avec ce mot de passe.
   Le mot de passe n'est pas fourni dans le code; la commande le hache avec bcrypt.
6. Le tableau de bord est à http://localhost:5173/dashboard. Le portfolio public est à `/p/ramdowan-mokshada`.

**Important :** l'initialisation SQL s'exécute uniquement sur un volume PostgreSQL neuf. Si vous avez déjà démarré le starter, `docker compose down -v` puis `docker compose up --build -d` réinitialise la base et **efface les données précédentes**.

## Fonctions

- Inscription, connexion, déconnexion, changement du mot de passe et suppression du compte. Sessions aléatoires stockées dans Redis (7 jours). Mots de passe bcrypt.
- Gestion du profil et CRUD des compétences, formations, expériences et projets. Ordre modifiable via `sort_order`.
- Portfolio responsive avec URL unique et visibilité public/privé. Cache Redis invalidé à chaque modification.
- Deux modèles PDF (classique/moderne), choix des sections, aperçu et téléchargement. Cache Redis selon identifiant, modèle, sections et version des données.

## Architecture

Navigateur React :5173 → API Express :3000 → PostgreSQL :5432 + Redis :6379.

ER : `users (1) -> (1) profiles` et `users (1) -> (N) experiences, education, skills, projects`; les clés étrangères `user_id` sont supprimées en cascade.

## API

- `GET /api/health` état des services
- `POST /api/auth/register`, `/login`, `/logout`; `PATCH /api/auth/password`; `DELETE /api/auth/account`
- `GET /api/public/:slug` portfolio public
- `GET /api/manage/me`; `PATCH /api/manage/profile`, `/visibility`
- `POST /api/manage/:section`, `PUT /api/manage/:section/:id`, `DELETE /api/manage/:section/:id` (sections : experiences, education, skills, projects)
- `GET /api/cv/preview?template=modern&sections=bio,skills,projects` et `/api/cv/download` (en-tête `Authorization: Bearer <token>`).

## Choix technologiques

PDFKit : génère directement des PDF côté serveur sans navigateur Chrome. Redis : sessions et cache. PostgreSQL : intégrité relationnelle. Docker Compose : reproductibilité.

## Vérification manuelle

1. Vérifier `/api/health`; ouvrir le portfolio.
2. Activer le compte et se connecter.
3. Modifier le titre et vérifier sa mise à jour sur la page publique.
4. Ajouter/modifier/supprimer une compétence et vérifier son affichage.
5. Télécharger les deux modèles et vérifier le nom du fichier.
6. Déconnecter et vérifier l'accès protégé.

## Limites et consignes de remise

Ce projet a été assisté par IA : le déclarer selon les consignes de l'enseignant. Les tests automatisés et un historique Git ne sont **pas** fournis. Le site n'est pas déployé. Les dates du CV qui n'indiquent que le mois sont représentées par le premier jour de ce mois dans la base. Les liens de démonstration peuvent être complétés dans le dashboard. Vérifier les informations avant publication.
