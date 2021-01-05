// ========================================
// Port
// ========================================
process.env.PORT = process.env.PORT || 3000;

// ========================================
// Enviroment
// ========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ========================================
// DataBase
// ========================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/catalogo';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URL_DB = urlDB;

// ========================================
// ElasticSearch
// ========================================
process.env.URL_ELASTIC = process.env.URL_ELASTIC || 'localhost:9200';
