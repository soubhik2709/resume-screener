// import stringSimilarity from 'string-similarity';// i think this causes the same error

 const stringSimilarity = require('string-similarity');

 export function extractCandidateName(filename:string):string{
        return filename
        .replace(/\.(pdf|docx|doc)$/i, '')
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
 }


 export function calculateMatchScore(resumeText: string, jdText: string): number {
    const similarity = stringSimilarity.compareTwoStrings(resumeText, jdText);
    return Math.round(similarity * 100);
}

export function extractKeywords(text: string, limit: number = 15): string[] { //what is limit ?
    const stopwords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'will',
        'would', 'could', 'should', 'this', 'that', 'these', 'those', 'from'
    ]);
    
    const words = text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3 && !stopwords.has(word));
    
    const frequency: Record<string, number> = {};
    words.forEach(word => {
        frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([word]) => word);
}


export function getMatchingAndMissingSkills(resumeText: string, jdText: string) {
    const jdKeywords = extractKeywords(jdText, 15);
    const resumeLower = resumeText.toLowerCase();
    
    const matching = jdKeywords.filter(keyword => resumeLower.includes(keyword));
    const missing = jdKeywords.filter(keyword => !resumeLower.includes(keyword));
    
    return { matching, missing };
}