const express = require('express');
const app = express();
const port = 8000;
const conf = require('./config.json');
const input = require('./input.json');

app.get('/', (req, res) => {
	res.send('Hello world!');
});

app.listen(port, () => {
	// SETUP AN ARRAY TO HOLD THE FINAL LIST OF WINNING BIDS
	const finalList = [];
	// LOOP OVER EACH AUCTION / SITE IN THE INPUT
	for (const item in input) {
		// LOOP OVER EACH UNIT BEING BID ON
		input[item].units.forEach((unit) => {
			// GRAB THE CONFIG INFO FOR THE CURRENT SITE
			const site = conf.sites.find(
				(site) => site.name === input[item].site
			);
			// CHECK IF SITE EXISTS
			if (site) {
				// FILTER DOWN THE LIST OF BIDS FOR ONLY THE CURRENT ITEM
				const current = input[item].bids.filter(
					(bid) => bid.unit === unit
				);
				// OBJECT TO HOLD THE CURRENT WINNING BID
				let winningBid = {};
				// VARIABLE TO HOLD THE CURRENT BEST BID AMOUNT FACTORING IN ADJUSTMENT
				let bestBidAmount = 0;
				// LOOP OVER THE BIDS FOR THE CURRENT ITEM
				current.forEach((curr) => {
					const bidderInfo = conf.bidders.find(
						(x) => x.name === curr.bidder
					);
					// CHECK IF BIDDER EXISTS
					if (bidderInfo) {
						const currBid =
							curr.bid * bidderInfo.adjustment + curr.bid;
						// SET THE CURRENT BID IF IT IS THE HIGEST
						if (currBid >= site.floor && currBid > bestBidAmount) {
							bestBidAmount = currBid;
							winningBid = curr;
						}
					}
				});
				// PUSH THE WINNING BID FOR THE ITEM INTO THE FINAL LIST
				finalList.push(winningBid);
			}
		});
	}
	console.log(finalList);
});
