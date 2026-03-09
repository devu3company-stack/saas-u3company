import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    console.log("Iniciando Puppeteer...");
    const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: { width: 1280, height: 800 }
    });

    // Precisamos ir para o login primeiro para injetar o LocalStorage
    console.log("Acessando pagina inicial...");
    const page = await browser.newPage();
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });

    console.log("Injetando credenciais no Local Storage...");
    await page.evaluate(() => {
        localStorage.setItem('u3_user', JSON.stringify({ id: 1, email: 'ceo@u3company.com', name: 'CEO U3', role: 'ceo' }));
    });

    const routes = [
        { path: '/dashboard', name: 'dashboard.png' },
        { path: '/clientes', name: 'crm.png' },
        { path: '/fluxos', name: 'flow.png' },
        { path: '/trafego', name: 'traffic.png' }
    ];

    for (let r of routes) {
        console.log(`Carregando rota ${r.path}...`);
        await page.goto(`http://localhost:5173${r.path}`, { waitUntil: 'networkidle0' });

        // Esconde barra de rolagem para prints limpos
        await page.addStyleTag({ content: '::-webkit-scrollbar { display: none; }' });

        // Espera renderizar os gráficos e modais (ex: Recharts possui animações)
        await new Promise(res => setTimeout(res, 2000));

        const savePath = path.join(__dirname, '../public/prints', r.name);
        await page.screenshot({ path: savePath, fullPage: false });
        console.log(`Salvo >>> ${savePath}`);
    }

    console.log("Finalizando...");
    await browser.close();
    process.exit(0);
})();
