declare module "*.svg" {
  import * as React from "reacat";
  const content: React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>;
  const src: string;

  export default src;
}
