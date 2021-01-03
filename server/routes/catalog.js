const express = require('express');
const Product = require('../models/product');
const _ = require('underscore');

const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

const app = express();




//Get Method (Get all Products)
app.get('/product', function(req, res) {

    let from = req.query.from || 0;
    let limit = req.query.limit || 5;

    from = Number(from);
    limit = Number(limit);

    Product.search({
        query_string: {
            query: "Play"
        }
    }, function(err, results) {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            status: true,
            results
        });

    });

    /*Product.find({}, ' id nombre descripcion marca precio imagen')
        .limit(limit)
        .skip(from)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Product.countDocuments({}, (err, count) => {

                res.json({
                    status: true,
                    products,
                    count
                })
            })

        });
        */

});

//Get Method (Get all Products)
app.get('/findProducts', function(req, res) {

    let from = req.query.from || 0;
    let limit = req.query.limit || 5;
    let keyword = req.query.keyword || '';

    from = Number(from);
    limit = Number(limit);

    Product.find({}, ' id nombre descripcion marca precio imagen')
        .limit(limit)
        .skip(from)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Product.countDocuments({}, (err, count) => {

                res.json({
                    status: true,
                    products,
                    count
                });
            });

        });
});

//Post Method (Update Product)
app.post('/product', function(req, res) {

    let body = req.body;

    let product = new Product({
        id: body.id,
        marca: body.marca,
        //imagen: body.imagen,
        nombre: body.nombre,
        descripcion: body.descripcion,
        precio: body.precio
    });

    product.save((err, productDB) => {

        if (err) {
            return res.status(400).json({
                status: false,
                err
            });
        }

        res.json({
            status: true,
            product: productDB
        });

    });


});

app.put('/product/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['marca', 'imagen', 'nombre', 'descripcion', 'precio']);



    Product.findOneAndUpdate({ id: id }, body, { new: true, runValidators: true }, (err, productDB) => {

        if (err) {
            return res.status(400).json({
                status: false,
                err
            });
        }


        res.json({
            status: true,
            productDB
        });

    });


});

app.delete('/product/:id', function(req, res) {

    let id = req.params.id;

    Product.findOneAndDelete({ id: id }, (err, productDeleted) => {
        if (err) {
            return res.status(400).json({
                status: false,
                err
            });
        }

        if (!productDeleted) {
            return res.status(400).json({
                status: false,
                err: {
                    message: 'Producto no encontrado!'
                }
            });
        }
        res.json({
            status: true,
            product: productDeleted
        });
    });


});

module.exports = app;