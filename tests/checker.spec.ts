import { chromium, test, expect } from "@playwright/test";
/**
1. 
2. 
3. 
a) 
b) 
c) 
d) 
 */

test("test", async ({ page }) => {
  //Navigate to https://www.gamesforthebrain.com/game/checkers/

  await page.goto("https://www.gamesforthebrain.com/game/checkers/");
  //Confirm that the site is up
  const pageTitle = await expect(page).toHaveTitle(
    "Checkers - Games for the Brain"
  );
  console.log("Page Title:", await page.title());

  await page.screenshot({
    path:
      "./test-results/" + Math.floor(Math.random() * 100000) + "screenshot.png",
  });

  // Make five legal moves as orange & Include taking a blue piece
  await page.waitForTimeout(1000);
  const buttonSelectors = [
    "//*[@name='space62']",
    "//*[@name='space51']",
    "//*[@name='space22']",
    "//*[@name='space02']",
    "//*[@name='space11']",
  ];
  const destinationSelectors = [
    "//*[@name='space73']",
    "//*[@name='space62']",
    "//*[@name='space33']",
    "//*[@name='space24']",
    "//*[@name='space33']",
  ];

  for (let i = 0; i < buttonSelectors.length; i++) {
    const button = await page.$(buttonSelectors[i]);
    const destination = await page.$(destinationSelectors[i]);

    if (button && destination) {
      await button.click();
      await page.waitForTimeout(1000);
      await destination.click();
      await page.waitForTimeout(1000);
    }
    await page.waitForTimeout(1000);
    await page.screenshot({
      path:
        "./test-results/" +
        Math.floor(Math.random() * 100000) +
        "screenshot.png",
    });
  }
  //Use “Make a move” as confirmation that you can take the next step
  const textValueAfterMove = await page.locator("#message").textContent();
  await expect(textValueAfterMove).toBe("Make a move.");
  console.log("Element Text after moves: ", textValueAfterMove);

  //Restart the game after five moves
  await page.locator("//*[contains(text(),'Restart...')]").click();

  // Confirm that the restarting had been successful
  const textValueAfterRestart = await page.locator("#message");
  await page.waitForSelector("#message");
  await expect(textValueAfterRestart).toHaveText(
    "Select an orange piece to move."
  );
  console.log(
    "Element Text after restart:",
    await textValueAfterRestart.innerText()
  );
  await page.screenshot({
    path: "./test-results/" + Date.now() + "screenshot.png",
  });
});

/**
 * to run the test the command is : npx playwright test cardapi2.spec.ts --project chromium --headed
 */
