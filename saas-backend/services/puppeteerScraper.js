const puppeteer = require('puppeteer');

/**
 * Infer WhatsApp link from a phone number
 */
function createWhatsAppLink(phoneNumber) {
    if (!phoneNumber) return '';
    const digits = phoneNumber.replace(/\D/g, '');

    if (digits.length === 12 || digits.length === 13) {
        if (digits.startsWith('55')) return `https://wa.me/${digits}`;
    }

    if (digits.length === 10 || digits.length === 11) {
        return `https://wa.me/55${digits}`;
    }

    return '';
}

/**
 * Delay function
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Search Leads using Puppeteer (Free Google Maps Scraping)
 */
async function searchLeads({ niche, city, state, limit = 20, extraKeywords = '' }) {
    console.log(`Starting headless browser for searching ${niche}...`);
    const browser = await puppeteer.launch({
        headless: 'new', // or true
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set a normal user agent to avoid blocking
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');

    const query = `${niche} ${extraKeywords} in ${city} ${state}`.trim();
    const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;

    console.log(`Navigating to: ${url}`);

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        let leads = [];
        let itemsExtracted = new Set();

        // The main container for search results in Google Maps
        // Usually, the items are under a role="feed"
        console.log('Waiting for results to load...');
        await page.waitForSelector('div[role="feed"]', { timeout: 15000 });

        console.log('Scrolling down to extract leads...');

        console.log('Scrolling down and extracting detailed leads...');

        const maxScrolls = 15;
        let scrolls = 0;

        // Function to scroll the container
        const scrollContainer = async () => {
            await page.evaluate(() => {
                const feed = document.querySelector('div[role="feed"]');
                if (feed) feed.scrollTo(0, feed.scrollHeight);
            });
            await delay(2000);
        };

        // Scroll a bit to load elements
        while (scrolls < maxScrolls) {
            const elements = await page.$$('a.hfpxzc');
            if (elements.length >= limit) break;
            await scrollContainer();
            scrolls++;
        }

        const elements = await page.$$('a.hfpxzc');

        for (let i = 0; i < elements.length && leads.length < limit; i++) {
            const el = elements[i];

            // Skip ads
            const isAd = await page.evaluate(el => {
                let parent = el.parentElement;
                for (let j = 0; j < 6; j++) {
                    if (parent) {
                        const textCtx = parent.innerText || '';
                        if (textCtx.includes('Patrocinado') || textCtx.includes('Sponsored') || textCtx.includes('Ad')) {
                            return true;
                        }
                        parent = parent.parentElement;
                    }
                }
                return false;
            }, el);

            if (isAd) continue;

            try {
                // Click the card
                await el.evaluate(b => b.click());
                await delay(2000); // wait for panel to slide in

                // Extract detailed data
                const details = await page.evaluate(() => {
                    // The h1 tag usually contains the title
                    const titleEl = document.querySelector('h1.DUwDvf');
                    const title = titleEl ? titleEl.innerText : 'Sem Nome';

                    // Address
                    const addressBtn = document.querySelector('button[data-tooltip="Copiar endereço"], button[data-item-id="address"]');
                    const address = addressBtn ? addressBtn.innerText : '';

                    // Phone
                    const phoneBtn = document.querySelector('button[data-tooltip="Copiar número de telefone"], button[data-item-id^="phone:tel:"]');
                    const phone = phoneBtn ? phoneBtn.innerText : '';

                    const websiteBtn = document.querySelector('a[data-tooltip="Abrir website"], a[data-item-id="authority"]');
                    const website = websiteBtn ? websiteBtn.href : '';

                    return { title, address, phone, website };
                });

                const url = await el.evaluate(b => b.href);

                leads.push({
                    id: Date.now() + i,
                    niche: niche,
                    nome: details.title,
                    telefone: details.phone,
                    whatsapp_link: createWhatsAppLink(details.phone) || details.phone,
                    cidade: city,
                    estado: state,
                    endereco: details.address || 'Local listado no mapa',
                    site: details.website,
                    maps_url: url
                });

                console.log(`Extracted: ${details.title} - ${details.phone}`);

            } catch (e) {
                console.log('Error extracting individual card', e);
            }
        }

        console.log(`Extracted ${leads.length} leads.`);
        await browser.close();

        // Clean up the name string (Extract "Name" from "Name · Rating · Reviews...")
        leads = leads.map(lead => {
            const parts = lead.nome.split('·');
            lead.nome = parts[0]?.trim() || lead.nome;
            if (parts[1] && parts[1].includes('(')) {
                // Rating might be in part 1
                const ratingMatch = parts[1].match(/([0-9,.]+)\s*\(([\d.,]+)\)/);
                if (ratingMatch) {
                    lead.rating = ratingMatch[1];
                    lead.reviews = ratingMatch[2];
                }
            }
            return lead;
        });

        return leads;

    } catch (error) {
        console.error('Error during scraping:', error.message);
        await browser.close().catch(() => false);
        throw error;
    }
}

module.exports = { searchLeads };
