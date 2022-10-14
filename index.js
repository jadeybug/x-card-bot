// Require the necessary discord.js classes
import { Client, GatewayIntentBits } from 'discord.js';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, child, onValue, get, remove, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCDBjgpkeAr4PG6HtFYXElxr_0Hz07VlTY",
  authDomain: "x-card-bot.firebaseapp.com",
  projectId: "x-card-bot",
  storageBucket: "x-card-bot.appspot.com",
  messagingSenderId: "526577639459",
  appId: "1:526577639459:web:5fbe6c305c3bc245f49196",
  databaseURL: "https://x-card-bot-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });


// When the client is ready, run this code (only once)
client.once('ready', () => {
	onValue(ref(db, 'X'), (X) => {
        if (X && X.val()) {
            Object.entries(X.val()).forEach(([timestamp, Xgame]) => {
                if (Xgame && !Xgame?.notified) {
                    get(ref(db, 'games/' + Xgame.game)).then((game) => {
                        if (game.exists()) {
                            const gameData = game.val();
                            const channel = client.channels.cache.get(gameData.channel);
                            channel.send("Please stop for a moment, the X-Card has been played.");
                            if (Xgame.msg) {
                                channel.send("The following message was included: " + Xgame.msg);
                            }
                            set(ref(db, 'X-Archive/' + timestamp), {
                                game: Xgame.game,
                                msg: Xgame.msg,
                            }).then(() => {
                                remove(ref(db, 'X/' + timestamp));
                            }).catch((e) => {
                                console.log(e);
                                update(ref(db, 'X/' + timestamp), {
                                    notified: true
                                })
                            });
                        } else {
                            console.log("No data available");
                            set(ref(db, 'X-Archive/' + timestamp), {
                                game: Xgame.game,
                                msg: Xgame.msg,
                            }).then(() => {
                                remove(ref(db, 'X/' + timestamp));
                            }).catch((e) => {
                                console.log(e);
                                update(ref(db, 'X/' + timestamp), {
                                    notified: true
                                })
                            });
                        }
                    }).catch((error) => {
                        console.error(error);
                    });
                }   
            })
        }
    })
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'xgame') {
        const gameKey = push(child(ref(db), 'games')).key;
        set(ref(db, `games/${gameKey}`), {
            guild: interaction.guildId,
            channel:interaction.channelId,
        });
		await interaction.reply("https://www.geekfusion.ca/xcard/?game=" + gameKey);
	}
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_JS_TOKEN);