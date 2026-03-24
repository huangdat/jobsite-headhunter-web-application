export interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  workingType?: string;
  tags?: string[];
  match?: string;
}
