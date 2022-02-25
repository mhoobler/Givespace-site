declare namespace UtilsHook {
  export type addNavigationMetric = (navigate_to: string) => void;
  export type addClickMetric = (click_on: string) => void;

  export type base = {
    addNavigationMetric: UtilsHook.addNavigationMetric;
    addClickMetric: UtilsHook.addClickMetric;
  };

  export type FC = () => UtilsHook.base;
}
