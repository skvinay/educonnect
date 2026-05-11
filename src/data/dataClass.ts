export interface DegreeProgram {
    name: string;
    duration: string;
  }
  
  export interface CareerOption {
    title: string;
    description: string;
  }
  
  export interface EntranceExam {
    name: string;
    programs: string;
    website: string;
  }
  
  export interface Institute {
    name: string;
    admission: string;
    website: string;
    location?: string;
  }
  
  export interface CareerOpportunity {
    shortTerm: number; 
    longTerm: number; 
  }
  
  export interface CareerCategory {
    id: string;
    title: string;
    shortTitle: string;
    icon: string;
    colorClass: string;
    description: string;
    summary: string;
    opportunities: CareerOpportunity;
    whoShouldChoose: string[];
    degrees: DegreeProgram[];
    careers: CareerOption[];
    entranceExams: EntranceExam[];
    institutes: Institute[];
  }
  
  export interface Scholarship {
    name: string;
    eligibility: string;
    benefits: string;
    website: string;
  }

  export interface CareerSelfTest {
    title: string;
    description: string;
    questions: {
      id: number;
      question: string;
      options: {
        text: string;
        streams: string[];
      }[];
    }[];
  }