export type SpinnerCategory =
  | 'Subjects'
  | 'Units'
  | 'Chapters'
  | 'Topics'
  | 'Objects'
  | 'Activities'
  | 'Custom';

export interface SpinnerOption {
  id: string;
  text: string;
  color?: string;
  weight?: number; // default 1
  enabled: boolean;
}

export interface Spinner {
  id: string;
  name: string;
  category: SpinnerCategory;
  description?: string;
  options: SpinnerOption[];
  createdAt: number;
  updatedAt: number;
  theme?: 'vibrant' | 'neon' | 'pastel' | 'sunset' | 'ocean';
  removeOnWin?: boolean;
}

export interface SpinResult {
  id: string;
  spinnerId: string;
  spinnerName: string;
  winnerOptionId: string;
  winnerText: string;
  winnerColor: string;
  timestamp: number;
}

export type PageView = 'dashboard' | 'spinner';
