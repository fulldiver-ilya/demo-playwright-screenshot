import path from "path";
import Crypto from "crypto";
import { BrowserContext, chromium } from "playwright";

const setupContext = async () => {
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: {
      width: 1920,
      height: 1080,
    },
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
  });

  return context;
};

const openPage = async (context: BrowserContext, url: string) => {
  const page = await context.newPage();

  page.on("load", async (page) => {
    console.debug("Page loaded:", page.url());
  });

  await page.goto(url);

  try {
    await page.click(".fc-cta-consent", {
      timeout: 5000,
    });
  } catch (error) {
    console.error("No cookie consent found.");
  }

  return page;
};

const run = async () => {
  const [, , argUrl] = process.argv;

  const context = await setupContext();

  const url =
    argUrl ??
    "https://www.chinatimes.com/realtimenews/20240725003674-260404?ctrack=pc_main_recmd_p19&chdtv";
  const page = await openPage(context, url);

  const screenPath = path.resolve(
    path.resolve(__dirname, "../screenshots"),
    `${Crypto.randomUUID()}.png`
  );

  await page.screenshot({
    fullPage: true,
    path: screenPath,
  });

  console.debug("Screenshot saved to:", screenPath);

  await context.close();

  process.exit(0);
};

run();
