// carreguem les llibreries
const { BaseTest } = require("./BaseTest.js");
const { By, until } = require("selenium-webdriver");
const assert = require("assert");

// .env
require("dotenv").config();
console.log("dot.env: ", process.env.DB_HOST);

class MyTest extends BaseTest {
    async test() {
        const site = process.env.URL;
        await this.driver.get(site + "/admin/login/");

        // Login correcto
        await this.driver
            .findElement(By.id("id_username"))
            .sendKeys(process.env.username);
        await this.driver
            .findElement(By.id("id_password"))
            .sendKeys(process.env.password);

        await this.driver
            .findElement(By.css('input[value="Iniciar sessió"]'))
            .click();

        await this.driver.wait(until.urlContains("/admin/"), 5000);
        const siteNameElement = await this.driver.wait(
            until.elementLocated(By.css("#site-name")),
            5000
        );
        assert(
            await siteNameElement.isDisplayed(),
            "El elemento site-name no está visible"
        );
        console.log("[TEST] Login correcto");

        // Pulsar en modificar libros
        const addButton = await this.driver.wait(
            until.elementIsVisible(
            this.driver.findElement(By.css('a[href="/admin/biblio/llibre/"]'))
            ),
            5000
        );
        await addButton.click();

        // Escoger acción
        const selectElement = await this.driver.findElement(By.name('action'));
        await selectElement.click();
        const deleteOption = await this.driver.findElement(By.css('option[value="delete_selected"]'));
        await deleteOption.click();

        // Buscar fila
        const row = await this.driver.wait(
            until.elementLocated(By.xpath("//tr[contains(., 'Sergio Fernández')]")),
            5000
        );

        // Clicar checkbox
        const checkbox = await row.findElement(By.css('input[type="checkbox"]'));
        await checkbox.click();

        // Clicar confirmar acción
        const goButton = await this.driver.findElement(By.css('button[name="index"][value="0"]'));
        await goButton.click();

        // Confirmar eliminado
        const confirmButton = await this.driver.wait(
            until.elementLocated(By.css('input[type="submit"]')),
            5000
        );
        await confirmButton.click();

        console.log("[TEST] Libro eliminado");

        console.log("TEST OK");
    }
}

// executem el test

(async function test_example() {
    const test = new MyTest();
    await test.run();
    console.log("END");
})();
