const fs = require('fs')
const _ = require('lodash')

const getRandomInt = max => Math.floor(Math.random() * Math.floor(max))
const getPlayerHistory = (history, playerId, side) =>
    _(history)
        .flatten()
        .flatMap(h => h[side])
        .filter(h => h.player === playerId)
        .flatMap(h => h.deck)
        .value()

const isUnique = (newDeckId, playerDecks, round) => {
    const usedByPlayer = _.some(playerDecks, pd => pd === newDeckId)
    const usedInRound = _.some(round, r => r.deck.id === newDeckId)
    console.log(round)
    console.log(newDeckId)

    return !usedByPlayer && !usedInRound
}

const buildPickDeck = (history, newRound, decks, players) => (playerId, side) => {
    const priorDecks = getPlayerHistory(history, playerId, side)
    let newDeckId = -1
    do {
        newDeckId = getRandomInt(decks[side].length) + 1
    } while(!isUnique(newDeckId, priorDecks, newRound[side]))

    const player = players.filter(p => p.id === playerId)[0]
    const deck = _.find(decks[side], d => d.id === newDeckId)
    return {player, deck}
}

const writeList = arr => arr.map(c => c.deck.name).forEach(l => console.log(l))
const writeFullList = arr => {
    const list = arr.map(c => ({ player: c.player.name, deck: c.deck.name}))
    console.table(list)
}
const simplify = data => data.map(e => ({player: e.player.id, deck: e.deck.id }))

const writeRound = round => {
    console.log("\nCorps")
    writeList(round.corp)
    console.log("\nRunners")
    writeList(round.runner)
}

const writeFullRound = round => {
    console.log("\nCorps")
    writeFullList(round.corp)
    console.log("\nRunners")
    writeFullList(round.runner)
}

const createNewRound = repo => 
{
    const decks = repo.decks();
    const players = repo.players();
    const history = repo.history();

    const newRound = {corp: [], runner: []}

    const pickDeck = buildPickDeck(history, newRound, decks, players)

    players.forEach(p => {
        newRound.corp.push(pickDeck(p.id, "corp"))
        newRound.runner.push(pickDeck(p.id, "runner"))
    })

    writeRound(newRound)

    const newRoundSimple = {
        corp: simplify(newRound.corp),
        runner: simplify(newRound.runner)
    }

    history.push(newRoundSimple)

    fs.writeFileSync('./history.json', JSON.stringify(history))
}

export default {
    createNewRound,
    writeRound,
    writeFullRound,
    buildPickDeck
}