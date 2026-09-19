import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const out = new URL('../../review/screenshots/', import.meta.url).pathname;
await mkdir(out, { recursive: true });
const names = ['enterprise', 'composition', 'delivery', 'routing', 'verification', 'shared-platform'];
const report = { checks: [], errors: [], screenshots: [], violations: [] };
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ reducedMotion: 'reduce' });
const page = await context.newPage();
page.on('pageerror', error => report.errors.push(error.message));
const urls={site:'http://localhost:3310/enterprise',guide:'http://localhost:3311/guide/appendix/enterprise-multi-factory-delivery'};
async function overflow() {
 return page.evaluate(() => ({page:document.documentElement.scrollWidth>innerWidth+1,nodes:[...document.querySelectorAll('.fd-figure > .fd-canvas *')].filter(e=>!e.matches('.fd-stages > li')&&e.getClientRects().length&&e.scrollWidth>e.clientWidth+2&&getComputedStyle(e).display!=='inline').map(e=>({class:e.className,text:e.textContent.slice(0,70)}))}));
}
async function axe(app,width,theme) {
 await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
 report.violations.push({app,width,theme,violations:await page.evaluate(async()=> (await window.axe.run('.fd-figure',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})))});
}
try {
 for(const app of ['site','guide']) {
  for(const width of [1440,900,390]) {
   await page.setViewportSize({width,height:1000});await page.goto(urls[app],{waitUntil:'networkidle'});
   if(app==='guide') await page.evaluate(()=>{document.documentElement.dataset.theme='light';});
   await page.addStyleTag({content:'.global-header, .global-header *, .page-contents, .page-contents *, .skip-link, .guide-tools, nextjs-portal { visibility: hidden !important; }'});
   assert.equal(await page.locator('.fd-figure').count(),6);
   const dimensions=await overflow();report.checks.push({app,width,...dimensions});
   assert.equal(dimensions.page,false,`${app} ${width} page overflow`);assert.deepEqual(dimensions.nodes,[],`${app} ${width} node overflow`);
   await axe(app,width,'light');
   for(const name of names) {
    const figure=page.locator(`[data-diagram="${name}"]`);const filename=`${app}-${name}-${width}.png`;
    await figure.screenshot({path:out+filename, style: "body > header, .site-header, .global-header, .page-contents-nav, .page-contents, .guide-tools, nextjs-portal { visibility: hidden !important; }"});report.screenshots.push(filename);
    const trigger=figure.locator('.fd-heading button');await trigger.focus();await page.keyboard.press('Enter');
    const dialog=figure.locator('dialog');await dialog.waitFor({state:'visible'});
    assert.ok(await dialog.evaluate(e=>e.contains(document.activeElement)),'focus enters dialog');
    if(name==='composition' && width!==900) await dialog.screenshot({path:out+`${app}-composition-modal-${width}.png`});
    for(let i=0;i<4;i++) await page.keyboard.press('Tab');
    assert.ok(await dialog.evaluate(e=>e.contains(document.activeElement)),'focus remains modal');
    assert.equal(await dialog.evaluate(e=>e.scrollWidth>e.clientWidth+1),false,'modal overflow');
    await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});
    assert.ok(await trigger.evaluate(e=>e===document.activeElement),'focus returns');
   }
  }
  if(app==='guide') for(const width of [1440,390]) {
   await page.setViewportSize({width,height:1000});await page.evaluate(()=>{document.documentElement.dataset.theme='dark';});
   report.checks.push({app,width,theme:'dark',...await overflow()});await axe(app,width,'dark');
   for(const name of names) await page.locator(`[data-diagram="${name}"]`).screenshot({path:out+`guide-${name}-dark-${width}.png`, style: "body > header, .site-header, .global-header, .page-contents-nav, .page-contents, .guide-tools, nextjs-portal { visibility: hidden !important; }"});
  }
 }
 for(const app of ['site','guide']) {
  await page.setViewportSize({width:1440,height:1000});await page.goto(urls[app],{waitUntil:'networkidle'});
  await page.evaluate(()=>{document.documentElement.style.zoom='2';});
  const dimensions=await overflow();report.checks.push({app,zoom:'200% CSS layout zoom',...dimensions});assert.equal(dimensions.page,false);
  await page.locator('[data-diagram="composition"]').screenshot({path:out+`${app}-composition-zoom200.png`});
 }
 await page.goto('http://localhost:3311/guide/atlas',{waitUntil:'networkidle'});
 const atlasLinks=page.locator('.atlas-index a'); assert.ok(await atlasLinks.count()>0);
 for(const href of await atlasLinks.evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')))) { const id=href.split('#')[1]; assert.ok(await page.locator(`[id="${id}"]`).count(),`Atlas anchor ${id}`); }
 await atlasLinks.last().click(); assert.ok(new URL(page.url()).hash); report.checks.push({atlasNavigation:'PASS'});
 await page.goto(urls.site,{waitUntil:'networkidle'});
 for(const href of await page.locator('a[href^="#"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')))) { if(href.length>1) assert.ok(await page.locator(`[id="${decodeURIComponent(href.slice(1))}"]`).count(),`Enterprise anchor ${href}`); }
 const guideLinks=await page.locator('a[href^="/guide"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));assert.ok(guideLinks.length);
 for(const href of [...new Set(guideLinks)]) { const response=await page.request.get('http://localhost:3311'+href);assert.ok(response.ok(),`Guide destination ${href}`); }
 report.checks.push({enterpriseAnchors:'PASS',crossAppDestinations:'PASS',note:'Destination endpoints verified across local origins; production microfrontend proxy not redeployed.'});
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const staticPage=await nojs.newPage();
 await staticPage.route(/\.(png|svg|jpe?g|webp)(\?|$)/,r=>r.abort());
 for(const url of Object.values(urls)) {await staticPage.goto(url);assert.equal(await staticPage.locator('.fd-figure').count(),6);assert.match(await staticPage.locator('[data-diagram="composition"]').textContent(),/Factory Version/);}
 report.checks.push({staticRendering:'PASS',assetIndependence:'PASS'});await nojs.close();
 assert.deepEqual(report.errors,[],'No page errors');assert.equal(report.violations.flatMap(x=>x.violations).length,0,'No diagram AA violations');report.result='PASS';
} catch(error) {report.result='FAIL';report.failure=error.stack;process.exitCode=1;}
finally {await writeFile(new URL('../../review/diagram-browser.json',import.meta.url),JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify({result:report.result,failure:report.failure,checks:report.checks.length,screenshots:report.screenshots.length,violations:report.violations.flatMap(v=>v.violations).length},null,2));
