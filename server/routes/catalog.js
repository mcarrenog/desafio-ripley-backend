const express = require('express');
const Product = require('../models/product');
const _ = require('underscore');





const app = express();
const cors = require('cors');




app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use(cors());
app.options('*', cors());

//Get Method (Get Products by ID or marca or descripcion)
app.get('/products', function (req, res) {


    let search = req.query.search;
    let idX = Number(search);
    let applyDiscount = false;
    let isNumeric = false;

    console.log('buscando: ', search);

    if (idX) {

        isNumeric = true;
    } else {
        isNumeric = false;

        applyDiscount = isPalindrome(search);

    }

    if (isNumeric) {
        Product.search({
            "query_string": {
                "fields": ["id"],
                "query": search,
                "fuzziness": "AUTO"
            }
        }, {

            hydrateOptions: { select: ' id nombre marca descripcion imagen precio' }
        },
            function (err, results) {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }


                res.json({
                    status: true,
                    results: results.hits.hits.map(x => x._source)
                });

            });
    }
    else {



        Product.search({
            "multi_match": {
                "fields": ["marca", "descripcion"],
                "query": search,
                "fuzziness": "AUTO"
            }
        }, {

            hydrateOptions: { select: 'id nombre marca descripcion imagen precio' }
        },
            function (err, results) {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                results.hits.hits.forEach((element,) => {



                    if (applyDiscount) {


                        let { _source } = element;

                        let { precio: price } = _source;
                        console.log();
                        price = (price) - (price * 0.2);
                        _source.precioDescuento = price;

                        //   results.hits.hits[i].precioDescuento = price;


                    }
                });

                res.json({
                    status: true,
                    results: results.hits.hits.map(x => x._source)
                });

            });
    }
});

app.get('/getAllProducts', function (req, res) {



    Product.find({})

        .exec((err, products) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }



            res.json({
                status: true,
                products
            });




        });


});


//Post Method (Insert Product)
app.post('/products', function (req, res) {

    let body = req.body;

    console.log('body', body.id);

    let product = new Product({
        id: body.id,
        marca: body.marca,
        imagen: body.imagen,
        nombre: body.nombre,
        descripcion: body.descripcion,
        precio: body.precio
    });

    console.log(product);

    product.save((err, productDB) => {

        if (err) {
            return res.status(400).json({
                status: false,
                err
            });
        }

        product.on('es-indexed', (err, resultado) => {
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


});

app.put('/products/:id', function (req, res) {

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

app.delete('/products/:id', function (req, res) {

    let id = req.params.id;

    let cursor = Product.find({ id: id }, (err, productDeleted) => {
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


        cursor.on('data', function (doc) {
            doc.remove();
        })

        res.json({
            status: true,
            product: productDeleted
        });
    }).cursor();




});

function isPalindrome(text) {
    text = text.replace(/ /g, "");

    for (var i = 0; i < text.length; i++) {
        if (text[i] != text[text.length - i - 1]) {
            return false;
        }
    }
    return true;
}

module.exports = app;