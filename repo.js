const fs = require('fs')

const decks = () => JSON.parse(fs.readFileSync('./decks.json'))
const players = () => JSON.parse(fs.readFileSync('./players.json'))
const history = () => JSON.parse(fs.readFileSync('./history.json'))

const buildComplicate = (players, decks) => e => ({
    player: players.filter(p => p.id === e.player)[0],
    deck: decks.filter(d => d.id === e.deck)[0]
})

const fullHistory = (history, decks, players) => {
    const complicateCorp = buildComplicate(players, decks.corp)
    const complicateRunner = buildComplicate(players, decks.runner)

    return history.map(r => ({
        runner: r.runner.map(complicateCorp),
        corp: r.corp.map(complicateRunner)
    }))
}

export default {
    decks,
    players,
    history,
    fullHistory
}