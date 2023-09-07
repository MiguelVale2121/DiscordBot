const Discord = require('discord.js');

require('dotenv').config();

const apiKey = process.env.Discord_token;

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
                    'Authorization': `Client-ID 4ptGaKh5p4EW-1ioSY5TEiPhXJ8xAWprfCWd9GM2VKw` 
                }
            }).then(({ data }) => {
                message.channel.send(data.urls.regular);
            })
        }
        else if(command ==='gif'){
            axios.get('https://api.giphy.com/v1/gifs/random?api_key=SQIQE9DEW6ouMeM9jx2FPTPFroObBFaW')
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
                    'Authorization': `Client-ID 4ptGaKh5p4EW-1ioSY5TEiPhXJ8xAWprfCWd9GM2VKw` 
                }
            }).then(({ data }) => {
                
                message.channel.send(data.urls.regular);
            }).catch(()=>message.channel.send('Erro tente outra categoria'))
        }
        else if(command ==='gif'){
            axios.get('https://api.giphy.com/v1/gifs/random?api_key=SQIQE9DEW6ouMeM9jx2FPTPFroObBFaW&tag='+ description)
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

client.login(`API Key: ${apiKey}`);
