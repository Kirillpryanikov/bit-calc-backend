const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/api/currencies', (req, res) => {
    res.send({
        currency: [
            {
                'name': 'USD',
                'id': 'usd'
            },
            {
                'name': 'EUR',
                'id': 'eur',
            },
            {
                'name': 'JPY',
                'id': 'jpy'
            },
            {
                'name': 'CNY',
                'id': 'cny'
            }
        ]
    });
});

app.post('/api/calculate', (req, res) => {
    console.log(req.body);

    res.send({
        reward: 510.1,
        total: 10510.1,
        inCurrency: 630.9,
        graph: [
            {
                date: new Date(),
                tc: 2.01,
                sr: 0.25
            },
            {
                date: new Date(),
                tc: 2.01,
                sr: 0.25
            },
            {
                date: new Date(),
                tc: 2.01,
                sr: 0.25
            },
            {
                date: new Date(),
                tc: 2.01,
                sr: 0.25
            }
        ]
    });
});

app.listen(8000);