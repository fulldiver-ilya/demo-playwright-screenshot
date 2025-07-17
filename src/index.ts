import { CLI } from './cli';
import { ScreenshotTaker } from './screenshot';
import chalk from 'chalk';

const main = async () => {
  try {
    const cli = new CLI();
    const config = await cli.run();
    
    const screenshotTaker = new ScreenshotTaker(config);
    await screenshotTaker.takeScreenshot();
    await screenshotTaker.cleanup();
    
    process.exit(0);
  } catch (error) {
    console.error(chalk.red('\n💥 Application error:'), error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\n👋 Goodbye!'));
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(chalk.yellow('\n\n👋 Goodbye!'));
  process.exit(0);
});

main();
