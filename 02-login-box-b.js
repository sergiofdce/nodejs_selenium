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

        // Login incorrecto
        await this.driver.findElement(By.id("id_username")).sendKeys("pepe");
        await this.driver.findElement(By.id("id_password")).sendKeys("123");

        await this.driver
            .findElement(By.css("input[value='Iniciar sessió']"))
            .click();

        await this.driver.wait(
            until.elementLocated(By.className("errornote")),
            2000
        );
        console.log("[TEST] Login incorrecto");
        

        console.log("TEST OK");
    }
}

// executem el test

(async function test_example() {
    const test = new MyTest();
    await test.run();
    console.log("END");
})();
