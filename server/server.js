require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/producto', function(req, res) {
    res.json('Get producto');
});

app.post('/producto', function(req, res) {

    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            msj: 'El nombre de producto es un campo obligatorio'
        });
    } else {
        res.json({
            producto: body
        });
    }
});

app.put('/producto/:id', function(req, res) {

    let id = req.params.id;

    res.json({
        id
    });
});

app.delete('/producto', function(req, res) {
    res.json('Delete producto');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});