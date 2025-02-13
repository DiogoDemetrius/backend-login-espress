const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('A variável de ambiente MONGO_URI não está definida');
        }

        console.log('Tentando conectar ao MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado ao MongoDB!');
        console.log('Nome do banco:', conn.connection.name);
        
        // Listar todas as collections
        const collections = await conn.connection.db.listCollections().toArray();
        console.log('Collections disponíveis:', collections.map(c => c.name));
        
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error.message);
        console.error('Verifique se:');
        console.error('1. O arquivo .env existe');
        console.error('2. A variável MONGO_URI está definida no arquivo .env');
        console.error('3. A URI do MongoDB está correta');
        process.exit(1);
    }
};

module.exports = connectDB;
