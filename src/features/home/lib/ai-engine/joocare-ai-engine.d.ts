// Types for the embedded engine script. Importing it only registers window.JoocareEngine.

export type JoocareEngineStep = {
  label: string[];
  status: string;
};

export type JoocareEngineContent = {
  rtl: boolean;
  topLabel: string;
  coreLabel: string;
  ariaTitle: string;
  footer: string[];
  steps: JoocareEngineStep[];
};

export type JoocareEngineOptions = {
  logo: string;
  content: JoocareEngineContent;
};

export type JoocareEngineInstance = {
  destroy: () => void;
};

export type JoocareEngineApi = {
  mount: (
    element: HTMLElement,
    options: JoocareEngineOptions,
  ) => JoocareEngineInstance | null;
};

declare global {
  interface Window {
    JoocareEngine?: JoocareEngineApi;
  }
}
