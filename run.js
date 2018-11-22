const BFX = require('bitfinex-api-node');
let nextMarkId = 0;

/**
 * Add a mark to the chart
 * @param wss
 * @param opts
 */
function addMark(wss, opts) {
  opts.type = 'marker_create';
  opts.id = `mark_${nextMarkId++}`;
  wss.send(
    [0, 'n', 12345, {
      type: 'ucm-ui-chart',
      info: opts
    }]);
}

/**
 * Remove all marks from the charts
 * @param wss
 */
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
    clearMarks(ws);
});


ws.onOrderUpdate({}, (opts) => {
    console.log('update to order order', opts);

    // Make the marks size proportional to the order size
    const orderSize = Math.abs(opts[6]);
    const isBuy = opts[6] > 0;
    const markSize = orderSize > 15 ? 15 : Math.round(orderSize + 2);
    const markColour = isBuy ? '#11FF33': '#FF1133';

    addMark(ws, {
        ts: opts[5],
        //symbol: opts[3],
        content: `Order id ${opts[0]}`, // content to show in tooltip
        color_bg: markColour,
        size_min: markSize,
    });
});

// start the socket
ws.open();
