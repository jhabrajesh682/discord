const {Client, Intents} = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] , partials: [
  'CHANNEL', // Required to receive DMs
]});
const userArray = []
const {
  getSheetReady, 
  getRows,
  findEmailId,
  updateDetails,
  getChannelAndRoleId
} = require('../startup/sheet');
const {clearTimeouts} = require('../startup/timeout')
const prefix = '!join-'


module.exports = async function () {
  client.on('ready', () => {
      console.log(`${client.user.username} has started working`)
  })

  client.on('messageCreate', async (message) => {
    await getSheetReady();
    if (message.author.bot) return false
    
    if(message.content.startsWith(prefix)){
      
        const cmdName = message.content.substring(prefix.length)
        console.log('cmdName', cmdName)
        let sheetData = await getRows(1)
          const isClanExist = sheetData.findIndex(x => x.clan === cmdName && x.status === 'yes');
          if (isClanExist > -1) {
            const timeout = setTimeout(() => {
              message.author.send('you have timed out')
            }, process.env.timeout);
            userArray.push({
              timeoutId: timeout,
              userId: message.author.id,
              startTime: new Date().getTime(),
            })
            await message.reply(`Please check your DM to verify your Id?`)
            await message.author.send('Please Provide your EmailId')
          } else {
            message.reply(`Sorry this Clan is not active now.`)
          }
    } else {
      await clearTimeouts(userArray.find(x => x.userId === message.author.id))
      const index = userArray.findIndex(x => x.userId === message.author.id)
      userArray.splice(index, 1);
      const regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
      const status = regex.test(message.content)
      if (status) {
        message.author.send(`Please give me a time i am checking your details.`)
        const emailStatus = await findEmailId(0, message.content)
        console.log('emailStatus==>', emailStatus)
        if (emailStatus) {
          const getDetails = await getChannelAndRoleId(1, 'clan-2')
          await updateDetails(0, message.content, getDetails.channelId, getDetails.roleId)
          const channel = client.channels.cache.find(channel => channel.id === getDetails.channelId)
          channel.send(`welcome to the clan @${message.author.username}`)
          message.author.send('Welcome to the clan. now you can move to clan start discussion there.')
        } else if(!emailStatus) {
          message.author.send('Sorry this email is not registered with us. Please enter a valid email address. Type the command again in bot channel to start verification process again.')
        }
      } else {
        message.author.send(`Please Enter a valid email Id`)
      }
    }

  })


  client.login(process.env.discordJS_BOT_KEY)
}

