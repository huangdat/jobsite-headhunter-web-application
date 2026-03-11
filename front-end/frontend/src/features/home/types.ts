export interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  tags?: string[];
  match?: string;
}
