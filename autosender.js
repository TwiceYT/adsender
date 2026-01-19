const { Client } = require("discord.js-selfbot-v13");

// ==========================================
// CONFIGURATION
// ==========================================

// Load all TOKEN_X from .env
const TOKENS = Object.keys(process.env)
  .filter(k => k.startsWith("TOKEN"))
  .map(k => process.env[k]);

// Load all CHANNEL_ID_X from .env
const CHANNEL_IDS = Object.keys(process.env)
  .filter(k => k.startsWith("CHANNEL_ID"))
  .map(k => process.env[k]);

// SHARED MEMORY: Prevents multiple bots from DMing the same person
const SHARED_REPLIED_USERS = new Set(); 

// TIMING SETTINGS
const CHANNEL_DELAY_MIN = 8000;   // Seconds gap between channels
const CHANNEL_DELAY_MAX = 12000;  //  Seconds max gap
const LOOP_COOLDOWN_MIN = 80000; // Minutes rest after finishing all channels
const LOOP_COOLDOWN_MAX = 120000; // Minutes max rest

// ==========================================
// ADVERTISEMENT MESSAGES
// ==========================================

const MESSAGES = [
  {
    text: `Trading 1,1b cursed la secret , lavadorito 235m , reinito sleighito , rainbow swaggy bros , 481m tuff toucan with skibidi and 26 and more rare brainrots ( my ps i take first strictly )`,
    attachment: null
  },
  {
    text: `Looking for:
Cursed Pakramatmatina
Cursed Bombardini Tortini
Cursed Dul Dul Dul
Cursed Los Spyderinis
Cursed Los Karkeritos
Cursed 1x1x1x1
Cursed Rang Ring Bus
Cursed Horegini Boom
Cursed No My Hotspot
Cursed No My Examine
Cursed Ho Ho Ho Sahur
Cursed Guest 666
Cursed Ketchuru and Musturu
Cursed Burguro and Fryuro
Cursed Cooki and Milki
Cursed Capitano Moby`,
    attachment: null
  },
  {
    text: `DM IF U HAVE (I'LL OVERPAY & OFFER)
Garama
W or L
Esok
La jolly grande
Los spaghetti
Los bros
La spooky grande
Cookie and Milki
Tralaledon
Eviledon
Orcaledon
Chipso and queso
Spooky and pumpy`,
    attachment: null
  },
  {
    text: `LOOKING FOR : 
Dragon Can
La casa boo
Capitano moby
Fragama
Ketupat 
Tang Tang kaletang
La secret
Los bros
Los Hotspotsitos
Spaghetti Tualetti
Ketupat Kepat
Tralaledon
Ketchuru and Musturu
Garama and madung dung
Nuclearo Dinossauro
Tang tang kaletang
Los tacoritas
Tictac sahur`,
    attachment: null
  },
  {
    text: `DM IF U HAVE (I'LL OVERPAY & OFFER)
La secret comb
La supreme comb
Burguro and fruyoro
Tictac sahur
Spaghetti 
Ketupat kepat
Ketchu and mastur
Nukelearo
Tang tang keletang
Chillin chili
Los primos
Swaggy bros
Ginger Gerat
Jolly jolly sahur
Reinito Sleight`,
    attachment: null
  },
  {
    text: `Looking: Dragon Canneloni | Garama Ketchup N Mustard Tictac Sahur Tralaledon Ketupat Kepat La Supreme Spaghetti Toilet La Secret Combinasion Burguro And Fryuro Tang Kelentang Nuclearo Esok Money Pug Spooky Grande Chillin Chili skibidi toilet`,
    attachment: null
  },
  {
    text: `Trading galaxy racooni, rainbow la extinct, gold capitano moby, 1b diamond la taco meowl trait, 2 rb lavadoritos, meowl trait spooky 560m and gold moby and more`,
    attachment: null
  },
  {
    text: `**TRADING 150M ESOK SEKOLAH MY PRIV SAME TIME LF NORMAL SPHAGETI AND LOS NO MY HOTSPOT FOR ESOK**`,
    attachment: null
  },
  {
    text: `Lf grama /tang tang/tic tac/chipso and queso / nuc / Brainrots/traledon/ AP /cookie and milki/ketopat, Dm me offers MY PS same time or I take first or u take first`,
    attachment: null
  },
  {
    text: `I Have OG MEOWL (1B)
Looking For DragonChanneloni,DragonGingerini,Cerberus,Ketchuru,Garama,Spagheti,LosBros,LaSecret,Tralaledon,Burguro,Ketupat,TangTang,CapytanoMoby,CookieMilky,SpookyPumpky,LaExtinct,Eviledon,W Or L,Chillin,LaCasaBoo,Fragrama,Esok 100M, Or 200M+ BRAINROT, fast respon!`,
    attachment: null
  }
];

// ==========================================
// DM CONFIGURATION
// ==========================================

// --- DEFINE IMAGES HERE (Change once, updates everywhere) ---
const IMG_1 = "https://media.discordapp.net/attachments/1188532859582025828/1462885227687968822/Screenshot_2026-01-05-21-31-31-954_com.roblox.client.jpg?ex=696fd189&is=696e8009&hm=7a986a303136574f27c5f227518499fff972559bc635692ba69f38c4dbbaa077&=&format=webp&width=1768&height=776";
const IMG_2 = "https://media.discordapp.net/attachments/1188532859582025828/1462885228132700314/Screenshot_20260119-135556.png?ex=696fd189&is=696e8009&hm=6d99a2bfd30d47a15210332e2e2b39fe405ecf4c7579130293924b8044c562a8&=&format=webp&quality=lossless";

// This creates the hidden markdown string: [.](link1) [.](link2)
const HIDDEN_IMGS = `[.]( ${IMG_1} ) [.]( ${IMG_2} )`;

