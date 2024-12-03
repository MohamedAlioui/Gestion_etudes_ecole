import { ObjectId } from 'mongoose';  // Import ObjectId from Mongoose

// Class interface
export interface Class {
  _id: ObjectId;  // _id will be of type ObjectId from mongoose
  nom_classe: string;
}


// Student interface
export interface Student {  
  _id: ObjectId;  // _id will be of type ObjectId from mongoose
  prenom_eleve: string;
  nom_eleve: string;
  date_naissance: string;  // Use Date type for date
  nom_parent: string;
  num_parent: string;
  classe: ObjectId;  // Reference to the Class model (ObjectId type)
  etudes: ObjectId[];  // Array of ObjectId references to the "Etude" model
}
