// import type { Request, Response } from "express";
// import { parseResume } from "../services/parser.service.js";
// import {
//   calculateMatchScore,
//   extractCandidateName,
//   getMatchingAndMissingSkills,
// } from "../services/scorer.service.js";
// import { getDB } from "../services/database.service.js";
// import fs from "fs";

// export async function uploadAndScreen(req: Request, res: Response) {

//   console.log("uploadAndScreen runnig");//THis is not running

//   const files = req.files as Express.Multer.File[];
//   const { jdText } = req.body;

//   // console.log("The job_description is ",jdText);

//   if (!files || files.length === 0) {
//     return res.status(400).json({ error: "No files uploaded" });
//   }

//   if (!jdText) {
//     return res.status(400).json({ error: "Job description is required" });//THis is running 
//   }
// const pool = getDB();
//   const client = await pool.connect(); 

//   try {
//         await client.query("BEGIN");

//     //Create screening session
//     const [sessionResult] = await connection.execute(
//       "INSERT INTO screening_sessions (job_description) VALUES (?)",
//       [jdText],
//     ); //why i write like this ? connection.execute?

//     const sessionId = (sessionResult as any).insertId;

//     const results = [];

//     for (const file of files) {
//       const resumeText = await parseResume(file.path, file.originalname);
//       const score = calculateMatchScore(resumeText, jdText);
//       const { matching, missing } = getMatchingAndMissingSkills(
//         resumeText,
//         jdText,
//       );
//       const preview = resumeText.substring(0, 300) + "..."; //what is this?

//       results.push({
//         filename: file.originalname,
//         candidateName: extractCandidateName(file.originalname),
//         matchScore: score,
//         matchingSkills: matching,
//         missingSkills: missing,
//         resumePreview: preview,
//       });

//       fs.unlinkSync(file.path); //"Delete this file from the hard drive right now."
//     }

//     //    Sort and add ranks
//     const sorted = results.sort((a, b) => b.matchScore - a.matchScore); //sorted orders the candidates from highest match score to lowest
//     const ranked = sorted.map((candidate, index) => ({
//       ...candidate,
//       rank: index + 1,
//     }));

//     // Insert candidates and skills
//     for (const candidate of ranked) {
//       const [candidateResult] = await connection.execute(
//         `INSERT INTO candidates (session_id, filename, candidate_name, match_score, resume_preview, rank_position) 
//                  VALUES (?, ?, ?, ?, ?, ?)`,
//         [
//           sessionId,
//           candidate.filename,
//           candidate.candidateName,
//           candidate.matchScore,
//           candidate.resumePreview,
//           candidate.rank,
//         ],
//       );

//       const candidateId = (candidateResult as any).insertId;

//       //Insert matching skills
//       for (const skill of candidate.matchingSkills) {
//         await connection.execute(
//           "INSERT INTO  matching_skills (candidate_id, skill_name) VALUES (?, ?)",
//           [candidateId, skill],
//         );
//       }
//     }
//     await connection.commit();

//     res.json({
//       success: true,
//       sessionId,
//       candidates: ranked,
//       totalCandidates: ranked.length,
//     });
//   } catch (error) {
//     await connection.rollback();
//     console.error(error);
//     res.status(500).json({ error: "Processing failed" });
//   } finally {
//     connection.release();
//   }
// }

// export async function getSessionResults(req: Request, res: Response) {
//   const { sessionId } = req.params;

//   if (!sessionId) {
//     return res.status(400).json({ error: "Session ID is required" });
//     /* I need this block cause
//     MySQL driver's execute() method expects an array of solid, concrete values (string, number, etc.). It refuses to accept undefined because you cannot pass undefined into a SQL query placeholder ?. TypeScript is stepping in ahead of time to protect you from sending a broken, blank parameter to your database.
//     */
//   }

//   try {
//     // Get session info
//     const [sessions] = await getDB().execute(
//       "SELECT * FROM screening_sessions WHERE id = ?",
//       [sessionId],
//     );

//     if ((sessions as any[]).length === 0) {
//       return res.status(404).json({ error: "Session not found" });
//     }

//     // Get candidates
//     const [candidates] = await getDB().execute(
//       "SELECT * FROM candidates WHERE session_id = ? ORDER BY rank_position",
//       [sessionId],
//     );

//     const results = [];

//     // Get skills for each candidate
//     for (const candidate of candidates as any[]) {
//       const [matching] = await getDB().execute(
//         "SELECT skill_name FROM matching_skills WHERE candidate_id = ?",
//         [candidate.id],
//       );
//       const [missing] = await getDB().execute(
//         "SELECT skill_name FROM missing_skills WHERE candidate_id = ?",
//         [candidate.id],
//       );

