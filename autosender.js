const { Client, WebhookClient, MessageEmbed } = require("discord.js-selfbot-v13");

// ==========================================
// CONFIGURATION
// ==========================================

const TOKENS = Object.keys(process.env).filter(k => k.startsWith("TOKEN")).map(k => process.env[k]);
const CHANNEL_IDS = Object.keys(process.env).filter(k => k.startsWith("CHANNEL_ID")).map(k => process.env[k]);

// *** PASTE YOUR WEBHOOK URL HERE ***
// (I switched discordapp.com to discord.com for better reliability)
const LOG_WEBHOOK_URL = "https://discord.com/api/webhooks/1462890770871881740/nNniu9X9nyKc95fbso1vWlWuFlAC-ltYkh9ChH5LdVhZ50Arm93OBuarzBep7Iopr-d_";

const SHARED_REPLIED_USERS = new Set(); 

// TIMING SETTINGS
const CHANNEL_DELAY_MIN = 7000;   
const CHANNEL_DELAY_MAX = 10000;  
const LOOP_COOLDOWN_MIN = 120000; 
const LOOP_COOLDOWN_MAX = 240000; 

// ==========================================
// MESSAGES
// ==========================================

const MESSAGES = [
  {
    text: `**Trading 1,1b cursed la secret , lavadorito 235m , reinito sleighito , rainbow swaggy bros , 481m tuff toucan with skibidi and 26 and more rare brainrots ( my ps i take first strictly )**`,
    attachment: null
  },
  {
    text: `**Looking for:
Cursed Pakramatmatina
Cursed Bombardini Tortini
Cursed Dul Dul Dul
**`,
    attachment: null
  },
  {
    text: `**DM IF U HAVE (I'LL OVERPAY & OFFER)
Garama
W or L
Esok**
`,
    attachment: null
  },
  {
    text: `**LOOKING FOR : 
Dragon Can
La casa boo
Capitano moby**
`,
    attachment: null
  },
  {
    text: `**DM IF U HAVE (I'LL OVERPAY & OFFER)
La secret comb
La supreme comb
Burguro and fruyoro**`,
    attachment: null
  },
  {
    text: `**Looking: Dragon Canneloni | Garama Ketchup N Mustard Tictac Sahur Tralaledon Ketupat Kepat La Supreme Spaghetti Toilet La Secret Combinasion Burguro And Fryuro Tang Kelentang Nuclearo Esok Money Pug Spooky Grande Chillin Chili skibidi toilet**`,
    attachment: null
  },
  {
    text: `**Trading galaxy racooni, rainbow la extinct, gold capitano moby, 1b diamond la taco meowl trait, 2 rb lavadoritos, meowl trait spooky 560m and gold moby and more**`,
    attachment: null
  },
  {
    text: `**TRADING 150M ESOK SEKOLAH MY PRIV SAME TIME LF NORMAL SPHAGETI AND LOS NO MY HOTSPOT FOR ESOK**`,
    attachment: null
  },
  {
    text: `**Lf grama /tang tang/tic tac/chipso and queso / nuc / Brainrots/traledon/ AP /cookie and milki/ketopat, Dm me offers MY PS same time or I take first or u take first**`,
    attachment: null
  },
  {
    text: `**I Have OG MEOWL (1B)
Looking For DragonChanneloni,DragonGingerini,Cerberus,Ketchuru,Garama,Spagheti,LosBros,LaSecret,Tralaledon,Burguro,Ketupat,TangTang,CapytanoMoby,CookieMilky,SpookyPumpky,LaExtinct,Eviledon,W Or L,Chillin,LaCasaBoo,Fragrama,Esok 100M, Or 200M+ BRAINROT, fast respon!**`,
    attachment: null
  }
];

// ==========================================
// DM CONFIGURATION
// ==========================================

const IMG_1 = "https://media.discordapp.net/attachments/1188532859582025828/1462885227687968822/Screenshot_2026-01-05-21-31-31-954_com.roblox.client.jpg?ex=69712309&is=696fd189&hm=b9b7d41bfcc1bb0b8085db507eac67249e196ee1b32910a447ae74fb8a73fb34&=&format=webp&width=1768&height=776";
const IMG_2 = "https://media.discordapp.net/attachments/1188532859582025828/1462885228132700314/Screenshot_20260119-135556.png?ex=69712309&is=696fd189&hm=fcbe57d6f644a12d0b0d8c41d5c87ddfd0a21a5540726a516479f5983f703a69&=&format=webp&quality=lossless";
const HIDDEN_IMGS = `[.]( ${IMG_1} ) [.]( ${IMG_2} )`;

