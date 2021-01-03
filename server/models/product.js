const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongoosastic = require('mongoosastic');

let Schema = mongoose.Schema;

let productSchema = new Schema({

    id: {
        unique: true,
        type: Number,
        required: [true, 'El campo id es obligatorio']
    },
    marca: {
        type: String,
        required: [true, 'El campo Marca es obligatorio'],
        es_indexed: true
    },
    imagen: {
        type: String,
        required: false
    },
    nombre: {
        type: String,
        required: [true, 'El campo Nombre es obligatorio']

    },
    descripcion: {
        type: String,
        required: [true, 'El campo Descripcion es obligatorio'],
        es_indexed: true
    },
    precio: {
        type: Number,
        required: [true, 'El campo Precio es obligatorio']
    }

});

productSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser único'
});

productSchema.plugin(mongoosastic);

module.exports = mongoose.model('Product', productSchema);