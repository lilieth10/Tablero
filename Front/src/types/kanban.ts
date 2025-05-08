export interface Card {
  id: string;
  title: string;
  description: string;
  columnId: string;
  position?: number;
}

export interface Column {
  id: string;
  title: string;
  position?: number;
}
