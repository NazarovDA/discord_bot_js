console.log("bot is starting")
const Discord = require("discord.js");
const settings = require("./bot_data.json")
const sc2_abilities = require("./sc2_data.json")

const Bot = new Discord.Client();

let token = settings["token"];
let prefix = settings["prefix"];


Bot.on("ready", ()=> {
    console.log(`bot ${Bot.user.username} has been started`)
})

let raceAbilities = {
    zerg: [
        "Burrow",
        "Unburrow",
        "Morph to Baneling",
        "Explode",
        "Enable Building Attack",
        "Disable Building Attack",
        "Rapid Regeneration",
        "Morph to Ravager",
        "Corrosive Bile",
        "Disguise",
        "Morph to Lurker",
        "Spawn Locusts",
        "Load (overlord)",
        "Swoop",
        "Frenzied",
        "Generate Creep",
        "Mutate Ventral Sacs",
        "Morph to Overseer",
        "Oversight",
        "Detector (overseer)",
        "Cancel Oversight", 
        "Tissue Regeneration",
        "Morph to Brood Lord",
        "Caustic Spray",
        "Swarm Seeds",
        "Consume",
        "Uproot",
        "Root (spine)",
        "Root (spore)",
        "Load (nydus)",
        "Detector (spore)"
],
    protoss: [
        "Charge",
        "Blink",
        "Psionic Transfer",
        "Archon Merge",
        "Shadow Stride",
        "Permanent Cloak (oracle trap)",
        "Barrier",
        "Cliff Walk",
        "Purification Nova",
        "Stasis Trap",
        "Permanent Cloak (observer)",
        "Detector (observer)",
        "Permanent Cloak (dt)",
        "Surveillance Mode",
        "Observer Mode",
        "Prismatic Alignment",
        "Phasing Mode",
        "Transport Mode",   
        "Load (warp prism)",
        "Build Interceptor",
        "Cloaking Field",
        "Transform to Warpgate",
        "Transform to Gateway",
        "Detector (photon cannon)"
    ],
    terran: [
        "Repair",
        "Stimpack",
        "Concussive Shells",
        "Jet Pack",
        "Combat Drugs",
        "KD8 Charge",
        "Tac Nuke Strike",
        "Hellbat Mode",
        "Hellion Mode",
        "Activate Mine",
        "Deactivate Mine",
        "Sentinel Missiles",
        "Lock On",
        "Siege Mode",
        "Tank Mode",
        "High Impact Payload",
        "Explosive Payload",
        "Assault Mode",
        "Fighter Mode (viking)",
        "Defender Mode",
        "Fighter Mode (liberator)",
        "Detector (Raven)",
        "Load (medivac)",
        "Ignite Afterburners",
        "Tactical Jump",
        "Yamato Cannon",
        "Load (CC)",
        "Lift off",
        "Land",
        "Radar",
        "Lower/Raise",
        "Load (bunker)",
        "Salvage",
        "Detector (Missile turret)"
    ]
};


function get_abilities(){
    return {
        zerg:Object.assign([],raceAbilities.zerg),
        protoss:Object.assign([],raceAbilities.protoss),
        terran:Object.assign([],raceAbilities.terran),
    };
}

/**
 * @description choose an abilities from list
 * @param {Number} numberOfRace - the number of selected abilities
 * @returns {{terran:Array<String>,zerg:Array<String>,protoss:Array<String>}} returns obj with banned abilities
*/
function random_race_abilities(numberOfAbilities){
    let terranAbilities = [];
    let zergAbilities = [];
    let protossAbilities = []; //
    let abilities = get_abilities();
    for (i=0; i<numberOfAbilities; i++){
        terranAbilities.push(abilities.terran.splice(Math.round(Math.random()*abilities.terran.length),1)[0]);
        zergAbilities.push(abilities.zerg.splice(Math.round(Math.random()*abilities.zerg.length),1)[0]);
        protossAbilities.push(abilities.protoss.splice(Math.round(Math.random()*abilities.protoss.length),1)[0]);
    }
    return {
        terran: terranAbilities,
        zerg: zergAbilities,
        protoss: protossAbilities
    }
}

Bot.on("message", async message=>{
    if (message.content.startsWith(prefix)){
        buffer = message.content.slice(1).split(" ");
        command = buffer[0];
        body = buffer.slice(1).join(" ");
        delete buffer;
        console.log(message)
        switch(command){
            case "RandomRaces":
                if (Number(body)){
                    let answer = random_race_abilities(body);
                    await message.reply("Your bans is ready")
                    for (race in answer){
                        await message.channel.send(race)
                        for(ability of answer[race]){
                            await message.channel.send(`${sc2_abilities[ability]["name"]} - ${sc2_abilities[ability]["description"]}`,
                            {files: [sc2_abilities[ability]["image"]]});
                        }
                    }
                } else {
                    await message.reply(`incorrect body(${body}) of the command RandomRaces. Expected to something like "!RandomRaces 2"`)
                }
                break;
            case "Help":
                await message.reply("There is a bunch of commands:\n\
                1. !RandomRaces **number** - send an amount of abilities that won't be used in sc2 game, where **number** is number of bans for each race")
                break;
            default:
                await message.reply("incorrect command, there is no command like that in my list, pls check my possibilities with command !Help")
                break;
        };
    };
})

Bot.login(token)
