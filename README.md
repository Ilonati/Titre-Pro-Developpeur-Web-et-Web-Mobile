# Titre-Pro-Developpeur-Web-et-Web-Mobile


Technologies
Node.js / Express
MySQL / mysql2
JWT
bcrypt
nodemon

 Gestion des Missions et des Candidatures

Le projet est une plateforme de gestion des missions et des candidatures :
- Les associations créent les missions (titre, description, date)
- Les bénévoles peuvent consulter les missions et soumettre des candidatures
- Les associations peuvent accepter ou refuser les candidatures
- L'authentification des utilisateurs est assurée par JWT
- Les mots de passe sont stockés dans une base de données MySQL chiffrée avec bcrypt.
Contexte et objectifs
Construire une plateforme permettant :
aux associations de publier des missions (créer/éditer/supprimer),
aux bénévoles de consulter les missions et de postuler,
aux associations d'accepter ou refuser les candidatures.
Contraintes techniques demandées :
Authentification avec tokens JWT,
Deux types d'utilisateurs : Bénévoles et Associations,
Statuts de candidatures : en attente (par défaut), acceptée, refusée.

 Choix technologique (justification)
Choix : Base relationnelle mySQL
Les entités (Utilisateurs, Associations, Missions, Candidatures) ont des relations claires et contraintes (FK, unique, contraintes d'intégrité) — un modèle relationnel est naturel.
Besoin probable de transactions atomiques (ex. création de mission + changement de statut de candidature) : SQL gère très bien.
Facilité pour écrire requêtes de recherche et filtres (missions par date, candidat par mission, etc.).
Migrations, contraintes et intégrité référentielle facilitent le développement et la maintenance.
Remarque : NoSQL (ex. MongoDB) reste possible mais augmenterait la complexité pour garantir l'intégrité des relations (requêtes jointes, transactions multi-documents). Pour ce projet d'examen, mySQL est recommandé.
Stack recommandé :
Backend : Node.js + Express .
Base de données : mySQL
Auth : JWT (jsonwebtoken)
Outils optionnels : Thunder Client pour tests API, GitHub Trello.
Entités principales
users — table des utilisateurs (bénévoles et comptes association)
associations_profiles — informations supplémentaires pour les comptes association (optionnel)
missions — les missions publiées par une association
candidatures — candidature d'un bénévole à une mission.
```
Structure du projet
/project
│
├─ app.js                 # Основной файл сервера
├─ db.js                    # Подключение к базе данных
├─ .env                     # Конфиденциальные данные (пароли, секреты)
│
├─ routes/                  # Роутеры (маршруты API)
│   ├─ auth.js
│   ├─ missions.js
│   └─ candidatures.js
│
├─ controllers/             # Логика для каждого маршрута
│   ├─ authController.js
│   ├─ missionsController.js
│   └─ candidaturesController.js
│
└─ middleware/              # Middleware для проверки JWT
    └─ auth.js
```
 API
 GET http://localhost:3000/auth/users поиск все пользователей 
 POST http://localhost:3000/auth/register п зарегистрировать пользователя 
{
  "name": "Orange",
  "email": "assorange@example.com",
  "password": "123456",
  "role": "association"
}
{
  "name": "Bil White",
  "email": "volunteer123@example.com",
  "password": "123456",
  "role": "volunteer"
}

POST http://localhost:3000/auth/login логин  пользователя 
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMywicm9sZSI6InZvbHVudGVlciIsImlhdCI6MTc1Nzg3NDA4MiwiZXhwIjoxNzU3ODc3NjgyfQ.BcF9lUso01MGiy-DaZJOWOTiFtYi5BvDh_45jCIT_-o"
} токен волонтер
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMiwicm9sZSI6ImFzc29jaWF0aW9uIiwiaWF0IjoxNzU3ODc0MTg3LCJleHAiOjE3NTc4Nzc3ODd9.Pr5DKmmNfHTRUMgAM9ga3seWYMpXZuWRkxFJWOswhIo"
} токен ассоциации 
Создание миссии
 Key Authorization   value  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMiwicm9sZSI6ImFzc29jaWF0aW9uIiwiaWF0IjoxNzU3ODc0MTg3LCJleHAiOjE3NTc4Nzc3ODd9.Pr5DKmmNfHTRUMgAM9ga3seWYMpXZuWRkxFJWOswhIo токен 

добавляем боди тоже 
{
  "title": "  ",
  "description": "  ",
  "mission_date": "  "
}


ответ {
  "message": "Mission créée",
  "missionId": 3
}

GET http://localhost:3000/missions просмотр всех  миссий 
[
  {
    "id": 1,
    "title": "Mission 1",
    "description": "Hello city",
    "mission_date": "2025-09-15T07:00:00.000Z",
    "association_id": 1,
    "created_at": "2025-09-11T09:32:34.000Z",
    "document_path": null,
    "association_name": "UserA"
  },
  {
    "id": 2,
    "title": "Mission 2",
    "description": "Hello world",
    "mission_date": "2025-09-20T08:00:00.000Z",
    "association_id": 2,
    "created_at": "2025-09-11T09:32:34.000Z",
    "document_path": null,
    "association_name": "UserB"
  },
  {
    "id": 3,
    "title": "Free",
    "description": "Free work",
    "mission_date": "2025-09-20T08:00:00.000Z",
    "association_id": 12,
    "created_at": "2025-09-14T18:29:55.000Z",
    "document_path": null,
    "association_name": "Orange"
  }
]
Волонтёр подаёт заявку
POST http://localhost:3000/candidatures/3/apply

 Key Authorization   value  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMywicm9sZSI6InZvbHVudGVlciIsImlhdCI6MTc1Nzg3NDA4MiwiZXhwIjoxNzU3ODc3NjgyfQ.BcF9lUso01MGiy-DaZJOWOTiFtYi5BvDh_45jCIT_-o токен 
без боди 



Ассоциация смотрит заявки на миссию

GET http://localhost:3000/candidatures/3 
ответ 
[
  {
    "id": 5,
    "mission_id": 3,
    "volunteer_id": 13,
    "status": "en_attente",
    "applied_at": "2025-09-14T18:42:32.000Z",
    "volunteer_name": "Bil White",
    "volunteer_email": "volunteer123@example.com"
  }
]

Ассоциация принимает заявку
PATCH http://localhost:3000/candidatures/3

Authorization: Bearer association_token
body 
{
  "status": "acceptee"
}
ou
{
  "status": "refusee"
}
удаление миссии 
DELETE  http://localhost:3000/missions/3

Authorization: Bearer association_token


Посмотреть всех пользователей
SELECT m.id, m.title, m.description, m.mission_date, m.created_at, u.name AS association_name
FROM missions m
JOIN users u ON m.association_id = u.id;

Посмотреть все заявки (candidatures)
SELECT c.id, c.mission_id, c.volunteer_id, c.status, c.applied_at, 
       u.name AS volunteer_name, u.email AS volunteer_email
FROM candidatures c
JOIN users u ON c.volunteer_id = u.id;

Проверить заявки по конкретной миссии
SELECT c.id, c.status, u.name AS volunteer_name
FROM candidatures c
JOIN users u ON c.volunteer_id = u.id
WHERE c.mission_id = 1;

Посмотреть заявки конкретного волонтера
SELECT c.id, c.status, m.title AS mission_title
FROM candidatures c
JOIN missions m ON c.mission_id = m.id
WHERE c.volunteer_id = 2;



































