export interface Payment {
    id: string;
    studentId: string;
    amount: number;
    date: string; // ISO format date (e.g., "2024-11-17")
    method: string; // Cash, Bank Transfer, etc.
    description?: string; // Optional note or description about the payment
  }
  