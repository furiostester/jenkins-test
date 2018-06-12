require("dotenv").config();
const puppeteer = require("puppeteer");
const LANG = require("../js-files/lang");
const MISC = require("../js-files/misc");

const lang = LANG.deLang;
const article = LANG.deArticle;

//Timeout hoeher setzen, da sonst die Tests zu frueh beendet werden.
jest.setTimeout(100000);

/**
 * Erzeugen einer Verzoegerung, um sicher zu gehen, dass Elemente vollstaendig geladen werden.
 * @param time
 * @returns {Promise<any>}
 */
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

/**
 * Test for Single Language.
 * 0.) Artikel laden
 * 1.) Bookmarklet laden
 * 2.) Bookmarklet login - Ranking Bubbles.
 * 3.) Bookmarklet login - Rubrik Bookmarklet.
 * 4.) Bookmarklet login - Artikel Bookmarklet.
 */
describe('Test Single Language', () => {
    var browser, page;

    beforeEach(async () => {
        browser = await puppeteer.launch({headless: true/*, slowMo: 250*/});
        page = await browser.newPage();
    });

    //Nach jedem Test den Browser beenden.
    afterEach(() => {
        browser.close()
    });

    /**
     * Test zum Laden eines Artikels.
     * Es wird hier geprueft, ob das Element artikel vorhanden ist.
     */
    /*test('Artikel wurde geladen', async () => {
        await page.goto(MISC.dw);
        await page.waitForSelector(MISC.langTrigger);
        await page.click(MISC.langTrigger);
        await delay(3000);
        await page.click(lang);
        await page.waitForSelector(article);
        await page.click(article);
        await page.waitForSelector(".artikel", MISC.timeout);
        const bodyMover = await page.$$eval(".artikel", el => (!!el));
        expect(bodyMover).toBe(true);
    });*/

    /**
     * Test zum Laden des Bookmarklets.
     * Es wird geprueft, ob das Element popup nach dem Laden der JavaScript Dateien vorhanden ist.
     */
    test('Bookmarklet laden', async () => {
        await page.goto(MISC.dw, MISC.networkidle2);
        await page.waitForSelector(MISC.langTrigger);
        await page.click(MISC.langTrigger);
        await delay(3000);
        await page.click(lang);
        await page.waitForSelector("#bodyMover", MISC.timeout);
        //await page.addScriptTag({url: MISC.jquery, fullPage: true});
        await page.addScriptTag({path: MISC.jqueryLocal});
        //JQuery braucht hier komischerweise ein wenig Zeit, bis es injected wurde.
        await delay(1000);
        await page.addScriptTag({path: MISC.bookmarklet});
        await delay(1000);
        await page.addScriptTag({path: MISC.bookmarkletMain});
        await delay(1000);
        await page.addScriptTag({path: MISC.bookmarkletInvoke});
        await delay(1000);
        await page.waitForSelector("#popup", MISC.networkidle2, MISC.timeout);
        const popup = await page.$$eval("popup", el => (!!el));
        expect(popup).toBe(true);
    });

    /**
     * Test zum Einloggen in das Bookmarklet - Artikel Ranking (Rubrik).
     * Es wird geprueft, ob das Element bubbleText vorhanden ist.
     */
    test('Bookmarklet einloggen - Ranking Bubbles (Rubrik)', async () => {
        await page.goto(MISC.dw, MISC.networkidle2);
        await page.waitForSelector(MISC.langTrigger);
        await page.click(MISC.langTrigger);
        await delay(3000);
        await page.click(lang);
        await page.waitForSelector("#bodyMover");
        //await page.addScriptTag({url: MISC.jquery, fullPage: true});
        await page.addScriptTag({path: MISC.jqueryLocal});
        //JQuery braucht hier komischerweise ein wenig Zeit, bis es injected wurde.
        await delay(1000);
        await page.addScriptTag({path: MISC.bookmarklet});
        await delay(1000);
        await page.addScriptTag({path: MISC.bookmarkletMain});
        await delay(1000);
        await page.addScriptTag({path: MISC.bookmarkletInvoke});
        await delay(1000);
        await page.waitForSelector("input#username", MISC.networkidle2);
        await page.waitForSelector("input#password", MISC.timeout);
        await page.type("input#username", process.env.username);
        await page.type("input#password", process.env.password);
        await page.click("#submitbutton");
        await delay(3000);
        await page.waitForSelector(".bubbleText", MISC.timeout, MISC.networkidle2);
        const tableSplit = await page.$$eval(".bubbleText", el => (!!el));
        expect(tableSplit).toBe(true);
    });

    /**
     * Test zum Einloggen in das Bookmarklet.
     * Es wird geprueft, ob das Element table#rankTable vorhanden ist.
     */
    test('Bookmarklet einloggen - Rubrik Bookmarklet', async () => {
        await page.goto(MISC.dw, MISC.networkidle2);
        await page.waitForSelector(MISC.langTrigger);
        await page.click(MISC.langTrigger);
        await delay(3000);
        await page.click(lang);
        await page.waitForSelector("#bodyMover");
        //await page.addScriptTag({url: MISC.jquery, fullPage: true});
        await page.addScriptTag({path: MISC.jqueryLocal});
        //JQuery braucht hier komischerweise ein wenig Zeit, bis es injected wurde.
        await delay(1000);
        await page.addScriptTag({path: MISC.bookmarklet});
        await delay(1000);
        await page.addScriptTag({path: MISC.bookmarkletMain});
        await delay(1000);
        await page.addScriptTag({path: MISC.bookmarkletInvoke});
        await delay(1000);
        await page.waitForSelector("input#username", MISC.networkidle2);
        await page.waitForSelector("input#password", MISC.timeout);
        await page.type("input#username", process.env.username);
        await page.type("input#password", process.env.password);
        await page.click("#submitbutton");
        await delay(3000);
        await page.waitForSelector("table#rankTable", MISC.timeout, MISC.networkidle2);
        const tableSplit = await page.$$eval("table#rankTable", el => (!!el));
        expect(tableSplit).toBe(true);
    });

    /**
     * Test zum Einloggen in das Bookmarklet.
     * Es wird geprueft, ob das Element table#split vorhanden ist.
     */
    test('Bookmarklet einloggen - Artikel Bookmarklet', async () => {
        await page.goto(MISC.dw, MISC.networkidle2);
        await page.waitForSelector(MISC.langTrigger);
        await page.click(MISC.langTrigger);
        await delay(3000);
        await page.click(lang);
        await page.waitForSelector(article);
        await page.click(article);
        await page.waitForSelector(".artikel", MISC.timeout);
        //await page.addScriptTag({url: MISC.jquery, fullPage: true});
        await page.addScriptTag({path: MISC.jqueryLocal});
        //JQuery braucht hier komischerweise ein wenig Zeit, bis es injected wurde.
        await delay(1000);
        await page.addScriptTag({path: MISC.bookmarklet});
        await delay(1000);
        await page.addScriptTag({path: MISC.bookmarkletMain});
        await delay(1000);
        await page.addScriptTag({path: MISC.bookmarkletInvoke});
        await delay(1000);
        await page.waitForSelector("input#username", MISC.networkidle2);
        await page.waitForSelector("input#password", MISC.timeout);
        await page.type("input#username", process.env.username);
        await page.type("input#password", process.env.password);
        await page.click("#submitbutton");
        //Das Bookmarklet braucht ebenfalls ein wenig Zeit bis es geladen wurde.
        await delay(3000);
        await page.waitForSelector("table#split", MISC.timeout, MISC.networkidle2);
        const tableSplit = await page.$$eval("table#split", el => (!!el));
        expect(tableSplit).toBe(true);
    });
});