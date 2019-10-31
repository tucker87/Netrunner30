const fs = require('fs')
const _ = require('lodash')

const decks = JSON.parse(fs.readFileSync('./decks.json'))
const players = JSON.parse(fs.readFileSync('./players.json'))
const history = JSON.parse(fs.readFileSync('./history.json'))


const getRandomInt = max => Math.floor(Math.random() * Math.floor(max))
const getPlayerHistory = (playerId, side) =>
    _(history)
        .flatten()
        .flatMap(h => h[side])
        .filter(h => h.player === playerId)
        .flatMap(h => h.deck)

const isUnique = (newDeckId, playerDecks, round) => {
    const usedByPlayer = _.some(playerDecks, pd => pd === newDeckId)
    const usedInRound = _.some(round, r => r.deck === newDeckId)

    return !usedByPlayer && !usedInRound
}

const pickDeck = (playerId, side) => {
    const priorDecks = getPlayerHistory(playerId, side)
    let newDeckId = -1
    do {
        newDeckId = getRandomInt(14) + 1
    } while(!isUnique(newDeckId, priorDecks, newRound[side]))

    const player = players.filter(p => p.id === playerId)[0]
    const deck = decks[side][newDeckId]
    return {player, deck}
}

const writeList = arr => arr.map(c => c.deck.name).forEach(l => console.log(l))

const simplify = data => data.map(e => ({player: e.player.id, deck: e.deck.id }))

const newRound = {corp: [], runner: []}

players.forEach(p => {
    newRound.corp.push(pickDeck(p.id, "corp"))
    newRound.runner.push(pickDeck(p.id, "runner"))
})

console.log("\nCorps")
writeList(newRound.corp)
console.log("\nRunners")
writeList(newRound.runner)

const newRoundSimple = {
    corp: simplify(newRound.corp),
    runner: simplify(newRound.runner)
}

history.push(newRoundSimple)

fs.writeFileSync('./history.json', JSON.stringify(history))