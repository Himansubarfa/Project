// script.js

document.getElementById('summarizeBtn').addEventListener('click', function() {
    let inputText = document.getElementById('textInput').value;
  
    // Simple summarization logic (just a placeholder)
    let summarizedText = inputText.split(' ').slice(0, 30).join(' ') + '...';
  
    document.getElementById('summaryResult').textContent = summarizedText;
  });
  
  document.getElementById('generateMapBtn').addEventListener('click', function() {
    let inputConcepts = document.getElementById('mindMapInput').value;
  
    // Simple Mind Map logic (just a placeholder for visualization)
    let conceptsArray = inputConcepts.split(',').map(concept => concept.trim());
  
    let mindMapHTML = '<ul>';
    conceptsArray.forEach(concept => {
      mindMapHTML += `<li>${concept}</li>`;
    });
    mindMapHTML += '</ul>';
  
    document.getElementById('mindMapResult').innerHTML = mindMapHTML;
  });
  