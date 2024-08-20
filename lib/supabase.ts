import '@tensorflow/tfjs'; // Ensure this is imported to set up the Node.js backend
import { createClient } from '@supabase/supabase-js';
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

interface Document {
  id: string;
  content: string;
  similarity: number;
  metadata: Record<string, any>; // Adjust this type based on the structure of your metadata
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for public operations (can be used client-side)
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

// Client for admin operations (use only in secure server-side contexts)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

let model: use.UniversalSentenceEncoder;

// Load the Universal Sentence Encoder model
async function getModel() {
  if (!model) {
    try {
      model = await use.load();
      console.log('Model loaded:', model);
    } catch (error) {
      console.error('Error in getModel:', error);
    }
  }
  return model;
}

// Generate embedding for a given text
export async function generateEmbedding(text: string): Promise<number[]> {
  const model = await getModel();
  const embeddings = await model.embed([text]);
  const embedding = embeddings.arraySync()[0];

  // Ensure the embedding is exactly 512 dimensions
  const paddedEmbedding = embedding.slice(0, 512);
  while (paddedEmbedding.length < 512) {
    paddedEmbedding.push(0);
  }

  // Return the embedding as an array of numbers, rounded to 5 decimal places
  return paddedEmbedding.map(x => Number(x.toFixed(5)));
}

// Query Supabase for similar documents
export async function querySupabase(query: string, topK: number = 3) {
  try {
    const embedding = await generateEmbedding(query);
    console.log('Generated embedding:', embedding);

    const { data: documents, error } = await supabasePublic.rpc('match_documents', {
      query_embedding: embedding,
      filter: '{}', // Add filters here if needed
    });

    if (error) {
      console.error('Error querying Supabase:', error);
      return [];
    }

    if (!documents || documents.length === 0) {
      console.log('No matching documents found.');
      return [];
    }

    return documents.map((doc: Document) => ({
      content: doc.content,
      similarity: doc.similarity,
      metadata: doc.metadata
    }));
  } catch (error) {
    console.error('Unexpected error querying Supabase:', error);
    return [];
  }
}