declare module 'splitting' {
  export default function Splitting(options?: {
    target?: Element | string;
    by?: string;
    key?: string | null;
  }): any[];
} 