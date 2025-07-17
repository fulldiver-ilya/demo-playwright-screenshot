# Demo Playwright Screenshot

An interactive Node.js application that uses Playwright to take full-page screenshots of web pages with a beautiful CLI interface.

## ✨ Features

- **Interactive CLI** with guided prompts and beautiful interface
- **Multiple browsers** support (Chromium, Firefox, WebKit)
- **Flexible image formats** (PNG, JPEG, WebP) with quality settings
- **Smart cookie consent** handling with multiple selectors
- **Dark mode** support for screenshots
- **Custom viewport** sizes and full-page capture
- **Progress indicators** and colorful output
- **Configurable delays** and element waiting
- **Custom filenames** or auto-generated with timestamps
- **Verbose logging** for debugging

## 🚀 Prerequisites

- Node.js >= 16
- Yarn package manager

## 📦 Installation

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

## 🎯 Usage

### Interactive Mode (Recommended)

Launch the interactive mode with guided prompts:
```bash
yarn start
# or
yarn interactive
```

This will show a beautiful welcome screen and guide you through all options step by step.

### Command Line Mode

Take a screenshot with command line arguments:
```bash
# Basic usage
yarn capture --url "https://example.com"

# Advanced usage with options
yarn capture \
  --url "https://example.com" \
  --width 1920 \
  --height 1080 \
  --format png \
  --output ./my-screenshots \
  --filename "my-screenshot" \
  --full-page \
  --dark-mode \
  --verbose
```

### Available Commands

- `yarn start` - Interactive mode (default)
- `yarn interactive` - Interactive mode with prompts
- `yarn capture` - Command line mode
- `yarn help` - Show help information

## 🎨 Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `--url <url>` | URL to capture | Interactive prompt |
| `--width <width>` | Viewport width | 1920 |
| `--height <height>` | Viewport height | 1080 |
| `--format <format>` | Image format (png, jpeg, webp) | png |
| `--quality <quality>` | Image quality (1-100, for jpeg/webp) | 90 |
| `--output <dir>` | Output directory | ./screenshots |
| `--filename <name>` | Custom filename (without extension) | Auto-generated |
| `--full-page` | Capture full page | true |
| `--wait-for <selector>` | Wait for CSS selector before capturing | - |
| `--delay <ms>` | Delay before capturing (milliseconds) | 0 |
| `--dark-mode` | Enable dark mode | false |
| `--browser <browser>` | Browser (chromium, firefox, webkit) | chromium |
| `--no-headless` | Run browser in headed mode | false |
| `--verbose` | Verbose output | false |

## 🔧 How it Works

1. **Interactive Setup**: Beautiful CLI interface guides you through options
2. **Browser Launch**: Supports Chromium, Firefox, and WebKit browsers
3. **Smart Navigation**: Loads pages with network idle detection
4. **Cookie Handling**: Automatically handles multiple cookie consent patterns
5. **Conditional Waiting**: Waits for specific elements or delays if configured
6. **Screenshot Capture**: Takes high-quality screenshots in multiple formats
7. **Smart Naming**: Generates descriptive filenames with timestamps
8. **Graceful Cleanup**: Properly closes browser resources

## 📁 Output

Screenshots are saved with intelligent naming:
- **Custom**: `my-screenshot.png` (if filename specified)
- **Auto-generated**: `example.com_2024-07-17T10-30-45-123Z_a1b2c3d4.png`

## 🏗️ Project Structure

```
demo-playwright-screenshot/
├── src/
│   ├── index.ts          # Main application entry point
│   ├── cli.ts            # Interactive CLI interface
│   ├── screenshot.ts     # Screenshot capture logic
│   └── types.ts          # TypeScript type definitions
├── screenshots/          # Generated screenshots
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── yarn.lock            # Dependency lock file
└── README.md            # This file
```

## 📦 Dependencies

### Core Dependencies
- **playwright**: Web automation library
- **commander**: Command-line interface framework
- **inquirer**: Interactive command line prompts
- **chalk**: Terminal string styling
- **ora**: Elegant terminal spinners
- **figlet**: ASCII art text generator

### Development Dependencies
- **typescript**: TypeScript compiler
- **ts-node**: TypeScript execution environment
- **ts-node-dev**: Development server with auto-restart

## 🛠️ Development

To modify the application:

1. Edit source files in `src/`
2. Run with auto-restart: `yarn dev`
3. Test interactive mode: `yarn interactive`
4. Test command mode: `yarn capture --url "https://example.com"`

## 🐛 Troubleshooting

- **Browser not found**: Run `yarn playwright install` to download browser binaries
- **Permission errors**: Ensure the output directory is writable
- **Timeout errors**: Use `--verbose` flag to see detailed logs
- **Cookie consent issues**: The app handles multiple common selectors automatically
- **Memory issues**: Close other applications if running multiple browsers

## 🎯 Examples

### Interactive Mode
```bash
yarn start
# Follow the beautiful prompts!
```

### Quick Screenshot
```bash
yarn capture --url "https://github.com"
```

### High-Quality JPEG
```bash
yarn capture \
  --url "https://example.com" \
  --format jpeg \
  --quality 95 \
  --filename "example-homepage"
```

### Mobile Viewport
```bash
yarn capture \
  --url "https://example.com" \
  --width 375 \
  --height 667 \
  --filename "mobile-view"
```

### Dark Mode Screenshot
```bash
yarn capture \
  --url "https://example.com" \
  --dark-mode \
  --filename "dark-theme"
```

## 📄 License

This project is private and not intended for public distribution.