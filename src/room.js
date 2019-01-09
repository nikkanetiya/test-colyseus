import { Room } from 'colyseus'

const RECONNET_TIME = 5

export class Player {
  constructor(_id) {
    this.id = _id
    this.is_active = true
  }
}

export class DefaultRoom extends Room {
  constructor() {
    super()

    this.maxClients = 2
  }

  onInit() {
    this.setState({
      players: [],
      clock: 0
    })
  }

  onAuth() {
    console.log('onAuth')

    return true
  }

  onJoin() {
    console.log('onJoin')

    this.addPlayer()
    this.checkGameState()

    return true
  }

  async onLeave (client) {
    // flag client as inactive for other users
    // this.state.inactivateClient(client);
  
    try {
      // allow disconnected client to rejoin into this room until 20 seconds
      await this.allowReconnection(client, RECONNET_TIME);
    } catch (e) {
      //
    }
  }

  addPlayer() {
    this.state.players.push(new Player(this.state.players.length + 1))
  }

  checkGameState() {
    if(this.maxClients === this.state.players.length) {
      this.startGame()
    }
  }

  stateChange() {
    this.state.clock++

    // Test purpose
    if(this.clock === 100) {
      this.disconnect()
    } else {
      this.clock.setTimeout(
        this.stateChange.bind(this),
        3000
      )
    }
  }

  startGame() {
    this.lock()
    // this.stateChange()
  }
}