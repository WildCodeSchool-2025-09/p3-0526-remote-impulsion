SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS exercise_set;
DROP TABLE IF EXISTS workout_session_exercise;
DROP TABLE IF EXISTS workout_session;
DROP TABLE IF EXISTS workout_template_exercise;
DROP TABLE IF EXISTS workout_template;
DROP TABLE IF EXISTS program;
DROP TABLE IF EXISTS exercise_equipment;
DROP TABLE IF EXISTS exercise_muscle;
DROP TABLE IF EXISTS exercise;
DROP TABLE IF EXISTS equipment;
DROP TABLE IF EXISTS muscle_group;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS difficulty;
DROP TABLE IF EXISTS user;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE user (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  theme ENUM('light', 'dark', 'system') NOT NULL DEFAULT 'system',
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE difficulty (
  id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE category (
  id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE muscle_group (
  id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE equipment (
  id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE exercise (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category_id TINYINT UNSIGNED NOT NULL,
  difficulty_id TINYINT UNSIGNED NOT NULL,
  CONSTRAINT fk_exercise_category
    FOREIGN KEY (category_id) REFERENCES category(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_exercise_difficulty
    FOREIGN KEY (difficulty_id) REFERENCES difficulty(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_exercise_name ON exercise(name);

CREATE TABLE exercise_muscle (
  exercise_id INT UNSIGNED NOT NULL,
  muscle_group_id SMALLINT UNSIGNED NOT NULL,
  role ENUM('primary', 'secondary') NOT NULL,
  PRIMARY KEY (exercise_id, muscle_group_id),
  CONSTRAINT fk_exercise_muscle_exercise
    FOREIGN KEY (exercise_id) REFERENCES exercise(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_exercise_muscle_muscle_group
    FOREIGN KEY (muscle_group_id) REFERENCES muscle_group(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE exercise_equipment (
  exercise_id INT UNSIGNED NOT NULL,
  equipment_id SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (exercise_id, equipment_id),
  CONSTRAINT fk_exercise_equipment_exercise
    FOREIGN KEY (exercise_id) REFERENCES exercise(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_exercise_equipment_equipment
    FOREIGN KEY (equipment_id) REFERENCES equipment(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE program (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_program_user
    FOREIGN KEY (user_id) REFERENCES user(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE workout_template (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  program_id INT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  estimated_duration_minutes SMALLINT UNSIGNED NULL,
  position SMALLINT UNSIGNED NOT NULL,
  -- NOUVEAU (MPD v3) : empêche deux séances types à la même position
  -- dans un même programme (nécessaire pour US37, "proposer la prochaine").
  CONSTRAINT uq_workout_template_position UNIQUE (program_id, position),
  CONSTRAINT fk_workout_template_program
    FOREIGN KEY (program_id) REFERENCES program(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE workout_template_exercise (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  workout_template_id INT UNSIGNED NOT NULL,
  exercise_id INT UNSIGNED NOT NULL,
  position SMALLINT UNSIGNED NOT NULL,
  target_sets SMALLINT UNSIGNED NOT NULL,
  target_reps SMALLINT UNSIGNED NULL,
  target_weight_kg DECIMAL(5,2) NULL,
  target_duration_seconds SMALLINT UNSIGNED NULL,
  rest_seconds SMALLINT UNSIGNED NULL,
  CONSTRAINT uq_workout_template_exercise
    UNIQUE (workout_template_id, exercise_id),
  -- NOUVEAU (MPD v3) : empêche deux exercices à la même position
  -- dans une même séance type (US14, ordre des exercices).
  CONSTRAINT uq_workout_template_exercise_position UNIQUE (workout_template_id, position),
  CONSTRAINT fk_workout_template_exercise_template
    FOREIGN KEY (workout_template_id) REFERENCES workout_template(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_workout_template_exercise_exercise
    FOREIGN KEY (exercise_id) REFERENCES exercise(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE workout_session (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  workout_template_id INT UNSIGNED NULL,
  source_workout_session_id INT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  started_at DATETIME NULL,
  ended_at DATETIME NULL,
  status ENUM('prepared', 'in_progress', 'completed') NOT NULL DEFAULT 'prepared',
  notes TEXT NULL,
  CONSTRAINT fk_workout_session_user
    FOREIGN KEY (user_id) REFERENCES user(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_workout_session_template
    FOREIGN KEY (workout_template_id) REFERENCES workout_template(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_workout_session_source
    FOREIGN KEY (source_workout_session_id) REFERENCES workout_session(id)
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE workout_session_exercise (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  workout_session_id INT UNSIGNED NOT NULL,
  exercise_id INT UNSIGNED NOT NULL,
  position SMALLINT UNSIGNED NOT NULL,
  target_sets SMALLINT UNSIGNED NULL,
  target_reps SMALLINT UNSIGNED NULL,
  target_weight_kg DECIMAL(5,2) NULL,
  target_duration_seconds SMALLINT UNSIGNED NULL,
  rest_seconds SMALLINT UNSIGNED NULL,
  CONSTRAINT uq_workout_session_exercise UNIQUE (workout_session_id, exercise_id),
  -- NOUVEAU (MPD v3) : empêche deux exercices à la même position
  -- dans une même séance (US14, ordre des exercices).
  CONSTRAINT uq_workout_session_exercise_position UNIQUE (workout_session_id, position),
  CONSTRAINT fk_workout_session_exercise_session
    FOREIGN KEY (workout_session_id) REFERENCES workout_session(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_workout_session_exercise_exercise
    FOREIGN KEY (exercise_id) REFERENCES exercise(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE exercise_set (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  workout_session_exercise_id INT UNSIGNED NOT NULL,
  set_number SMALLINT UNSIGNED NOT NULL,
  repetitions SMALLINT UNSIGNED NULL,
  weight_kg DECIMAL(5,2) NULL,
  duration_seconds SMALLINT UNSIGNED NULL,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT uq_exercise_set_number UNIQUE (workout_session_exercise_id, set_number),
  CONSTRAINT fk_exercise_set_session_exercise
    FOREIGN KEY (workout_session_exercise_id) REFERENCES workout_session_exercise(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);
