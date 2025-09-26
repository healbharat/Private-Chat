import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { firebaseConfig } from '../firebase-config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service and export it
export const database = getDatabase(app);
