# Demo Playwright Screenshot

A simple Node.js application that uses Playwright to take full-page screenshots of web pages.

## Features

- Takes full-page screenshots of any website
- Handles cookie consent dialogs automatically
- Generates unique filenames using UUID
- Configurable viewport size (1920x1080)
- Headless browser operation
- TypeScript support

## Prerequisites

- Node.js >= 16
- Yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd demo-playwright-screenshot
```

2. Install dependencies and Playwright browsers:
```bash
yarn bootstrap
```

This will install all dependencies and download the required Playwright browser binaries.

## Usage

### Basic Usage

Take a screenshot of the default URL:
```bash
yarn start
```

### Custom URL

Take a screenshot of a specific URL:
```bash
yarn start "https://example.com"
```

## How it Works

1. **Browser Setup**: Launches a headless Chromium browser with a 1920x1080 viewport
2. **Page Navigation**: Opens the specified URL (or default URL if none provided)
3. **Cookie Consent**: Automatically attempts to click cookie consent buttons
4. **Screenshot**: Takes a full-page screenshot and saves it to the `screenshots/` directory
5. **Cleanup**: Closes the browser and exits

## Output

Screenshots are saved in the `screenshots/` directory with randomly generated UUID filenames (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890.png`).

## Configuration

The application includes several configurable options in `src/index.ts`:

- **Viewport**: Currently set to 1920x1080
- **User Agent**: Configured to mimic Chrome on macOS
- **Default URL**: Set to a China Times article (can be overridden via command line)
- **Cookie Consent Selector**: `.fc-cta-consent` (5-second timeout)

## Project Structure

```
demo-playwright-screenshot/
├── src/
│   └── index.ts          # Main application code
├── screenshots/          # Generated screenshots (created at runtime)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── yarn.lock            # Dependency lock file
└── README.md            # This file
```

## Dependencies

- **playwright**: Web automation library for taking screenshots
- **typescript**: TypeScript compiler
- **ts-node**: TypeScript execution environment
- **ts-node-dev**: Development server with auto-restart

## Development

To modify the application:

1. Edit `src/index.ts`
2. Run with auto-restart: `yarn start`

The application will automatically restart when you make changes to the source code.

## Troubleshooting

- **Browser not found**: Run `yarn playwright install` to download browser binaries
- **Permission errors**: Ensure the `screenshots/` directory is writable
- **Timeout errors**: Some websites may take longer to load; consider increasing timeouts in the code

## License

This project is private and not intended for public distribution.