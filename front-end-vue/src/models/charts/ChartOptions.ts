export interface ChartOptions {
  plugins?: {
    legend?: {
      position?: string;
      onHover?: Function;
      onLeave?: Function;
      labels?: { boxWidth: number; fontSize: number };
      display?: boolean;
    };
  };
  tooltips?: { callbacks: { label(t: any, d: any): string } };
}
