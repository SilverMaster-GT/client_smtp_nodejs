const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

const app = express();
const PORT = 3010;

// Determinar el entorno actual (development o production)
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile }); // Cargar variables de entorno desde el archivo correspondiente

// Configurar el middleware para analizar las solicitudes JSON
app.use(bodyParser.json());

// Ruta POST para enviar correos
app.post("/send-email", async (req, res) => {
  try {
    // Extraer los parámetros del cuerpo de la solicitud
    const { subject, html, to } = req.body;

    // Configurar el transporte SMTP usando nodemailer y las credenciales de Mandrill
    const transporter = nodemailer.createTransport({
      host: "smtp.mandrillapp.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MANDRILL_USER,
        pass: process.env.MANDRILL_API_KEY,
      },
    });

    // Configurar el correo electrónico
    const mailOptions = {
      from: "no-reply@alliedglobal.com",
      to,
      subject,
      html,
    };

    // Enviar el correo electrónico
    await transporter.sendMail(mailOptions);

    // Si el correo se envió correctamente, enviar una respuesta
    res
      .status(200)
      .json({ success: true, message: "Correo enviado correctamente." });
  } catch (error) {
    // Si hay algún error, enviar una respuesta de error
    console.error("Error al enviar el correo:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al enviar el correo." });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor SMTP escuchando en el puerto ${PORT}`);
});