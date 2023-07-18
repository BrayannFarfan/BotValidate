require('dotenv').config();
const Discord = require('discord.js');
const ExcelJS = require('exceljs');
const { GatewayIntentBits} = require('discord.js');
const token = process.env.TOKEN_DISCORD

const client = new Discord.Client({
    intents:[
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
    ]
});
const excelFilePath = './data/correos.xlsx'; // Ruta al archivo Excel que contiene los correos electrónicos

// Función para obtener los correos electrónicos desde el archivo Excel
async function obtenerCorreosDesdeExcel() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelFilePath);

  const worksheet = workbook.getWorksheet('correos'); // Nombre de la hoja del archivo Excel que contiene los correos

  const correos = [];

  for (let i = 2; i <= worksheet; i++) {
    const email = worksheet.getCell(`A${i}`).value; // Suponemos que los correos están en la columna A

    if (email) {
      correos.push(email); // Almacenamos los correos electrónicos en minúsculas para una comparación sin distinción de mayúsculas/minúsculas
    }
  }

  return correos;
}

client.on('ready', () => {
  console.log(`Bot iniciado como ${client.user.tag}`);
});

client.on('guildMemberAdd', async (member) => {
  const email = member.user.email;

  const correosPermitidos = await obtenerCorreosDesdeExcel();

  if (!correosPermitidos.includes(email)) {
    member.send(`Lo siento, tu correo electrónico (${email}) no está registrado o no es válido. No tienes acceso al servidor.`);
    member.kick(); // Expulsa al usuario del servidor
  } else if (existeEmailRepetido(member.guild, email)) {
    member.send(`Lo siento, ya hay otro usuario en el servidor con el mismo correo electrónico (${email}). No puedes unirte al servidor.`);
    member.kick(); // Expulsa al usuario del servidor
  }else{
    const canalNotificaciones = client.channels.cache.get('1130948763377225798')
    canalNotificaciones.send(`Nuevo Usuario: ${member.user.tag}`)
  }
});

// Función para verificar si existe un email repetido en el servidor
function existeEmailRepetido(guild, email) {
  const members = guild.members.cache.array();
  for (const member of members) {
    if (member.user.email === email) {
      return true; // Existe un email repetido en el servidor
    }
  }
  return false; // No existe ningún email repetido en el servidor
}

client.login(token); // Reemplaza 'TOKEN_DE_TU_BOT' con el token de tu bot



//Dyno -->BOT para prohibir malas palabras, advertencia, banear. video -->https://www.youtube.com/watch?v=V76Bgsch6qM
