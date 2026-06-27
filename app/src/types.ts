export interface PollOption {
  label: string;
  votes: number;
}

export interface Poll {
  id: number;
  owner: string;
  title: string;
  description: string;
  options: PollOption[];
}
