## School Management API

### API Routes

#### Classes `/api/classes`
- GET / - Get all classes
- GET /:id - Get class by ID
- POST / - Create new class
- PUT /:id - Update class
- DELETE /:id - Delete class

#### Students `/api/eleves`
- GET / - Get all students
- GET /:id - Get student by ID
- POST / - Create new student
- PUT /:id - Update student
- DELETE /:id - Delete student

#### Teachers `/api/enseignants`
- GET / - Get all teachers
- GET /:id - Get teacher by ID
- POST / - Create new teacher
- PUT /:id - Update teacher
- DELETE /:id - Delete teacher

#### Studies `/api/etudes`
- GET / - Get all studies
- GET /:id - Get study by ID
- POST / - Create new study
- PUT /:id - Update study
- DELETE /:id - Delete study

#### Sessions `/api/seances`
- GET / - Get all sessions
- GET /:id - Get session by ID
- POST / - Create new session
- PUT /:id - Update session
- DELETE /:id - Delete session

#### Payments `/api/paiements`
- GET / - Get all payments
- GET /:id - Get payment by ID
- POST / - Create new payment
- PUT /:id - Update payment
- DELETE /:id - Delete payment

### Search API

#### Search Students `/api/search/eleves`
Query parameters:
- `nom` - Search by student name
- `classe` - Filter by class ID
- `dateNaissanceStart` - Filter by birth date range start
- `dateNaissanceEnd` - Filter by birth date range end

Example:
```bash
GET /api/search/eleves?nom=ali&classe=123
```

#### Search Teachers `/api/search/enseignants`
Query parameters:
- `nom` - Search by teacher name
- `matiere` - Filter by subject

Example:
```bash
GET /api/search/enseignants?matiere=math
```

#### Search Studies `/api/search/etudes`
Query parameters:
- `matiere` - Search by subject
- `niveau` - Filter by level
- `enseignant` - Filter by teacher ID

Example:
```bash
GET /api/search/etudes?matiere=physics&niveau=7eme
```

### Statistics API

#### Attendance Statistics `/api/stats/attendance/:etudeId`
Get attendance statistics for a specific study:
- Total sessions
- Attendance by student
- Average attendance rate

Example:
```bash
GET /api/stats/attendance/123
```

#### Payment Statistics `/api/stats/payments/:etudeId`
Get payment statistics for a specific study:
- Total payments
- Total administration fees
- Total teacher fees
- Total sessions

Example:
```bash
GET /api/stats/payments/123
```

### Example Requests

#### Create a Class
```bash
POST /api/classes
{
  "niveau_classe": "7éme année",
  "nom_classe": "7b7"
}
```

#### Create a Student
```bash
POST /api/eleves
{
  "nom_eleve": "Alioui",
  "prenom_eleve": "Mohamed",
  "date_naissance": "2010-01-01",
  "nom_parent": "Mohamed Alioui",
  "num_parent": "20778991",
  "classe_id": "class_id_here"
}
```

#### Record Attendance
```bash
POST /api/seances
{
  "date_seance": "2024-01-20T14:00:00Z",
  "etude_id": "study_id_here",
  "presences": [
    {
      "eleve": "student_id_here",
      "status": "present"
    }
  ]
}
```

#### Record Payment
```bash
POST /api/paiements
{
  "etude_id": "study_id_here",
  "total_administration": 100,
  "total_enseignant": 200,
  "total_seances": 10
}
```