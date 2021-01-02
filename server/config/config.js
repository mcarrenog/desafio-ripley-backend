// ========================================
// Port
// ========================================
process.env.PORT = process.env.PORT || 3000;

// ========================================
// Enviroment
// ========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// ========================================
// DataBase
// ========================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/catalogo';
} else {
    urlDB = 'mongodb+srv://Mauricio:t4LviNLByruCKio3@cluster0.we9bb.mongodb.net/test';
}

process.env.URL_DB = urlDB;