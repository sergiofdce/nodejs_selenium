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

        // Crear la categoría principal "Películas"
        await this.driver.findElement(By.xpath("//a[@href='/admin/biblio/categoria/add/']")).click();
        await this.driver.findElement(By.name("nom")).sendKeys("Películas");
        await this.driver.findElement(By.xpath("//input[@value='Desar']")).click();

        // Crear subcategorías dentro de "Películas"
        const subcategories = ["Drama", "Thriller", "Acción"];

        for (const category of subcategories) {
            await this.driver.findElement(By.xpath("//a[@href='/admin/biblio/categoria/add/']")).click();
            await this.driver.findElement(By.name("nom")).sendKeys(category);
            await this.driver.findElement(By.xpath(`//select[@name='parent']/option[text()='Películas']`)).click();
            await this.driver.findElement(By.xpath("//input[@value='Desar']")).click();
        }

        console.log("[TEST] Cateogorias creadas");

        console.log("TEST OK");
    }
}

// executem el test

(async function test_example() {
    const test = new MyTest();
    await test.run();
    console.log("END");
})();
