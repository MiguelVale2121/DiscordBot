const Discord = require('discord.js');

require('dotenv').config();

const discord_token = process.env.Discord_token;
const client_id = process.env.Client_ID;
const API_KEY_giphy = process.env.API_KEY_giphy;

const { Client, Intents, MessageAttachment } = require('discord.js');
const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES],
        
});

const axios = require('axios');

const prefix = '-';
client.commands = new Discord.Collection();

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('message', message => {
    console.log(message.content)
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    if(args.length === 1){
        const command = args.shift().toLowerCase();
        console.log(command)
        if(command ==='image'){
            axios.get('https://api.unsplash.com/photos/random', {
                headers: {
                    'Authorization': `Client-ID ${client_id}` 
                }
            }).then(({ data }) => {
                message.channel.send(data.urls.regular);
            })
        }
        else if(command ==='gif'){
            axios.get(`https://api.giphy.com/v1/gifs/random?api_key=${API_KEY_giphy}`)
            .then(({ data }) => {
                message.channel.send(data.data.url);
            })
        }
    }
    else if(args.length >1){
        const command = args.shift().toLowerCase();
        const description = args.shift().toLowerCase();
        console.log(description)
        console.log(command)
        if(command ==='image'){
            axios.get('https://api.unsplash.com/photos/random/?query='+ description, {
                headers: {
                    'Authorization': `Client-ID ${client_id}` 
                }
            }).then(({ data }) => {
                
                message.channel.send(data.urls.regular);
            }).catch(()=>message.channel.send('Erro tente outra categoria'))
        }
        else if(command ==='gif'){
            axios.get(`https://api.giphy.com/v1/gifs/random?api_key=${API_KEY_giphy}&tag=`+ description)
            .then(({ data }) => {
                console.log(data.data.length)
                if (data.data.length == 0){
                    message.channel.send('Erro tente outra categoria');
                }
                else{
                    message.channel.send(data.data.url);
                }
            })
        }
    }
    
});

client.login(`Discord Token: ${discord_token}`);
