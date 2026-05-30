import fs from "fs";
import * as pdfParse from "pdf-parse";
import mammoth from "mammoth";
import textract from "textract";

export async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new (pdfParse as any).PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    return result.text;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to parse PDF resume.");
  }
}
export async function extractTextFromDOCX(filePath: string): Promise<string> {
try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error("Error parsing DOCX:", error);
    throw new Error("Failed to parse DOCX resume.");
  }
}

export async function extractTextFromDOC(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    textract.fromFileWithPath(filePath, (error:any, text: string) => {
      if (error) reject(error);
      else resolve(text);
    });
  });
}

export async function parseResume(
  filePath: string,
  filename: string,
): Promise<string> {
  if (filename.toLowerCase().endsWith(".pdf")) {
    return await extractTextFromPDF(filePath);
  } else if (filename.toLowerCase().endsWith(".docx")) {
    return await extractTextFromDOCX(filePath);
  } else if (filename.toLowerCase().endsWith(".doc")) {
    return await extractTextFromDOC(filePath);
  }
  throw new Error("Unsupported file format");
}

//they said to store them, is it store the text also?


/* 

1.textract.fromFileWithPath(filePath, (error:any, text: string) => {
     Note: textract errors can be a string or an object, typing it as 'any' avoids conflicts

2.



*/