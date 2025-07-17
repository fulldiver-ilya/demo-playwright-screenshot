import path from "path";
import fs from "fs";
import crypto from "crypto";
import { BrowserContext, chromium, firefox, webkit, Page } from "playwright";
import chalk from "chalk";
import ora from "ora";
import { AppConfig } from "./types";

export class ScreenshotTaker {
  private config: AppConfig;
  private context?: BrowserContext;

  constructor(config: AppConfig) {
    this.config = config;
  }

  private log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') {
    if (!this.config.verbose && type === 'info') return;
    
    const colors = {
      info: chalk.blue,
      success: chalk.green,
      error: chalk.red,
      warn: chalk.yellow
    };
    
    console.log(colors[type](`[${type.toUpperCase()}] ${message}`));
  }

  private async setupContext(): Promise<BrowserContext> {
    const spinner = ora('Setting up browser...').start();
    
    try {
      const browserType = {
        chromium,
        firefox,
        webkit
      }[this.config.browser.browser];

      const browser = await browserType.launch({
        headless: this.config.browser.headless,
      });

      const context = await browser.newContext({
        viewport: {
          width: this.config.screenshot.width,
          height: this.config.screenshot.height,
        },
        userAgent: this.config.browser.userAgent ||
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        colorScheme: this.config.screenshot.darkMode ? 'dark' : 'light',
      });

      spinner.succeed('Browser setup complete');
      this.log(`Using ${this.config.browser.browser} browser`);
      this.log(`Viewport: ${this.config.screenshot.width}x${this.config.screenshot.height}`);
      
      return context;
    } catch (error) {
      spinner.fail('Failed to setup browser');
      throw error;
    }
  }

  private async openPage(url: string): Promise<Page> {
    if (!this.context) {
      this.context = await this.setupContext();
    }

    const spinner = ora(`Loading ${url}...`).start();
    const page = await this.context.newPage();

    page.on("load", () => {
      this.log(`Page loaded: ${page.url()}`);
    });

    try {
      await page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: this.config.browser.timeout 
      });
      
      spinner.succeed(`Page loaded successfully`);
    } catch (error) {
      spinner.fail(`Failed to load page`);
      throw error;
    }

    return page;
  }

  private async handleCookieConsent(page: Page): Promise<void> {
    if (!this.config.consent.enabled) {
      this.log('Cookie consent handling disabled');
      return;
    }

    const spinner = ora('Handling cookie consent...').start();
    
    for (const selector of this.config.consent.selectors) {
      try {
        await page.click(selector, {
          timeout: this.config.consent.timeout,
        });
        spinner.succeed(`Cookie consent handled with selector: ${selector}`);
        this.log(`Clicked consent button: ${selector}`);
        return;
      } catch (error) {
        this.log(`Consent selector not found: ${selector}`);
      }
    }
    
    spinner.warn('No cookie consent found');
    this.log('No cookie consent buttons found');
  }

  private async waitForConditions(page: Page): Promise<void> {
    if (this.config.screenshot.waitForSelector) {
      const spinner = ora(`Waiting for selector: ${this.config.screenshot.waitForSelector}...`).start();
      try {
        await page.waitForSelector(this.config.screenshot.waitForSelector, {
          timeout: this.config.browser.timeout
        });
        spinner.succeed('Selector found');
      } catch (error) {
        spinner.fail('Selector timeout');
        throw new Error(`Selector not found: ${this.config.screenshot.waitForSelector}`);
      }
    }

    if (this.config.screenshot.delay && this.config.screenshot.delay > 0) {
      const spinner = ora(`Waiting ${this.config.screenshot.delay}ms...`).start();
      await page.waitForTimeout(this.config.screenshot.delay);
      spinner.succeed('Delay completed');
    }
  }

  private generateFilename(url: string): string {
    if (this.config.screenshot.filename) {
      return `${this.config.screenshot.filename}.${this.config.screenshot.format}`;
    }

    const domain = new URL(url).hostname.replace(/^www\./, '');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const uuid = crypto.randomUUID().split('-')[0];
    
    return `${domain}_${timestamp}_${uuid}.${this.config.screenshot.format}`;
  }

  private ensureOutputDirectory(): void {
    if (!fs.existsSync(this.config.screenshot.outputDir)) {
      fs.mkdirSync(this.config.screenshot.outputDir, { recursive: true });
      this.log(`Created output directory: ${this.config.screenshot.outputDir}`);
    }
  }

  public async takeScreenshot(): Promise<string> {
    try {
      const page = await this.openPage(this.config.screenshot.url);
      
      await this.handleCookieConsent(page);
      await this.waitForConditions(page);

      this.ensureOutputDirectory();
      const filename = this.generateFilename(this.config.screenshot.url);
      const fullPath = path.resolve(this.config.screenshot.outputDir, filename);

      const spinner = ora('Taking screenshot...').start();

      const screenshotOptions: any = {
        fullPage: this.config.screenshot.fullPage,
        path: fullPath,
        type: this.config.screenshot.format,
      };

      if (this.config.screenshot.quality && 
          (this.config.screenshot.format === 'jpeg' || this.config.screenshot.format === 'webp')) {
        screenshotOptions.quality = this.config.screenshot.quality;
      }

      await page.screenshot(screenshotOptions);

      spinner.succeed('Screenshot saved successfully');
      
      console.log(chalk.green.bold('\n✅ Screenshot completed!'));
      console.log(chalk.cyan(`📁 Saved to: ${fullPath}`));
      console.log(chalk.gray(`📏 Format: ${this.config.screenshot.format.toUpperCase()}`));
      console.log(chalk.gray(`📐 Size: ${this.config.screenshot.width}x${this.config.screenshot.height}`));
      console.log(chalk.gray(`🌐 URL: ${this.config.screenshot.url}`));

      return fullPath;
    } catch (error) {
      console.error(chalk.red('\n❌ Screenshot failed:'), error);
      throw error;
    }
  }

  public async cleanup(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.log('Browser context closed');
    }
  }
}