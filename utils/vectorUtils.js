const numeric = require('numeric'); // Biblioteca para trabalhar com álgebra linear

// Função que converte texto em vetor (simples contagem de palavras)
function textToVector(text, uniqueWords) {
  const words = text.toLowerCase().split(' ');
  return uniqueWords.map(word => words.filter(w => w === word).length);
}

// Função que calcula a similaridade entre dois vetores (usando produto escalar)
function vectorSimilarity(vec1, vec2) {
  if (vec1.length !== vec2.length) {
    throw new Error('Os vetores devem ter o mesmo comprimento.');
  }
  return numeric.dot(vec1, vec2);
}

module.exports = { textToVector, vectorSimilarity };
