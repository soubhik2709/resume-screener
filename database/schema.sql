-- # Table creation

-- Resume Screener Database Schema

-- Drop database if exists (for fresh start)
DROP DATABASE IF EXISTS resume_screener;


-- Create database
CREATE DATABASE resume_screener;
USE resume_screener;


-- Table: screening_sessions . Stores each screening session
CREATE TABLE screening_sessions(
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: candidates , Stores candidate information for each session
CREATE TABLE candidates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    candidate_name VARCHAR(255) NOT NULL,
    match_score INT NOT NULL,
    resume_preview TEXT NOT NULL,
    rank_position INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES screening_sessions(id) ON DELETE CASCADE,
    INDEX idx_session_id (session_id),
    INDEX idx_match_score (match_score),
    INDEX idx_rank (rank_position)
);

-- Table: matching_skills , Stores skills that match between resume and JD
CREATE TABLE matching_skills(
    id INT PRIMARY KEY AUTO_INCREMENT,
    candidate_id INT NOT NULL,
    skill_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    INDEX idx_candidate_id (candidate_id),
    INDEX idx_skill_name (skill_name)
);


-- Table: missing_skills,Stores skills missing from resume but present in JD
CREATE TABLE missing_skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    candidate_id INT NOT NULL,
    skill_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    INDEX idx_candidate_id (candidate_id),
    INDEX idx_skill_name (skill_name)

);


-- Show all tables (for verification)
SHOW TABLES;



-- Success message
SELECT 'Database setup complete!' as Status;

--