//       results.push({
//         ...candidate,
//         matchingSkills: (matching as any[]).map((s) => s.skill_name),
//         missingSkills: (missing as any[]).map((s) => s.skill_name),
//       });
//     }

//     res.json({
//       success: true,
//       session: (sessions as any[])[0],
//       candidates: results,
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch results" });
//   }
// }

// export async function exportToCSV(req: Request, res: Response) {
//   const { sessionId } = req.params;
//   if (!sessionId) {
//     return res.status(400).json({ error: "Session ID is required" });
//   }

//   try {
//     const [candidates] = await getDB().execute(
//       "SELECT * FROM candidates WHERE session_id = ? ORDER BY rank_position",
//       [sessionId],
//     );

//     //Get skills
//     const enrichedCandidates = [];

//     for (const candidate of candidates as any[]) {
//       const [matching] = await getDB().execute(
//         "SELECT skill_name FROM matching_skills WHERE candidate_id = ?",
//         [candidate.id],
//       );
//       const [missing] = await getDB().execute(
//         "SELECT skill_name FROM missing_skills WHERE candidate_id = ?",
//         [candidate.id],
//       );

//       enrichedCandidates.push({
//         Rank: candidate.rank_position,
//         "Candidate Name": candidate.candidate_name,
//         "Match Score": candidate.match_score,
//         "Matching Skills": (matching as any[])
//           .map((s) => s.skill_name)
//           .join(", "),
//         "Missing Skills": (missing as any[])
//           .map((s) => s.skill_name)
//           .join(", "),
//         "Resume Preview": candidate.resume_preview,
//       });
//     }


//             // Create CSV
//         const headers = ['Rank', 'Candidate Name', 'Match Score', 'Matching Skills', 'Missing Skills', 'Resume Preview'];
//         const csvRows = [headers.join(',')];//arr items to single text strim  separated by ,
        
//         for (const candidate of enrichedCandidates) {
//             const row = headers.map(header => {
//                 const value = candidate[header as keyof typeof candidate];
//                 return `"${String(value).replace(/"/g, '""')}"`;
//             }).join(','); // i use here join then again use join at csvRows 
//             csvRows.push(row);
//         }
        
//         const csv = csvRows.join('\n');//what is this doing?
        
//         res.setHeader('Content-Type', 'text/csv');
//         res.setHeader('Content-Disposition', `attachment; filename=session_${sessionId}_results.csv`);//what is line?
//         res.send(csv);

        

//   } catch (error) {
//  res.status(500).json({ error: 'Export failed' });
// }
// }





import type { Request, Response } from "express";
import { parseResume } from "../services/parser.service.js";
import {
  calculateMatchScore,
  extractCandidateName,
  getMatchingAndMissingSkills,
} from "../services/scorer.service.js";
import { getDB } from "../services/database.service.js";
import fs from "fs";

