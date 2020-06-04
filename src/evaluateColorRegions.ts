import { Page } from 'puppeteer';
export default async function evaluateColorRegions(page: Page) : Promise<void> {
  return await page.evaluate(() => {
    const countryMapping = {
      Con: "rect[x='424']",
      Nap: "rect[x='278']",
      Tri: "rect[x='290']",
      Bel: "circle[cx='186']",
      Mar: "rect[y='412']",
      Kie: "rect[x='254']",
      Gre: "circle[cx='378']",
      Hol: "circle[cx='205']",
      Swe: "circle[cx='323']",
      Ank: "rect[x='482']",
      Bud: "rect[x='326']",
      Ven: "rect[x='263']",
      Stp: "rect[x='418']",
      Den: "circle[cx='272']",
      Par: "rect[x='177']",
      Mun: "rect[x='258']",
      Ser: "circle[cx='343']",
      Ber: "rect[x='281']",
      Smy: "rect[x='424'][y='502']",
      Lon: "rect[x='156']",
      Rum: "circle[cx='402']",
      Sev: "rect[x='479']",
      Edi: "rect[x='154']",
      Spa: "circle[cx='80']",
      Bul: "circle[cx='377']",
      War: "rect[x='343']",
      Vie: "rect[x='298']",
      Rom: "rect[x='268']",
      Tun: "circle[cx='220']",
      Mos: "rect[x='481']",
      Bre: "rect[x='106']",
      Lvp: "rect[x='142']",
      Por: "circle[cx='15']",
      Nwy: "circle[cx='270']"
    }

    Object.keys(countryMapping).forEach(cc => {
      const countryIdentifier = countryMapping[cc];
      const color: string = document.querySelector(countryIdentifier).getAttribute('fill');
      document.querySelector(`#ter_${cc}`).setAttribute('fill', color);
      document.querySelector(`#ter_${cc}`).setAttribute('style', 'fill-opacity: 0.3;');
    });
  });
}