const DM_SEQUENCE = [
  { 
    choices: ["yo u trade?", "trade?", "u trading?", "yo", "wanna offer?"], 
    minDelay: 4000, maxDelay: 8000 
  },
  { 
    choices: [
      `i got these brainrots: ${HIDDEN_IMGS}`,
      `check these ${HIDDEN_IMGS}`,
      `offer on these? ${HIDDEN_IMGS}`,
      `lf offers on these ${HIDDEN_IMGS}`
    ],
    minDelay: 6000, maxDelay: 10000
  },
  { 
    choices: [
      "also trying to get invites here for a giveaway, mind joining? https://discord.gg/4vB5GkRxsf ill accept ur trade if u do",
      "btw can u join this fast? trying to help a friend https://discord.gg/4vB5GkRxsf",
      "wait join this rq im helping my friend get invites https://discord.gg/4vB5GkRxsf"
    ],
    minDelay: 8000, maxDelay: 12000
  },
  { 
    choices: ["so which one u want?", "what u need?", "which brainrot u lf?", "pick one"],
    minDelay: 10000, maxDelay: 15000
  },
  { 
    choices: ["g2g do dishes brb", "wait mom calling", "hol on gotta go ill msg u tmr", "brb taking shower"],
    minDelay: 80000, maxDelay: 120000
  }
];

// ==========================================
// UTILS & WEBHOOK
// ==========================================

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const log = (user, msg) => console.log(`[${new Date().toLocaleTimeString()}] [${user}] ${msg}`);

// Initialize Webhook (Handle failure gracefully if URL is bad)
let webhookClient = null;
try {
  if (LOG_WEBHOOK_URL) webhookClient = new WebhookClient({ url: LOG_WEBHOOK_URL });
} catch (e) {
  console.log("Webhook URL is invalid, logging disabled.");
}

async function sendWebhookLog(botName, userTag, userId, content) {
  if (!webhookClient) return;

  try {
    const embed = new MessageEmbed()
      .setTitle("🚨 New DM Target Acquired")
      .setColor("#00FF00") // Green
      .addField("Account", botName, true)
      .addField("Target User", `${userTag} (<@${userId}>)`, true)
      .addField("User Said", content || "Image/Sticker")
      .setTimestamp();

    await webhookClient.send({
      username: "Manager",
      embeds: [embed],
    });
  } catch (err) {
    // Just log error, don't stop the bot
    console.log(`[Log Failed] Webhook didn't send, but bot is still running. Error: ${err.message}`);
  }
}

function humanizeText(text) {
  let modified = text;
  if (Math.random() < 0.3) modified = modified.toLowerCase();
  
  // Always add ID to avoid duplicate text mute
  const id = Math.floor(Math.random() * 9999);
  modified += `${id}`; 
  
  return modified;
}

// ==========================================
// LOGIC
// ==========================================

function createMessagePicker(botIndex) {
  let index = botIndex % MESSAGES.length;
  return () => {
    const msg = MESSAGES[index];
    index = (index + 1) % MESSAGES.length; 
    return msg;
  };
}

async function handleDM(message) {
  const { client, author, channel, content } = message;

  // 1. Check Shared Memory
  if (SHARED_REPLIED_USERS.has(author.id)) return;
  SHARED_REPLIED_USERS.add(author.id);

  log(client.user.username, `>>> DM Conversation started with ${author.tag}`);

  // 2. SEND WEBHOOK LOG (FIRE AND FORGET)
  // removed 'await' so the bot doesn't freeze if webhook fails
  sendWebhookLog(client.user.tag, author.tag, author.id, content).catch(e => {});

  // 3. Start Sequence IMMEDIATELY
  for (const step of DM_SEQUENCE) {
    const randomText = step.choices[Math.floor(Math.random() * step.choices.length)];
    const delay = rand(step.minDelay, step.maxDelay);
    
    await channel.sendTyping().catch(() => {});
    await sleep(delay);
    await channel.send(randomText).catch((e) => log(client.user.username, `DM Failed: ${e.message}`));
  }
}

async function startPoster(client, botIndex) {
  const pickMessage = createMessagePicker(botIndex);
  log(client.user.username, `Auto-poster started.`);

  while (true) {
    for (const channelId of CHANNEL_IDS) {
      const channel = client.channels.cache.get(channelId);
      
      if (channel) {
        const rawMsg = pickMessage();
        const safeContent = humanizeText(rawMsg.text);

        try {
          const payload = { content: safeContent };
          if (rawMsg.attachment) payload.files = [rawMsg.attachment];
          await channel.send(payload);
          log(client.user.username, `Posted in ${channelId}`);
        } catch (err) {
          log(client.user.username, `Post failed: ${err.message}`);
          await sleep(30000); 
        }
      }
      await sleep(rand(CHANNEL_DELAY_MIN, CHANNEL_DELAY_MAX));
    }
    log(client.user.username, `Finished lap. Resting...`);
    await sleep(rand(LOOP_COOLDOWN_MIN, LOOP_COOLDOWN_MAX));
  }
}

// ==========================================
// START
// ==========================================

console.log(`Starting ${TOKENS.length} tokens...`);

for (const [index, token] of TOKENS.entries()) {
  const client = new Client();
  
  client.on("ready", async () => {
    const delay = rand(5000, 45000); 
    log(client.user.username, `Logged in. Starting in ${delay}ms`);
    await sleep(delay);
    startPoster(client, index);
  });

  client.on("messageCreate", (msg) => {
    if (!msg.author || msg.author.id === client.user.id) return;
    if (msg.channel.type === "DM") handleDM(msg);
  });

  client.login(token).catch(e => console.error(`Token ${index} failed: ${e.message}`));
}