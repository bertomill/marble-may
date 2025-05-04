import { 
  Timestamp, 
  collection, 
  doc, 
  setDoc, 
  addDoc,
  updateDoc,
  serverTimestamp,
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { Project } from '@/types';

// Helper to convert Firebase Timestamp to string
export function timestampToString(timestamp: Timestamp | null): string | null {
  if (!timestamp) return null;
  return timestamp.toDate().toISOString();
}

// Helper to normalize Firebase document data
export function normalizeData<T>(data: any): T {
  // Create a copy to avoid mutating the original
  const normalized = { ...data };
  
  // Convert all Timestamp instances to ISO strings
  Object.keys(normalized).forEach(key => {
    if (normalized[key] instanceof Timestamp) {
      normalized[key] = timestampToString(normalized[key]);
    }
  });
  
  return normalized as T;
}

// Function to parse JSON if it's a string, or return as is if it's already an object
export function parseGeneratedCode(codeData: string | Record<string, string>): Record<string, string> {
  if (typeof codeData === 'string') {
    try {
      return JSON.parse(codeData);
    } catch (e) {
      // If not valid JSON, return as a single file content
      return { 'app.js': codeData };
    }
  }
  return codeData;
}

// Project converter for Firestore
export const projectConverter: FirestoreDataConverter<Project> = {
  toFirestore(project: Project): DocumentData {
    return {
      user_id: project.user_id,
      name: project.name,
      business_details: project.business_details,
      app_idea: project.app_idea || '',
      features: project.features || [],
      generated_code: typeof project.generated_code === 'string' 
        ? project.generated_code 
        : JSON.stringify(project.generated_code || {}),
      sketch_data: project.sketch_data || '',
      status: project.status,
      preview_url: project.preview_url || '',
      published_url: project.published_url || '',
      updated_at: serverTimestamp()
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Project {
    const data = snapshot.data();
    const generatedCode = typeof data.generated_code === 'string'
      ? parseGeneratedCode(data.generated_code)
      : (data.generated_code || {});
      
    return {
      id: snapshot.id,
      user_id: data.user_id,
      name: data.name,
      business_details: data.business_details,
      app_idea: data.app_idea || '',
      features: data.features || [],
      generated_code: generatedCode,
      sketch_data: data.sketch_data || '',
      status: data.status,
      preview_url: data.preview_url || '',
      published_url: data.published_url || '',
      created_at: timestampToString(data.created_at) || new Date().toISOString(),
      updated_at: timestampToString(data.updated_at) || new Date().toISOString()
    };
  }
};

// Project collection reference with converter
export const projectsCollection = () => 
  collection(db, 'projects').withConverter(projectConverter);

// Create a new project
export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
  const projectWithTimestamps = {
    ...project,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  };
  
  const docRef = await addDoc(collection(db, 'projects'), projectWithTimestamps);
  return { ...project, id: docRef.id };
}

// Update an existing project
export async function updateProject(id: string, project: Partial<Project>) {
  const projectRef = doc(db, 'projects', id);
  const updateData = { 
    ...project,
    updated_at: serverTimestamp(),
    // Ensure generated_code is stored as string if it's an object
    ...(project.generated_code && {
      generated_code: typeof project.generated_code === 'string' 
        ? project.generated_code 
        : JSON.stringify(project.generated_code)
    })
  };
  await updateDoc(projectRef, updateData);
  return true;
} 