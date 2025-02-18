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

        // Login correcto
        await this.driver.wait(until.urlContains("/admin/"), 5000);

        await this.driver.wait(
            until.elementLocated(By.css("#site-name")),
            5000
        );
        console.log("[TEST] Login correcto");
        console.log("TEST OK");
    }
}

// executem el test

(async function test_example() {
    const test = new MyTest();
    await test.run();
    console.log("END");
})();
