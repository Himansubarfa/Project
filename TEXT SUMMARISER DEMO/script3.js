document.getElementById('summarizeBtn').addEventListener('click', function () {
    const inputText = document.getElementById('textInput').value;
    const wordLimit = 2500;
  
    // Split input into sentences
    const sentences = inputText.match(/[^\.!\?]+[\.!\?]+/g) || [];
  
    // Create a word frequency map
    const wordFreq = {};
    const words = inputText.toLowerCase().match(/\b\w+\b/g);
    if (words) {
      words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      });
    }
  
    // Score each sentence based on word frequency
    const scoredSentences = sentences.map(sentence => {
      const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
      let score = 0;
      sentenceWords.forEach(word => {
        score += wordFreq[word] || 0;
      });
      return { sentence, score };
    });
  
    // Sort sentences by score (descending)
    scoredSentences.sort((a, b) => b.score - a.score);
  
    // Build the summary within the word limit
    let summary = '';
    let wordCount = 0;
    for (const { sentence } of scoredSentences) {
      const sentenceWordCount = sentence.trim().split(/\s+/).length;
      if (wordCount + sentenceWordCount <= wordLimit) {
        summary += sentence + ' ';
        wordCount += sentenceWordCount;
      } else {
        break;
      }
    }
  
    // Display the summary
    document.getElementById('summaryResult').textContent = summary.trim();
  });
  
  document.getElementById('generateMapBtn').addEventListener('click', function () {
    let inputConcepts = document.getElementById('mindMapInput').value;
  
    // Simple Mind Map logic
    let conceptsArray = inputConcepts.split(',').map(concept => concept.trim());
  
    let mindMapHTML = '<ul>';
    conceptsArray.forEach(concept => {
      mindMapHTML += `<li>${concept}</li>`;
    });
    mindMapHTML += '</ul>';
  
    document.getElementById('mindMapResult').innerHTML = mindMapHTML;
  });
  