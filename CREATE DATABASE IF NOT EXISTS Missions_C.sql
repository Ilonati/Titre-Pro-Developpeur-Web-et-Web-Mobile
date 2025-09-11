CREATE DATABASE IF NOT EXISTS Missions_Candidatures;
SHOW DATABASES;
USE Missions_Candidatures;

DROP TABLE IF EXISTS candidatures;
DROP TABLE IF EXISTS missions;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password  VARCHAR(255) NOT NULL,
  role ENUM('volunteer','association') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE missions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  mission_date DATETIME NOT NULL,
  association_id INT NOT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (association_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE candidatures (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mission_id INT NOT NULL,
  volunteer_id INT NOT NULL,
  status ENUM('en_attente','acceptee','refusee') DEFAULT 'en_attente',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (mission_id, volunteer_id),
  FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE,
  FOREIGN KEY (volunteer_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (name, email, password, role) 
VALUES 
('UserA', 'asA@example.com', 'password123', 'association'),
('UserB', 'asB@example.com', 'password1234', 'association');

INSERT INTO users (name, email, password, role) 
VALUES 
('Volunteer1', 'vol1@example.com', 'password123', 'volunteer'),
('Volunteer2', 'vol2@example.com', 'password123rr', 'volunteer');

INSERT INTO missions (title, description, mission_date, association_id) 
VALUES
('Mission 1', 'Hello city', '2025-09-15 09:00:00', 1),
('Mission 2', 'Hello world', '2025-09-20 10:00:00', 2);

INSERT INTO candidatures (mission_id, volunteer_id) 
VALUES
(1, 3),  
(1, 4),  
(2, 3); 

-- Les tests requet 
-- Все пользователи
SELECT * FROM users;

-- Все миссии
SELECT * FROM missions;

-- Все заявки
SELECT * FROM candidatures;

-- Все заявки с информацией о волонтёре и миссии
SELECT c.id, u.name AS volunteer_name, m.title AS mission_title, c.status
FROM candidatures c
JOIN users u ON c.volunteer_id = u.id
JOIN missions m ON c.mission_id = m.id;

SELECT c.id, u.name AS volunteer_name, m.title AS mission_title, c.status
FROM candidatures c
JOIN users u ON c.volunteer_id = u.id
JOIN missions m ON c.mission_id = m.id
WHERE m.association_id = 1;

