const express = require('express');
const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MongoAdapter = require('@bot-whatsapp/database/mongo');

const MONGO_DB_URI = 'mongodb+srv://spatemplate28:3yHl8y63kOduKv0O@cluster0.yzp1qhd.mongodb.net/';
const MONGO_DB_NAME = 'test';

// Configura el flujo principal del chatbot
const flowPrincipal = addKeyword(['chatbot'])
    .addAnswer('🙌 Hola bienvenido a este *Chatbot*');

// Configura el servidor Express
const app = express();
app.use(express.json()); // Para parsear JSON en el cuerpo de las solicitudes

// Función para enviar un mensaje de WhatsApp
const sendMessage = async (number, message) => {
    try {
        await adapterProvider.sendMessage(`${number}@c.us`, message);
        console.log('Mensaje enviado exitosamente');
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
    }
};

// Ruta POST /hola
app.post('/hola', async (req, res) => {
    const { number, message } = req.body;

    if (!number || !message) {
        return res.status(400).send('Número y mensaje son requeridos');
    }

    // Enviar mensaje
    await sendMessage(number, message);

    res.send('Mensaje enviado');
});

// Función principal para configurar el bot
const main = async () => {
    // Configura el adaptador de base de datos
    const adapterDB = new MongoAdapter({
        dbUri: MONGO_DB_URI,
        dbName: MONGO_DB_NAME,
    });

    // Configura el adaptador de flujo
    const adapterFlow = createFlow([flowPrincipal]);

    // Configura el proveedor de Baileys
    adapterProvider = createProvider(BaileysProvider);

    // Configura el bot
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    // Inicia el portal QR para la autenticación
    QRPortalWeb();

    // Inicia el servidor Express en el puerto 3002
    app.listen(3002, () => {
        console.log('Servidor escuchando en el puerto 3002');
    });
};

// Ejecuta la función principal
main();
