import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import { AppConfig } from './types';

export class CLI {
  private program: Command;

  constructor() {
    this.program = new Command();
    this.setupCommands();
  }

  private setupCommands() {
    this.program
      .name('screenshot-tool')
      .description('Interactive web page screenshot tool using Playwright')
      .version('1.0.0');

    this.program
      .command('capture')
      .description('Take a screenshot of a web page')
      .option('-u, --url <url>', 'URL to capture')
      .option('-w, --width <width>', 'Viewport width', '1920')
      .option('-h, --height <height>', 'Viewport height', '1080')
      .option('-f, --format <format>', 'Image format (png, jpeg, webp)', 'png')
      .option('-q, --quality <quality>', 'Image quality (1-100, for jpeg/webp)', '90')
      .option('-o, --output <dir>', 'Output directory', './screenshots')
      .option('--filename <name>', 'Custom filename (without extension)')
      .option('--full-page', 'Capture full page', true)
      .option('--wait-for <selector>', 'Wait for CSS selector before capturing')
      .option('--delay <ms>', 'Delay before capturing (milliseconds)', '0')
      .option('--dark-mode', 'Enable dark mode')
      .option('--browser <browser>', 'Browser to use (chromium, firefox, webkit)', 'chromium')
      .option('--no-headless', 'Run browser in headed mode')
      .option('--verbose', 'Verbose output')
      .action(async (options) => {
        await this.handleCaptureCommand(options);
      });

    this.program
      .command('interactive')
      .alias('i')
      .description('Interactive mode with prompts')
      .action(async () => {
        await this.handleInteractiveMode();
      });

    this.program
      .command('batch')
      .description('Batch process multiple URLs from a file')
      .option('-f, --file <file>', 'File containing URLs (one per line)')
      .option('--config <config>', 'Configuration file path')
      .action(async (options) => {
        await this.handleBatchMode(options);
      });
  }

  private async handleCaptureCommand(options: any): Promise<AppConfig> {
    const config: AppConfig = {
      screenshot: {
        url: options.url || await this.promptForUrl(),
        width: parseInt(options.width),
        height: parseInt(options.height),
        fullPage: options.fullPage,
        format: options.format as 'png' | 'jpeg' | 'webp',
        quality: options.quality ? parseInt(options.quality) : undefined,
        outputDir: options.output,
        filename: options.filename,
        waitForSelector: options.waitFor,
        delay: parseInt(options.delay),
        darkMode: options.darkMode
      },
      browser: {
        headless: options.headless !== false,
        browser: options.browser as 'chromium' | 'firefox' | 'webkit',
        timeout: 30000
      },
      consent: {
        selectors: ['.fc-cta-consent', '#accept-cookies', '.cookie-accept', '[data-testid="accept-cookies"]'],
        timeout: 5000,
        enabled: true
      },
      verbose: options.verbose || false
    };

    return config;
  }

  private async handleInteractiveMode(): Promise<AppConfig> {
    this.showWelcome();

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'url',
        message: 'Enter the URL to capture:',
        validate: (input) => {
          try {
            new URL(input);
            return true;
          } catch {
            return 'Please enter a valid URL';
          }
        }
      },
      {
        type: 'list',
        name: 'format',
        message: 'Choose image format:',
        choices: [
          { name: 'PNG (lossless)', value: 'png' },
          { name: 'JPEG (compressed)', value: 'jpeg' },
          { name: 'WebP (modern)', value: 'webp' }
        ],
        default: 'png'
      },
      {
        type: 'input',
        name: 'width',
        message: 'Viewport width:',
        default: '1920',
        validate: (input) => {
          const num = parseInt(input);
          return num > 0 && num <= 4000 ? true : 'Width must be between 1 and 4000';
        }
      },
      {
        type: 'input',
        name: 'height',
        message: 'Viewport height:',
        default: '1080',
        validate: (input) => {
          const num = parseInt(input);
          return num > 0 && num <= 4000 ? true : 'Height must be between 1 and 4000';
        }
      },
      {
        type: 'confirm',
        name: 'fullPage',
        message: 'Capture full page (including content below the fold)?',
        default: true
      },
      {
        type: 'list',
        name: 'browser',
        message: 'Choose browser:',
        choices: [
          { name: 'Chromium (recommended)', value: 'chromium' },
          { name: 'Firefox', value: 'firefox' },
          { name: 'WebKit (Safari)', value: 'webkit' }
        ],
        default: 'chromium'
      },
      {
        type: 'input',
        name: 'outputDir',
        message: 'Output directory:',
        default: './screenshots'
      },
      {
        type: 'input',
        name: 'filename',
        message: 'Custom filename (optional, leave empty for auto-generated):',
        default: ''
      },
      {
        type: 'confirm',
        name: 'darkMode',
        message: 'Enable dark mode?',
        default: false
      },
      {
        type: 'input',
        name: 'delay',
        message: 'Delay before capture (milliseconds):',
        default: '0',
        validate: (input) => {
          const num = parseInt(input);
          return num >= 0 ? true : 'Delay must be 0 or positive';
        }
      },
      {
        type: 'confirm',
        name: 'verbose',
        message: 'Enable verbose output?',
        default: false
      }
    ]);

    const config: AppConfig = {
      screenshot: {
        url: answers.url,
        width: parseInt(answers.width),
        height: parseInt(answers.height),
        fullPage: answers.fullPage,
        format: answers.format,
        outputDir: answers.outputDir,
        filename: answers.filename || undefined,
        delay: parseInt(answers.delay),
        darkMode: answers.darkMode
      },
      browser: {
        headless: true,
        browser: answers.browser,
        timeout: 30000
      },
      consent: {
        selectors: ['.fc-cta-consent', '#accept-cookies', '.cookie-accept', '[data-testid="accept-cookies"]'],
        timeout: 5000,
        enabled: true
      },
      verbose: answers.verbose
    };

    return config;
  }

  private async handleBatchMode(options: any): Promise<void> {
    console.log(chalk.yellow('Batch mode not implemented yet'));
    process.exit(1);
  }

  private async promptForUrl(): Promise<string> {
    const { url } = await inquirer.prompt([
      {
        type: 'input',
        name: 'url',
        message: 'Enter the URL to capture:',
        validate: (input) => {
          try {
            new URL(input);
            return true;
          } catch {
            return 'Please enter a valid URL';
          }
        }
      }
    ]);
    return url;
  }

  private showWelcome() {
    console.clear();
    console.log(
      chalk.cyan(
        figlet.textSync('Screenshot Tool', {
          font: 'Small',
          horizontalLayout: 'default',
          verticalLayout: 'default'
        })
      )
    );
    console.log(chalk.gray('Interactive web page screenshot tool using Playwright\n'));
  }

  public async run(): Promise<AppConfig> {
    const args = process.argv;
    
    // If no command specified, run interactive mode
    if (args.length <= 2) {
      return await this.handleInteractiveMode();
    }

    // Parse command line arguments
    await this.program.parseAsync(args);
    
    // This shouldn't be reached in normal flow
    return await this.handleInteractiveMode();
  }
}