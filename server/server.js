const express = require('express');

const port = 8080;

const app = express();


app.get('/', (req, res) => {

});

app.post('/', (req, res) => {
    const sessionID = req.sessionID;
    res.status(200).send(sessionID);
})


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

module.exports = { app };

