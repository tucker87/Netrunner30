import repo from './repo.js'
import utils from './utils.js'

const help = () => {
    console.log(
        `Please enter a command:
          read [number] | Read round
          create        | Create new round`)
}

const read = (repo, utils) => {
    const history = repo.history()
    const decks = repo.decks()
    const players = repo.players()

    const fullHistory = repo.fullHistory(history, decks, players);

    if (process.argv[3] !== undefined) {
        const roundNumber = process.argv[3]
        if (fullHistory.length < roundNumber) {
            console.log("Round not found")
            return
        }
        utils.writeRound(fullHistory[roundNumber - 1])
    }
    else {
        fullHistory.forEach((fh, i) => {
            console.log(`\n\nRound ${i + 1}`)
            utils.writeFullRound(fh)
        })
    }
}

const create = (repo, utils) => {
    utils.createNewRound(repo)
}

const command = process.argv[2]

switch(command)
{
    case "read": read(repo, utils)(); break;
    case "create": create(repo, utils); break;
    default: help();
}