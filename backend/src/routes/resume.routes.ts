import express from 'express';
import { upload } from '../utils/fileUpload.js';
import { uploadAndScreen, getSessionResults, exportToCSV } from '../controllers/resume.controller.js';

const router = express.Router();

router.post('/screen', upload.array('resumes', 10), uploadAndScreen);
router.get('/session/:sessionId', getSessionResults);
router.get('/export/:sessionId', exportToCSV);

export default router;
