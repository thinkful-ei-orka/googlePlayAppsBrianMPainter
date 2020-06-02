const express = require('express');
const morgan = require('morgan')

const app = express();

app.use(morgan('common'));
const googlePlayApps = require('./playstore')



app.get('/playApps', (req, res) => {
    const goodSorts = ['Rating','App'];
    const { type, sort } = req.query;
    let currentResponse = [ ...googlePlayApps ];

    if (sort && !goodSorts.includes(sort)) {
        return res
            .status(400)
            .json({ error: 'Sort query must be of "rating" or "app"'});
    }

    if (sort) {
        currentResponse.sort((a, b) => {
            if ( a[sort] < b[sort] ) {
                return -1;
            } else {
                return 1;
            }
        });
    }
    res.json(currentResponse);

});

app.listen(8000,  () => {
    console.log('Server started on PORT 8000')
});