import { Spinner } from '../types';

export const PALETTES = [
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#E11D48', // Rose
  '#84CC16', // Lime
  '#A855F7', // Violet
];

export const getColorForIndex = (index: number): string => {
  return PALETTES[index % PALETTES.length];
};

export const DEFAULT_SPINNERS: Spinner[] = [
  {
    id: 'spinner-subjects',
    name: 'Subject Selector',
    category: 'Subjects',
    description: 'Pick what to study next with zero hesitation.',
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
    removeOnWin: false,
    options: [
      { id: 'sub-1', text: 'Mathematics', color: '#8B5CF6', enabled: true },
      { id: 'sub-2', text: 'Physics', color: '#06B6D4', enabled: true },
      { id: 'sub-3', text: 'Chemistry', color: '#F59E0B', enabled: true },
      { id: 'sub-4', text: 'Computer Science', color: '#EC4899', enabled: true },
      { id: 'sub-5', text: 'English', color: '#10B981', enabled: true },
    ],
  },
  {
    id: 'spinner-units',
    name: 'Physics Units Practice',
    category: 'Units',
    description: 'Select a unit to revise today.',
    createdAt: 1700000001000,
    updatedAt: 1700000001000,
    removeOnWin: false,
    options: [
      { id: 'unit-1', text: 'Mechanics & Motion', color: '#3B82F6', enabled: true },
      { id: 'unit-2', text: 'Thermodynamics', color: '#F97316', enabled: true },
      { id: 'unit-3', text: 'Electromagnetism', color: '#8B5CF6', enabled: true },
      { id: 'unit-4', text: 'Optics & Waves', color: '#06B6D4', enabled: true },
      { id: 'unit-5', text: 'Modern Physics', color: '#10B981', enabled: true },
      { id: 'unit-6', text: 'Fluid Dynamics', color: '#EC4899', enabled: true },
    ],
  },
  {
    id: 'spinner-activities',
    name: 'Weekend Activities',
    category: 'Activities',
    description: 'No more arguing about what to do this weekend!',
    createdAt: 1700000002000,
    updatedAt: 1700000002000,
    removeOnWin: false,
    options: [
      { id: 'act-1', text: 'Go for a Hike', color: '#10B981', enabled: true },
      { id: 'act-2', text: 'Board Games Night', color: '#8B5CF6', enabled: true },
      { id: 'act-3', text: 'Bake Something New', color: '#F59E0B', enabled: true },
      { id: 'act-4', text: 'Watch a Classic Movie', color: '#3B82F6', enabled: true },
      { id: 'act-5', text: 'Visit an Art Gallery', color: '#EC4899', enabled: true },
      { id: 'act-6', text: 'Learn a New Song on Piano', color: '#06B6D4', enabled: true },
      { id: 'act-7', text: 'Coffee Shop & Reading', color: '#F97316', enabled: true },
    ],
  },
  {
    id: 'spinner-food',
    name: 'Dinner Decider',
    category: 'Objects',
    description: 'Solve the eternal question: "What should we eat?"',
    createdAt: 1700000003000,
    updatedAt: 1700000003000,
    removeOnWin: false,
    options: [
      { id: 'food-1', text: 'Wood-fired Pizza', color: '#F97316', enabled: true },
      { id: 'food-2', text: 'Sushi Roll Platter', color: '#06B6D4', enabled: true },
      { id: 'food-3', text: 'Authentic Tacos', color: '#F59E0B', enabled: true },
      { id: 'food-4', text: 'Thai Green Curry', color: '#10B981', enabled: true },
      { id: 'food-5', text: 'Smash Burgers & Fries', color: '#E11D48', enabled: true },
      { id: 'food-6', text: 'Creamy Pasta Carbonara', color: '#8B5CF6', enabled: true },
    ],
  },
  {
    id: 'spinner-chapters',
    name: 'Algorithms & Data Structures',
    category: 'Chapters',
    description: 'Daily coding challenge focus chapter.',
    createdAt: 1700000004000,
    updatedAt: 1700000004000,
    removeOnWin: false,
    options: [
      { id: 'ch-1', text: 'Binary Trees & BSTs', color: '#8B5CF6', enabled: true },
      { id: 'ch-2', text: 'Dynamic Programming', color: '#EC4899', enabled: true },
      { id: 'ch-3', text: 'Graph Algorithms (BFS/DFS)', color: '#3B82F6', enabled: true },
      { id: 'ch-4', text: 'Two Pointers & Sliding Window', color: '#06B6D4', enabled: true },
      { id: 'ch-5', text: 'Heaps & Priority Queues', color: '#10B981', enabled: true },
      { id: 'ch-6', text: 'Trie & String Manipulation', color: '#F59E0B', enabled: true },
      { id: 'ch-7', text: 'Bit Manipulation & Math', color: '#F97316', enabled: true },
      { id: 'ch-8', text: 'Backtracking & Recursion', color: '#6366F1', enabled: true },
    ],
  },
];

