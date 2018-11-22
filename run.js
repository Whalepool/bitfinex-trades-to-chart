const BFX = require('bitfinex-api-node');
const args = process.argv
let nextMarkId = 0;


function addMark(wss, opts) {
  opts.type = 'marker_create';
  opts.id = `mark_${nextMarkId++}`;
  wss.send(
    [0, 'n', 12345, {
      type: 'ucm-ui-chart',
      info: opts
    }]);
}
function clearMarks(wss) {
  wss.send([0, 'n', 12345, { type: 'ucm-ui-chart', info: {
    type: 'marker_clear',
  } }]);
}


const bfx = new BFX({
  apiKey: '',
  apiSecret: '',

  ws: {
    autoReconnect: true,
    seqAudit: false,
  }
});

const rest = bfx.rest(2, {})
const ws = bfx.ws();

ws.on('error', (err) => {
  console.log('Error', err);
});

ws.on('open', () => {
  console.log('open');
  ws.auth();
});


ws.on('message', function (data) {
    //console.log(data);
});


ws.once('auth', () => {

    console.log('authenticated');

    // Clear any previously rendered markers 
    clearMarks(ws);

    // Get historical trades 
    const START = Date.now() - (30 * 24 * 60 * 60 * 1000 * 1000)
    const END = Date.now()
    const LIMIT = 200

    rest.accountTrades('tBTCUSD', START, END, LIMIT).then(trades => {

       let t

       for (let j = 0; j < trades.length; j += 1) {
         opts = trades[j]

         // Is amount greater than zero
         const isBuy = opts[4] > 0;
         const markColour = isBuy ? '#11FF33': '#FF1133';
         const markSize = Math.abs(opts[4]) > 15 ? 15 : Math.round(Math.abs(opts[4]) + 1);


        addMark(ws, {
          ts: opts[2],
          // Adding a 'symbol' does not work'
          // symbol: opts[1].slice(1),
          content: `Trade id ${opts[0]}`, // content to show in tooltip
          color_bg: markColour,
          size_min: markSize,
        });
       }

       console.log('Finished adding order history markers')

    }).catch(err => {
       console.log(err)
    })

});

// ws.onTradeEntry({}, (trade) => {
//   console.log('onTradeEntry')
//   console.log(trade)
// })

// ws.onTrades({}, (trades) => {
//   console.log('onTrades')
//   console.log(trades)
// })

// ws.onAccountTradeEntry({}, (trade) => {
//   console.log('onAccountTradeEntry')
//   console.log(trade)
// })

ws.onAccountTradeUpdate({}, (trade) => {
  console.log('onAccountTradeUpdate')
  console.log(trade)

  // Is amount greater than zero
  const isBuy = trade[4] > 0;
  const markColour = isBuy ? '#11FF33': '#FF1133';
  const markSize = Math.abs(trade[4]) > 15 ? 15 : Math.round(Math.abs(trade[4]) + 1);

  console.log('adding marker... ')

  addMark(ws, {
    ts: trade[2],
    // Adding a 'symbol' does not work'
    // symbol: opts[1].slice(1),
    content: `Trade id ${trade[0]}`, // content to show in tooltip
    color_bg: markColour,
    size_min: markSize,
  });

})



ws.open();
