// =======================
// CONFIG
// =======================

const { Client } = require("discord.js-selfbot-v13");

// Load tokens from env (TOKEN1, TOKEN2, ...)
const TOKENS = Object.keys(process.env)
  .filter(k => k.startsWith("TOKEN"))
  .map(k => process.env[k]);

console.log("Loaded tokens:", TOKENS.length);

// Load channel IDs from env (CHANNEL_ID1, CHANNEL_ID2, ...)
const CHANNEL_IDS = Object.keys(process.env)
  .filter(k => k.startsWith("CHANNEL_ID"))
  .map(k => process.env[k]);

console.log("Loaded Channel IDs:", CHANNEL_IDS);

// =======================
// MESSAGES
// =======================

const MESSAGES = [
  { text: "**TRADING 150M ESOK SEKOLAH MY PRIV SAME TIME LF NORMAL SPHAGETI AND LOS NO MY HOTSPOT FOR ESOK**", attachment: null },
  { text: "**PVP OR TRADE MY RB NUKE AND RB LA SPOOKY GRANDE ORCALEDON AND W OR L MY PS NO ALT**", attachment: null },
  { text: "**Trade garama 500m my server**", attachment: null },
  { text: "**TRADING AP [ADMIN PANEL] UR PS I GIFT FIRST**", attachment: null },
  { text: "**pvping meowl 3.5B/s, looking to trade**", attachment: null },
  { text: "**got a meowl 3.5B/s, should i trade it?**", attachment: null },
  { text: "**new to sab, trading strawberry elephant (1.2B/s)**", attachment: null }
];

  

// =======================
// DELAYS
// =======================

// Delay between channel sends
const MIN_DELAY = 5000;
const MAX_DELAY = 8000;

// Cooldown after completing all channels (per token)
const TOKEN_COOLDOWN_MIN = 15000;
const TOKEN_COOLDOWN_MAX = 35000;

// Startup delay per token
const STARTUP_DELAY_MIN = 5000;
const STARTUP_DELAY_MAX = 25000;

// =======================
// DM REPLY SEQUENCE
// =======================

const DM_SEQUENCE = [
  { text: "Would you like to trade?", delay: 7000 },

  {
    text:
      "i got these brainrots: [.](https://cdn.discordapp.com/attachments/1451484225479114886/1452293890198732850/image.png) [.](https://cdn.discordapp.com/attachments/1451484225479114886/1451545239201251329/image.png)",
    delay: 8000
  },

  {
    text:
      "Im also trying to help a friend with some invites, could you please join this server? I will trade if you do.. https://discord.gg/4vB5GkRxsf",
    delay: 8000
  },

  {
    text: "So which of the brainrots would you be like to trade?",
    delay: 13000
  },

  {
    text: "Sorry gotta go do something, mind if we trade later or tomorrow?",
    delay: 100000
  }
];

// =======================
// HELPERS
// =======================

const sleep = ms => new Promise(res => setTimeout(res, ms));

const rand = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomDelay = () => rand(MIN_DELAY, MAX_DELAY);
const getStartupDelay = () => rand(STARTUP_DELAY_MIN, STARTUP_DELAY_MAX);
const getTokenCooldown = () => rand(TOKEN_COOLDOWN_MIN, TOKEN_COOLDOWN_MAX);

// Each token gets its own message rotation
function createMessagePicker() {
  let index = Math.floor(Math.random() * MESSAGES.length);

  return () => {
    const msg = MESSAGES[index];
    index = (index + 1) % MESSAGES.length;
    return msg;
  };
}

async function sendMessageWithAttachment(channel, data) {
  const payload = {};
  if (data.text) payload.content = data.text;
  if (data.attachment) payload.files = [data.attachment];

  await channel.send(payload).catch(() => {});
}

// =======================
// AUTO POSTER
// =======================

async function startPoster(client) {
  const pickMessage = createMessagePicker();

  console.log(`[${client.user.username}] Auto-poster started`);

  while (true) {
    for (const channelId of CHANNEL_IDS) {
      const channel = client.channels.cache.get(channelId);

      if (!channel) {
        console.log(
          `[${client.user.username}] Cannot find channel: ${channelId}`
        );
        continue;
      }

      const msgData = pickMessage();
      await sendMessageWithAttachment(channel, msgData);

      console.log(
        `[${client.user.username}] Sent → ${msgData.text || "Attachment"}`
      );

      await sleep(getRandomDelay());
    }

    // Cooldown before repeating channels (per token)
    await sleep(getTokenCooldown());
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

  console.log(
    `[${client.user.username}] DM received from ${message.author.tag}`
  );

  for (const step of DM_SEQUENCE) {
    await message.channel.sendTyping();
    await sleep(step.delay);
    await message.channel.send(step.text).catch(() => {});

    console.log(
      `[${client.user.username}] DM sent → ${step.text}`
    );
  }
}

// =======================
// LOGIN ALL TOKENS
// =======================

for (const token of TOKENS) {
  const client = new Client();

  client.on("ready", async () => {
    const delay = getStartupDelay();

    console.log(
      `[${client.user.username}] Logged in – starting in ${delay}ms`
    );

    await sleep(delay);
    startPoster(client);
  });

  client.on("messageCreate", async msg => {
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
