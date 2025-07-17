export interface ScreenshotConfig {
  url: string;
  width: number;
  height: number;
  fullPage: boolean;
  format: 'png' | 'jpeg' | 'webp';
  quality?: number;
  outputDir: string;
  filename?: string;
  waitForSelector?: string;
  delay?: number;
  darkMode?: boolean;
}

export interface BrowserConfig {
  headless: boolean;
  browser: 'chromium' | 'firefox' | 'webkit';
  userAgent?: string;
  timeout: number;
}

export interface ConsentConfig {
  selectors: string[];
  timeout: number;
  enabled: boolean;
}

export interface AppConfig {
  screenshot: ScreenshotConfig;
  browser: BrowserConfig;
  consent: ConsentConfig;
  verbose: boolean;
}