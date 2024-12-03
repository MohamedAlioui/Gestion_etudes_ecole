import mongoose, { Schema, Document } from 'mongoose';
import { Student } from './student';
import { Teacher } from './teacher';

// Define the TypeScript interface for Etude
export interface SupportClass {
  _id?: string;
  niveau: string;
  matiere: string;
  className: string;
  enseignant: {
    _id: string;
    nom_enseignant: string;
    prenom_enseignant: string;
    matiere: string;
  };
  eleves?: string[];
}