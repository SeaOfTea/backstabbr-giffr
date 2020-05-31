import * as puppeteer from 'puppeteer';
import * as GIFEncode from 'gifencoder';
import { createCanvas, loadImage } from 'canvas';
import * as fs from 'fs';

const url = (year: number, season: string) => `https://www.backstabbr.com/game/The-Great-Sausage-War/6412431889268736/${year}/${season}`;
const start_year = 1901;
const end_year = 1914;
const seasons = ['spring', 'fall', 'winter'];

const years = new Array(end_year - start_year + 1)
  .fill(0)
  .map((_, index) => {
    const current_year : number = start_year + index;
    const year = seasons.map(season => {
      return [current_year, season] as [number, string];
    });
    return year;
  });

(async () => {
  const browser = await puppeteer.launch({ headless: true });

  await Promise.all(years.map(async year => {
    return await Promise.all(year.map(async ([year, season]) => {
      try {
        const page = await browser.newPage();
        await page.goto(url(year, season));

          await page.evaluate(() => {
            const navbar = document.querySelector('.navbar');
            navbar?.remove();
          });

          let element : puppeteer.ElementHandle<Element>;
          while (!element) {
            element = await page.$('#map_container');
            await element?.screenshot({ path: `screenshots/${year}-${season}.png` }) ?? console.log('could not find element', year, season, "retrying");
          }
          await page.close();
      } catch (e) {
        console.log(e);
      }
    }));
  }));

  await browser.close();

  let initialFrame = await loadImage('screenshots/1901-spring.png');

  const encoder = new GIFEncode(initialFrame.width, initialFrame.height);

  encoder.createReadStream().pipe(fs.createWriteStream('output/animated.gif'));

  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(2000);
  encoder.setQuality(100);

  const canvas = createCanvas(initialFrame.width, initialFrame.height);
  const ctx = canvas.getContext('2d');

  let imgFrame;

  await Promise.all(years.map(async year => {
    return await Promise.all(year.map(async ([year, season]) => {
      console.log(`Creating frame for ${year} ${season}`);
      imgFrame = await loadImage(`screenshots/${year}-${season}.png`);
      ctx.drawImage(imgFrame, 0, 0, initialFrame.width, initialFrame.height);
      encoder.addFrame(ctx);
    }));
  }));

  encoder.finish();
})();
