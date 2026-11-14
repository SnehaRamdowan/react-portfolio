CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  slug          VARCHAR(100) UNIQUE NOT NULL,
  is_public     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id           SERIAL PRIMARY KEY,
  user_id      INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name    VARCHAR(150) NOT NULL,
  headline     VARCHAR(200),
  bio          TEXT,
  phone        VARCHAR(30),
  city         VARCHAR(100),
  linkedin_url TEXT,
  github_url   TEXT,
  website_url  TEXT,
  photo_url    TEXT
);

CREATE TABLE IF NOT EXISTS experiences (
  id          SERIAL PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  position    VARCHAR(150) NOT NULL,
  company     VARCHAR(150) NOT NULL,
  start_date  DATE NOT NULL,
  end_date    DATE,
  description TEXT,
  sort_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS education (
  id          SERIAL PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  degree      VARCHAR(150) NOT NULL,
  school      VARCHAR(150) NOT NULL,
  start_date  DATE NOT NULL,
  end_date    DATE,
  description TEXT,
  sort_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS skills (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(100) NOT NULL,
  category   VARCHAR(50),
  level      SMALLINT CHECK (level BETWEEN 1 AND 5),
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
  id           SERIAL PRIMARY KEY,
  user_id      INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        VARCHAR(150) NOT NULL,
  description  TEXT,
  technologies TEXT[],
  repo_url     TEXT,
  demo_url     TEXT,
  image_url    TEXT,
  sort_order   INT NOT NULL DEFAULT 0
);


ALTER TABLE users ADD COLUMN IF NOT EXISTS data_version INT NOT NULL DEFAULT 1;

-- Portfolio public personnalisé : compte de démonstration non connectable.
-- Pour éditer les données, créer un compte depuis /register ou exécuter le script claim-owner.
INSERT INTO users(email,password_hash,slug,is_public) VALUES('mokshadaramdowan9@gmail.com','!compte-a-activer!','ramdowan-mokshada',true) ON CONFLICT DO NOTHING;
INSERT INTO profiles(user_id,full_name,headline,bio,phone,city,github_url) SELECT id,'Ramdowan Mokshada','Programmer Analyst | Full-Stack Development','Business Administration graduate completing an AEC in Programmer Analyst. Experienced in web development, REST APIs, email automation, and Raspberry Pi configuration. Bilingual in English and French; seeking an academic internship.','450-626-8695','Longueuil, Québec','https://github.com/SnehaRamdowan' FROM users WHERE slug='ramdowan-mokshada' ON CONFLICT DO NOTHING;
INSERT INTO skills(user_id,name,category,sort_order) SELECT id,'Python', 'technology',0 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO skills(user_id,name,category,sort_order) SELECT id,'TypeScript', 'technology',1 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO skills(user_id,name,category,sort_order) SELECT id,'JavaScript', 'technology',2 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO skills(user_id,name,category,sort_order) SELECT id,'Java', 'technology',3 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO skills(user_id,name,category,sort_order) SELECT id,'C#', 'technology',4 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO skills(user_id,name,category,sort_order) SELECT id,'SQL', 'technology',5 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO skills(user_id,name,category,sort_order) SELECT id,'React', 'technology',6 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO skills(user_id,name,category,sort_order) SELECT id,'Node.js', 'technology',7 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO skills(user_id,name,category,sort_order) SELECT id,'Express', 'technology',8 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO skills(user_id,name,category,sort_order) SELECT id,'Spring Boot', 'technology',9 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO skills(user_id,name,category,sort_order) SELECT id,'Django', 'technology',10 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO skills(user_id,name,category,sort_order) SELECT id,'HTML', 'technology',11 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO skills(user_id,name,category,sort_order) SELECT id,'CSS', 'technology',12 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO skills(user_id,name,category,sort_order) SELECT id,'PostgreSQL', 'technology',13 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO skills(user_id,name,category,sort_order) SELECT id,'Redis', 'technology',14 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO skills(user_id,name,category,sort_order) SELECT id,'Git/GitHub', 'technology',15 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO skills(user_id,name,category,sort_order) SELECT id,'Docker', 'technology',16 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO skills(user_id,name,category,sort_order) SELECT id,'Raspberry Pi', 'technology',17 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO skills(user_id,name,category,sort_order) SELECT id,'English', 'language',18 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO skills(user_id,name,category,sort_order) SELECT id,'French', 'language',19 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO projects(user_id,title,description,technologies,sort_order) SELECT id,'Web Application & REST API','Developed product API endpoints and connected a React interface to PostgreSQL. Implemented order processing with stock validation, Redis caching and Docker services.',ARRAY['React','TypeScript','Express','PostgreSQL','Redis','Docker'],0 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO projects(user_id,title,description,technologies,sort_order) SELECT id,'Email Automation','Created scripts to automate email tasks using TypeScript and Python.',ARRAY['TypeScript','Python'],1 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO projects(user_id,title,description,technologies,sort_order) SELECT id,'Raspberry Pi Configuration','Collaborated with a friend on Raspberry Pi setup and troubleshooting.',ARRAY['Raspberry Pi'],2 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO projects(user_id,title,description,technologies,sort_order) SELECT id,'Budget Application','Built an academic budget application using Java and Spring Boot.',ARRAY['Java','Spring Boot'],3 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO experiences(user_id,position,company,start_date,end_date,description,sort_order) SELECT id,'Customer Executive','Remote','2023-10-01','2026-07-01','Provided customer support, answered enquiries, and assisted with order and service concerns.',0 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO experiences(user_id,position,company,start_date,end_date,description,sort_order) SELECT id,'English Teacher','Remote','2023-09-01','2024-09-01','Taught students remotely and adapted explanations to individual learning needs.',1 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO experiences(user_id,position,company,start_date,end_date,description,sort_order) SELECT id,'HR Trainee','Residence Hotel','2022-03-01','2022-04-01','Human resources internship.',2 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO education(user_id,degree,school,start_date,end_date,description,sort_order) SELECT id,'AEC – Programmer Analyst','Collège LaSalle, Montréal','2025-01-01','2026-10-01','Expected October 2026',0 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO education(user_id,degree,school,start_date,end_date,description,sort_order) SELECT id,'BBA (Hons) – Business Administration','Amity University, Mauritius','2020-01-01','2023-05-01','Business Administration',1 FROM users WHERE slug='ramdowan-mokshada';
INSERT INTO education(user_id,degree,school,start_date,end_date,description,sort_order) SELECT id,'Cambridge Higher School Certificate','Rajcoomar Gujadhur State Secondary School','2017-01-01','2019-12-01','School Certificate: 2015–2016',2 FROM users WHERE slug='ramdowan-mokshada';
