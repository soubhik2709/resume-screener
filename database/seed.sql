-- --  # Sample 
-- USE resume_screener;

-- -- ============================================
-- -- Insert screening session
-- -- ============================================

-- INSERT INTO screening_sessions (job_description)
-- VALUES (
-- 'Looking for a React Developer with Next.js, TypeScript, Docker, and MySQL experience'
-- );

-- -- ============================================
-- -- Insert candidates
-- -- ============================================

-- INSERT INTO candidates
-- (session_id, filename, candidate_name, match_score, resume_preview, rank_position)
-- VALUES
-- (1, 'rahul_resume.pdf', 'Rahul Sharma', 92, 'Experienced frontend developer with React and Next.js skills.', 1),

-- (1, 'aman_resume.pdf', 'Aman Verma', 78, 'Frontend developer with React experience and basic TypeScript knowledge.', 2),

-- (1, 'priya_resume.pdf', 'Priya Singh', 65, 'Junior developer with HTML, CSS, and JavaScript experience.', 3);

-- -- ============================================
-- -- Insert matching skills
-- -- ============================================

-- INSERT INTO matching_skills (candidate_id, skill_name)
-- VALUES
-- (1, 'React'),
-- (1, 'Next.js'),
-- (1, 'TypeScript'),
-- (1, 'MySQL'),

-- (2, 'React'),
-- (2, 'TypeScript'),

-- (3, 'JavaScript');

-- -- ============================================
-- -- Insert missing skills
-- -- ============================================

-- INSERT INTO missing_skills (candidate_id, skill_name)
-- VALUES
-- (1, 'Docker'),

-- (2, 'Next.js'),
-- (2, 'Docker'),
-- (2, 'MySQL'),

-- (3, 'React'),
-- (3, 'Next.js'),
-- (3, 'TypeScript'),
-- (3, 'Docker'),
-- (3, 'MySQL');

-- -- ============================================
-- -- Verify inserted data
-- -- ============================================

-- SELECT * FROM screening_sessions;
-- SELECT * FROM candidates;
-- SELECT * FROM matching_skills;
-- SELECT * FROM missing_skills;

-- SELECT * FROM candidates;
-- -- DROP DATABASE resume_screener;