export async function uploadAndScreen(req: Request, res: Response) {
  console.log("uploadAndScreen running");

  const files = req.files as Express.Multer.File[];
  const { jdText } = req.body;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  if (!jdText) {
    return res.status(400).json({ error: "Job description is required" });
  }

  const pool = getDB();
  const client = await pool.connect(); // pg: borrow one connection from pool

  try {
    await client.query("BEGIN"); // pg: start transaction

    // pg uses $1, $2 placeholders instead of ?
    // pg returns { rows: [...] } instead of [results, fields]
    const sessionResult = await client.query(
      "INSERT INTO screening_sessions (job_description) VALUES ($1) RETURNING id",
      [jdText]
    );
    const sessionId = sessionResult.rows[0].id; // pg: RETURNING id gives us the inserted id

    const results = [];

    for (const file of files) {
      const resumeText = await parseResume(file.path, file.originalname);
      const score = calculateMatchScore(resumeText, jdText);
      const { matching, missing } = getMatchingAndMissingSkills(resumeText, jdText);
      const preview = resumeText.substring(0, 300) + "..."; // take first 300 chars as preview

      results.push({
        filename: file.originalname,
        candidateName: extractCandidateName(file.originalname),
        matchScore: score,
        matchingSkills: matching,
        missingSkills: missing,
        resumePreview: preview,
      });

      fs.unlinkSync(file.path); // delete uploaded temp file after processing
    }

    const sorted = results.sort((a, b) => b.matchScore - a.matchScore);
    const ranked = sorted.map((candidate, index) => ({
      ...candidate,
      rank: index + 1,
    }));

    for (const candidate of ranked) {
      const candidateResult = await client.query(
        `INSERT INTO candidates (session_id, filename, candidate_name, match_score, resume_preview, rank_position)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [
          sessionId,
          candidate.filename,
          candidate.candidateName,
          candidate.matchScore,
          candidate.resumePreview,
          candidate.rank,
        ]
      );

      const candidateId = candidateResult.rows[0].id;

      for (const skill of candidate.matchingSkills) {
        await client.query(
          "INSERT INTO matching_skills (candidate_id, skill_name) VALUES ($1, $2)",
          [candidateId, skill]
        );
      }

      for (const skill of candidate.missingSkills) {
        await client.query(
          "INSERT INTO missing_skills (candidate_id, skill_name) VALUES ($1, $2)",
          [candidateId, skill]
        );
      }
    }

    await client.query("COMMIT"); // pg: commit transaction

    res.json({
      success: true,
      sessionId,
      candidates: ranked,
      totalCandidates: ranked.length,
    });
  } catch (error) {
    await client.query("ROLLBACK"); // pg: rollback on error
    console.error(error);
    res.status(500).json({ error: "Processing failed" });
  } finally {
    client.release(); // always return connection back to pool
  }
}

export async function getSessionResults(req: Request, res: Response) {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  try {
    const pool = getDB();

    const sessionResult = await pool.query(
      "SELECT * FROM screening_sessions WHERE id = $1",
      [sessionId]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    const candidatesResult = await pool.query(
      "SELECT * FROM candidates WHERE session_id = $1 ORDER BY rank_position",
      [sessionId]
    );

    const results = [];

    for (const candidate of candidatesResult.rows) {
      const matching = await pool.query(
        "SELECT skill_name FROM matching_skills WHERE candidate_id = $1",
        [candidate.id]
      );
      const missing = await pool.query(
        "SELECT skill_name FROM missing_skills WHERE candidate_id = $1",
        [candidate.id]
      );

      results.push({
        ...candidate,
        matchingSkills: matching.rows.map((s: any) => s.skill_name),
        missingSkills: missing.rows.map((s: any) => s.skill_name),
      });
    }

    res.json({
      success: true,
      session: sessionResult.rows[0],
      candidates: results,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch results" });
  }
}

export async function exportToCSV(req: Request, res: Response) {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  try {
    const pool = getDB();

    const candidatesResult = await pool.query(
      "SELECT * FROM candidates WHERE session_id = $1 ORDER BY rank_position",
      [sessionId]
    );

    const enrichedCandidates = [];

    for (const candidate of candidatesResult.rows) {
      const matching = await pool.query(
        "SELECT skill_name FROM matching_skills WHERE candidate_id = $1",
        [candidate.id]
      );
      const missing = await pool.query(
        "SELECT skill_name FROM missing_skills WHERE candidate_id = $1",
        [candidate.id]
      );

      enrichedCandidates.push({
        Rank: candidate.rank_position,
        "Candidate Name": candidate.candidate_name,
        "Match Score": candidate.match_score,
        "Matching Skills": matching.rows.map((s: any) => s.skill_name).join(", "),
        "Missing Skills": missing.rows.map((s: any) => s.skill_name).join(", "),
        "Resume Preview": candidate.resume_preview,
      });
    }

    const headers = ["Rank", "Candidate Name", "Match Score", "Matching Skills", "Missing Skills", "Resume Preview"];
    const csvRows = [headers.join(",")]; // first row = column headers as comma separated string

    for (const candidate of enrichedCandidates) {
      const row = headers.map((header) => {
        const value = candidate[header as keyof typeof candidate];
        return `"${String(value).replace(/"/g, '""')}"`; // wrap in quotes, escape any " inside
      }).join(",");
      csvRows.push(row);
    }

    const csv = csvRows.join("\n"); // join all rows with newline = final CSV text

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=session_${sessionId}_results.csv`); // tells browser to download as a file with this name
    res.send(csv);

  } catch (error) {
    res.status(500).json({ error: "Export failed" });
  }
}
/* 

candidate[header as keyof typeof candidate]; : It says the text string inside the header variable is guaranteed to exist as a key inside my candidate object."


return `"${String(value).replace(/"/g, '""')}"`;  :  It converts the value to a string, changes any existing double quotes (") into a safe pair of double quotes (""), and wraps the entire value in a fresh set of outer double quotes ("value").



*/