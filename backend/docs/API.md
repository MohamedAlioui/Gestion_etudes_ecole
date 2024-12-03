## School Management API Documentation

### Authentication
Currently, the API does not require authentication. It's recommended to implement authentication in production.

### Base URL
```
http://localhost:3000/api
```

### Error Responses
All endpoints may return these error responses:
```json
{
  "message": "Error message here"
}
```

### Endpoints

#### Classes API

**Create Class**
```http
POST /classes
Content-Type: application/json

{
  "niveau_classe": "7éme année",
  "nom_classe": "7b7"
}
```

Response:
```json
{
  "_id": "class_id",
  "niveau_classe": "7éme année",
  "nom_classe": "7b7"
}
```

**Get All Classes**
```http
GET /classes
```

**Get Class by ID**
```http
GET /classes/:id
```

**Update Class**
```http
PUT /classes/:id
Content-Type: application/json

{
  "nom_classe": "7b8"
}
```

**Delete Class**
```http
DELETE /classes/:id
```

#### Students API

**Create Student**
```http
POST /eleves
Content-Type: application/json

{
  "nom_eleve": "Alioui",
  "prenom_eleve": "Mohamed",
  "date_naissance": "2010-01-01",
  "nom_parent": "Mohamed Alioui",
  "num_parent": "20778991",
  "classe_id": "class_id"
}
```

**Search Students**
```http
GET /search/eleves?nom=ali&classe=class_id
```

Parameters:
- `nom`: Search by name
- `classe`: Filter by class ID
- `dateNaissanceStart`: Filter by birth date range start
- `dateNaissanceEnd`: Filter by birth date range end

#### Statistics API

**Get Attendance Stats**
```http
GET /stats/attendance/:etudeId
```

Response:
```json
{
  "totalSessions": 10,
  "attendanceByStudent": {
    "student_id": {
      "present": 8,
      "absent": 2
    }
  },
  "averageAttendance": 80
}
```

**Get Payment Stats**
```http
GET /stats/payments/:etudeId
```

Response:
```json
{
  "totalPayments": 5,
  "totalAdministration": 500,
  "totalEnseignant": 1000,
  "totalSeances": 20
}
```

### Data Models

#### Classe
```typescript
{
  niveau_classe: string;
  nom_classe: string;
}
```

#### Eleve
```typescript
{
  nom_eleve: string;
  prenom_eleve: string;
  date_naissance: Date;
  nom_parent: string;
  num_parent: string;
  classe: ObjectId; // Reference to Classe
  etudes: ObjectId[]; // Reference to Etude[]
}
```

#### Enseignant
```typescript
{
  nom_enseignant: string;
  prenom_enseignant: string;
  matiere: string;
  emploi_file: Buffer;
}
```

#### Etude
```typescript
{
  matiere: string;
  niveau: string;
  enseignant: ObjectId; // Reference to Enseignant
  eleves: ObjectId[]; // Reference to Eleve[]
}
```

#### Seance
```typescript
{
  date_seance: Date;
  etude: ObjectId; // Reference to Etude
  presences: [{
    eleve: ObjectId; // Reference to Eleve
    status: string; // "present" | "absent"
  }];
}
```

#### Paiement
```typescript
{
  etude: ObjectId; // Reference to Etude
  total_administration: number;
  total_enseignant: number;
  total_seances: number;
}
```