const DM_SEQUENCE = [
  // STEP 1: Opener
  { 
    choices: ["yo u trade?", "trade?", "u trading?", "yo", "wanna offer?"], 
    minDelay: 4000, maxDelay: 8000 
  },
  
  // STEP 2: Proof (Using the variable now!)
  { 
    choices: [
      `i got these brainrots: ${HIDDEN_IMGS}`,
      `check these ${HIDDEN_IMGS}`,
      `offer on these? ${HIDDEN_IMGS}`,
      `lf offers on these ${HIDDEN_IMGS}`
    ],
    minDelay: 6000, maxDelay: 10000
  },
  
  // STEP 3: Invite
  { 
    choices: [
      "also trying to get invites here for a giveaway, mind joining? https://discord.gg/4vB5GkRxsf",
      "btw can u join this fast? trying to help a friend https://discord.gg/4vB5GkRxsf",
      "wait join this rq im helping my friend get invites https://discord.gg/4vB5GkRxsf"
    ],
    minDelay: 8000, maxDelay: 12000
  },
  
  // STEP 4: Closing
  { 
    choices: ["so which one u want?", "what u need?", "which brainrot u lf?", "pick one"],
    minDelay: 10000, maxDelay: 15000
  },
  
  // STEP 5: Leave
  { 
    choices: ["g2g do dishes brb", "wait mom calling", "hol on gotta go ill msg u tmr", "brb taking shower"],
    minDelay: 80000, maxDelay: 120000
  }
];

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const log = (user, msg) => console.log(`[${new Date().toLocaleTimeString()}] [${user}] ${msg}`);

/**
 * Adds noise to text to prevent "Duplicate Message" spam detection.
 */
function humanizeText(text) {
  let modified = text;
  
  // 30% chance to lowercase the whole text (looks lazy/real)
  if (Math.random() < 0.3) {
    modified = modified.toLowerCase();
  }

  // Always add a random invisible ID or bottom tag
  const id = Math.floor(Math.random() * 9999);
  modified += `\n\n[id:${id}]`; 

  return modified;
}

// ==========================================
// MAIN LOGIC
// ==========================================

/**
 * Selects message starting point based on Bot Index.
 * Bot 0 -> Msg 0, Bot 1 -> Msg 1... Bot 10 -> Msg 0
 */
function createMessagePicker(botIndex) {
  let index = botIndex % MESSAGES.length;

  return () => {
    const msg = MESSAGES[index];
    index = (index + 1) % MESSAGES.length; // Rotate to next message for next channel
    return msg;
  };
}

/**
 * Handles incoming DMs. Uses Shared Memory to prevent collisions.
 */
async function handleDM(message) {
  const { client, author, channel } = message;

  // 1. Check if ANY bot has already replied to this user
  if (SHARED_REPLIED_USERS.has(author.id)) return;
  
  // 2. Claim this user
  SHARED_REPLIED_USERS.add(author.id);

  log(client.user.username, `>>> DM Conversation started with ${author.tag}`);

  // 3. Run the sequence
  for (const step of DM_SEQUENCE) {
    // Pick random variant
    const randomText = step.choices[Math.floor(Math.random() * step.choices.length)];
    
    // Human-like delay
    const delay = rand(step.minDelay, step.maxDelay);
    
    await channel.sendTyping().catch(() => {});
    await sleep(delay);
    
    await channel.send(randomText).catch((e) => {
        log(client.user.username, `Failed to DM: ${e.message}`);
    });
  }
}

/**
 * The infinite loop that posts ads to channels.
 */
async function startPoster(client, botIndex) {
  const pickMessage = createMessagePicker(botIndex);

  log(client.user.username, `Auto-poster started.`);

  while (true) {
    // === LOOP THROUGH CHANNELS ===
    for (const channelId of CHANNEL_IDS) {
      const channel = client.channels.cache.get(channelId);
      
      if (channel) {
        const rawMsg = pickMessage();
        
        // Anti-ban safety
        const safeContent = humanizeText(rawMsg.text);

        try {
          const payload = { content: safeContent };
          if (rawMsg.attachment) payload.files = [rawMsg.attachment];

          await channel.send(payload);
          log(client.user.username, `Posted in ${channelId}`);
        } catch (err) {
          log(client.user.username, `Post failed: ${err.message}`);
          // If error (like rate limit), wait 30s before next channel
          await sleep(30000); 
        }
      }

      // === THE 7 SECOND GAP ===
      await sleep(rand(CHANNEL_DELAY_MIN, CHANNEL_DELAY_MAX));
    }

    // === COOLDOWN AFTER ALL CHANNELS ===
    // Rest for 2-4 minutes
    log(client.user.username, `Finished lap. Resting...`);
    await sleep(rand(LOOP_COOLDOWN_MIN, LOOP_COOLDOWN_MAX));
  }
}

// ==========================================
// INITIALIZATION
// ==========================================

console.log(`Starting ${TOKENS.length} tokens...`);

for (const [index, token] of TOKENS.entries()) {
  const client = new Client();
  
  client.on("ready", async () => {
    // Random startup delay so bots don't all post at the exact same millisecond
    const delay = rand(5000, 45000); 
    log(client.user.username, `Logged in. Starting in ${delay}ms`);
    
    await sleep(delay);
    startPoster(client, index);
  });

  client.on("messageCreate", (msg) => {
    // Ignore self and bots
    if (!msg.author || msg.author.id === client.user.id) return;
    
    // Listen for DMs
    if (msg.channel.type === "DM") {
      handleDM(msg);
    }
  });

  client.login(token).catch(e => console.error(`Token ${index} failed: ${e.message}`));
}