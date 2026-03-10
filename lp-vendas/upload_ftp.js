import * as ftp from "basic-ftp";

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        console.log("Conectando ao FTP...");
        await client.access({
            host: "82.25.73.154",
            user: "u238765253.u3company.com",
            password: "U3COMPANY@a",
            port: 21,
            secure: false
        });

        console.log("Conectado com sucesso!");

        let path = "/public_html";

        console.log("Subindo arquivos para a pasta:", path);
        await client.ensureDir(path);
        // await client.clearWorkingDir(); // Removido para não apagar outros sites
        await client.uploadFromDir("dist");

        console.log("Deploy finalizado! A pagina de vendas ja deve estar no ar!");
    }
    catch (err) {
        console.log("Erro durante o upload FTP:", err);
    }
    client.close();
}

deploy();
