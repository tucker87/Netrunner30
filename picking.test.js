const assert = require('assert')
import utils from './utils.js'

const testRepo = {
  history() {
    return [
      {
        "corp": [
          { "player": 1, "deck": 1 },
          { "player": 2, "deck": 2 },
          { "player": 3, "deck": 3 }
        ],
        "runner": [
          { "player": 1, "deck": 1 },
          { "player": 2, "deck": 2 },
          { "player": 3, "deck": 3 },
        ]
      },
      {
        "corp": [
          { "player": 1, "deck": 2 },
          { "player": 2, "deck": 3 },
          { "player": 3, "deck": 2 }
        ],
        "runner": [
          { "player": 1, "deck": 2 },
          { "player": 2, "deck": 3 },
          { "player": 3, "deck": 1 },
        ]
      }
    ]
  },
  decks() {
    return {
      "corp": [
        { "id": 1, "name": "Uno" },
        { "id": 2, "name": "Dos" },
        { "id": 3, "name": "Tracer" },
      ],
      "runner": [
        { "id": 1, "name": "One" },
        { "id": 2, "name": "Two" },
        { "id": 3, "name": "Three" }
      ]
    }
  },
  players() {
    return [
      { "id": 1, "name": "Noah (NoahTheDuke)" },
      { "id": 2, "name": "Hilary (BlooMuse)" },
      { "id": 3, "name": "Jon (Janktivist)" }
    ]
  }
}

it('should not assign someone a deck they have already used', () => {

  const newRound = { corp: [], runner: [] }
  var pickDeck = utils.buildPickDeck(testRepo.history(), newRound, testRepo.decks(), testRepo.players())

  for (var i = 0; i < 100; i++) {
    var pick = pickDeck(1, "corp")
    assert.equal(pick.deck.id, 3)
  }
})