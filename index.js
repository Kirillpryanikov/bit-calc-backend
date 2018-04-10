const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());


const calculateChance = (coin, stakes, day_reward = 1350) => {
    return coin / stakes * day_reward;
}

app.get('/api/currencies', (req, res) => {
    res.send({
        currency: [
            {
                'name': 'USD',
                'id': 'usd',
                'isCompulsory': true
            },
            {
                'name': 'EUR',
                'id': 'eur',
                'isCompulsory': true
            },
            {
                'name': 'JPY',
                'id': 'jpy',
                'isCompulsory': false
            },
            {
                'name': 'CNY',
                'id': 'cny',
                'isCompulsory': false
            }
        ]
    });
});

app.post('/api/calculate', async (req, res) => {
    let total_coins = req.body.coins;
    let start_coins = req.body.coins;

    const bay_info_response = await axios.get('https://chainz.cryptoid.info/explorer/index.data.dws?coin=bay&n=10');
    const block_id = bay_info_response.data.blocks[0].out;
    const stakes_info_response = await axios.get(`https://chainz.cryptoid.info/explorer/index.stakes.dws?coin=bay&${block_id}.js`);
    const stakes_amount = stakes_info_response.data.stakes.reduce((summ, curr) => summ + curr.amount, 0);
    
    let percent = calculateChance(total_coins, stakes_amount);
    const graph = [];
    
    let date = new Date(); let prevDate;
    date.setHours(0); date.setMinutes(0); 
    date.setSeconds(0); date.setMilliseconds(0);
    
    for (let i = 0; i < req.body.period; i++) {
        prevDate = new Date(date);
        date.setMonth(date.getMonth() + 1);
        let diff = parseInt((date - prevDate) / (1000 * 60 * 60 * 24));   

        total_coins = total_coins + diff * percent;
        percent = calculateChance(total_coins, stakes_amount);

        graph.push({
            date: date,
            tc: total_coins,
            sr: percent
        });
    }

    res.send({
        reward: total_coins - start_coins,
        total: total_coins,
        inCurrency: 0,
        graph: graph
    });
});

app.listen(8000);