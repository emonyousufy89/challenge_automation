const { test, expect } = require("@playwright/test");
const { chromium } = require("playwright");
const axios = require("axios");

test("The card game", async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto("https://deckofcardsapi.com/");

    await expect(page).toHaveTitle("Deck of Cards API");
    await page.screenshot({
      path:
        Math.floor(Math.random() * 100000) +
        "/test-results/" +
        "screenshot.png",
    });

    // Get a new deck
    const deckResponse = await axios.get(
      "https://deckofcardsapi.com/api/deck/new/"
    );
    const deckId = deckResponse.data.deck_id;

    // Shuffle the deck
    const shuffleResponse = await axios.get(
      `https://deckofcardsapi.com/api/deck/${deckId}/shuffle/?deck_count=1`
    );

    // Deal three cards to each of two players
    const drawResponse1 = await axios.get(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=3`
    );
    const drawResponse2 = await axios.get(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=3`
    );
    const player1Cards = drawResponse1.data.cards;
    const player2Cards = drawResponse2.data.cards;

    // Check whether either has blackjack
    const isPlayer1Blackjack =
      player1Cards.some((card) => card.value === "ACE") &&
      player1Cards.some((card) =>
        ["10", "JACK", "QUEEN", "KING"].includes(card.value)
      );
    const isPlayer2Blackjack =
      player2Cards.some((card) => card.value === "ACE") &&
      player2Cards.some((card) =>
        ["10", "JACK", "QUEEN", "KING"].includes(card.value)
      );

    // If either has blackjack, write out which one does
    if (isPlayer1Blackjack) {
      console.log("Player1 has blackjack!");
    }
    if (isPlayer2Blackjack) {
      console.log("Player2 has blackjack!");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browser.close();
  }
})();
