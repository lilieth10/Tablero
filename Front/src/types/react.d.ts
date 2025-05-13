import * as React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

declare module 'react' {
  export const useState: typeof React.useState;
  export const useEffect: typeof React.useEffect;
  export type Dispatch<A> = React.Dispatch<A>;
  export type SetStateAction<S> = React.SetStateAction<S>;
  export type ChangeEvent<T = Element> = React.ChangeEvent<T>;
  export type ReactNode = React.ReactNode;
  export type JSX = React.JSX;
  export type Element = React.ReactElement;
  export type FC<P = {}> = React.FC<P>;
  export type DragDropContextProps = React.ComponentProps<typeof DragDropContext>;
  export type DroppableProvided = {
    innerRef: (element: HTMLElement | null) => void;
    placeholder?: React.ReactNode;
    droppableProps: {
      [key: string]: any;
    };
  };
  export type DroppableStateSnapshot = {
    isDraggingOver: boolean;
    draggingOverWith?: string;
  };
  export type DraggableRubric = {
    source: {
      index: number;
    };
  };
  export type DragResult = {
    draggableId: string;
    type: string;
    source: {
      droppableId: string;
      index: number;
    };
    destination: {
      droppableId: string;
      index: number;
    } | null;
  };
  export interface JSX {
    IntrinsicElements: {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
      button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
      input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
    };
  }
} 