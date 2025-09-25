export type ParentRelation =
  'good' |
  'bad' |
  'complicated' |
  'deceased' |
  'unknown' |
  'absent' |
  'distanced' |
  'avoiding' |
  'imprisoned';

export interface UserData {
  fullName: string;
  dob: string;
  parentsStatus: 'together' | 'separated' | 'other';
  motherRelation: ParentRelation;
  fatherRelation: ParentRelation;
  upbringing: string;
  children: string;
  siblingPosition: string;
  profession: string;
  hobbies: string;
}

export interface AstralMapAnalysis {
  numerology: string;
  family: string;
  wounds: string;
  nlp: string;
  cuento: string;
  symbolicImage: string;
}
