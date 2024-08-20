const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');
const fs = require('fs');
const path = require('path');
const csvWriter = require('csv-write-stream');
const { v4: uuidv4 } = require('uuid'); // Import UUID package

// Load environment variables
require('dotenv').config({ path: '.env.local' });

let model;

async function getModel() {
  if (!model) {
    model = await use.load();
  }
  return model;
}

async function generateEmbedding(text) {
  const model = await getModel();
  const embeddings = await model.embed([text]);
  const embedding = embeddings.arraySync()[0];

  // Ensure the embedding is exactly 512 dimensions
  const paddedEmbedding = embedding.slice(0, 512);
  while (paddedEmbedding.length < 512) {
    paddedEmbedding.push(0);
  }

  // Convert embedding to array of numbers rounded to 5 decimal places
  const result = paddedEmbedding.map(x => Number(x.toFixed(5)));

  return result;
}

function processFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function generateMetadata(fileName) {
  return {
    source: fileName,
    dateCreated: new Date().toISOString(),
  };
}

async function populateCSV() {
  const knowledgeBasePath = 'knowledge_base';
  const contents = [];

  const files = fs.readdirSync(knowledgeBasePath);
  for (const filename of files) {
    if (filename.endsWith('.txt')) {
      const filePath = path.join(knowledgeBasePath, filename);
      contents.push({ content: processFile(filePath), metadata: generateMetadata(filename) });
    }
  }

  const writer = csvWriter({ headers: ['id', 'content', 'metadata', 'embedding'] });
  writer.pipe(fs.createWriteStream('documents.csv'));

  for (const { content, metadata } of contents) {
    const id = uuidv4(); // Generate a unique ID for each document
    const embedding = await generateEmbedding(content);
    writer.write({
      id,
      content,
      metadata: JSON.stringify(metadata), // Convert metadata to JSON string
      embedding: JSON.stringify(embedding),
    });
  }

  writer.end();
  console.log('Finished creating CSV file with embeddings');
}

populateCSV().catch(error => {
  console.error('Error creating CSV:', error);
});
