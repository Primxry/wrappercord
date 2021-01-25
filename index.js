const WebSocket = require("ws"),
  fetch = require("node-fetch"),
  { EventEmitter } = require("events")

module.exports = {
  /** 
   * The Client that you use for stuff idk
   */
  Client: class extends EventEmitter {
    /*
     * @param {Object} [options] The options for this instance of the Client.
     */
    constructor(options = { token: process.env.DISCORD_TOKEN }) {
      if (options.token) this.token = options.token;
      else this._tokenOnLogin = true;
      super()
    };
    async login (token) {
      if (this._tokenOnLogin && !token) throw new Error("Must specify a token. ")
      const getGatewayBot = (await (await fetch("https://discord.com/api/v6/gateway/bot", { headers: { Authentication: `Bot ${this.token || token}` } }).json()));
      console.log(getGatewayBot)
      const ws = new WebSocket(getGatewayBot.url);

      ws.on('open', () => {
        ws.send({ op: 10, d: { heartbeat_interval: 45000 } });
        setInterval(() => ws.send({ op: 11 }), 45000);
        ws.send({
  "op": 2,
  "d": {
    "token": this.token || token,
    "intents": 513,
    "properties": {
      "$os": "linux",
      "$browser": "wrappercord",
      "$device": "wrappercord"
    }
  }
})
      });

      ws.on('message', (data) => {
        console.log(data);
      });
    }
  }
}
