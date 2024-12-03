export interface Teacher {
  _id: string;                 // Teacher's unique identifier (can be ObjectId in MongoDB)
  nom_enseignant: string;     // Teacher's full name (last name)
  prenom_enseignant: string;  // Teacher's first name
  matiere: string;            // The subject the teacher teaches
  emploi_file: string;        // Employment file or other related information (could be a file path or Buffer)
  numero_telephone: string;   // Teacher's phone number
}
