// =======================

// CONFIG

// =======================

const { Client } = require("discord.js-selfbot-v13");

// Put all your tokens here

const TOKENS = Object.keys(process.env)
  .filter(key => key.startsWith('TOKEN'))
  .map(key => process.env[key]);

console.log("Loaded tokens:", TOKENS);

// Channel IDs you provided

const CHANNEL_IDS = Object.keys(process.env)
  .filter(key => key.startsWith('CHANNEL_ID'))
  .map(key => process.env[key]);

console.log("Loaded tokens:", CHANNEL_IDS);


// Randomised messages with attachment support

// text = optional, attachment = optional

const MESSAGES = [
  { text: "pvping/trading my strawberry elephant (1.2B/s). ur ps. im new to the game so idk the values", attachment: null },

  { text: "pvping/trading my meowl (3.5B/s). ur ps. im new to sab so idk values", attachment: null }
];



// Delay settings

const FIXED_DELAY_AFTER_SEND = 10000; // 5 seconds after message

const MIN_DELAY = 3000;             // 10s before next channel

const MAX_DELAY = 5000;             // 20s before next channel

// =======================

// DM REPLY SEQUENCE

const DM_SEQUENCE = [

    { text: "hey", delay: 5000 },

    { text: "let's trade", delay: 2000 },

    { text: "i got these brainrots: [.](https://cdn.discordapp.com/attachments/1451484225479114886/1452293890198732850/image.png?ex=69494995&is=6947f815&hm=8f4bfaccf944c11ab29e63b45c1b00e7dfa18bd706d66cbdd81913acdf92c184&) [.](https://cdn.discordapp.com/attachments/1451484225479114886/1451545239201251329/image.png?ex=69493359&is=6947e1d9&hm=df13f993dcaba12ef7c1d8a2446301f9ea96f39b912f283df680f3c18ad83b8f&) ", delay: 7000},
    
    
    { 

      text: "but first can u pls join this server https://discord.gg/brainrotstrades otherwise i won't be able to trade with u", 

      delay: 8000 

    },

    { text: "its my trade policy", delay: 5000 },

    { 

      text: "you can literally leave the server if i dont trade with u bro",

      delay: 8000 

    }

];


//;

// =======================

// HELPERS

// =======================

function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));

}

function getRandomDelay() {

    return Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;

}

function getRandomMessage() {

    return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

}

// Send text + attachment

async function sendMessageWithAttachment(channel, data) {

    const payload = {};

    if (data.text) payload.content = data.text;

    if (data.attachment) payload.files = [data.attachment];

    await channel.send(payload).catch(() => {});

}

// =======================

// START AUTO POSTER

// =======================

async function startPoster(client) {

    console.log(`[${client.user.username}] Auto-poster started`);

    while (true) {

        for (const channelId of CHANNEL_IDS) {

            const channel = client.channels.cache.get(channelId);

            if (!channel) {

                console.log(`[${client.user.username}] Cannot find channel: ${channelId}`);

                continue;

            }

            const msgData = getRandomMessage();

            await sendMessageWithAttachment(channel, msgData);

            console.log(

                `[${client.user.username}] Sent → ${msgData.text || "Attachment only"}`

            );

            await sleep(FIXED_DELAY_AFTER_SEND);

            await sleep(getRandomDelay());

        }

    }

}

// =======================

// DM HANDLER

// =======================

const repliedUsers = new Set();

async function handleDM(message) {

    const client = message.client;

    if (repliedUsers.has(message.author.id)) return;

    repliedUsers.add(message.author.id);

    console.log(`[${client.user.username}] DM received from ${message.author.tag}`);

    for (const step of DM_SEQUENCE) {

        await message.channel.sendTyping();

        await sleep(step.delay);

        await message.channel.send(step.text).catch(() => {});

        console.log(`[${client.user.username}] DM sent → ${step.text}`);

    }

}

// =======================

// LOGIN ALL TOKENS

// =======================

for (const token of TOKENS) {

    const client = new Client();

    client.on("ready", () => {

        console.log(`[${client.user.username}] Logged in`);

        startPoster(client);

    });

    client.on("messageCreate", async (msg) => {

        if (!msg.author) return;

        if (msg.author.id === client.user.id) return;

        if (msg.channel.type === "DM") {

            handleDM(msg);

        }

    });

    client.login(token).catch(() => {

        console.log(`Invalid token: ${token}`);

    });

}