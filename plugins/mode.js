const { rudhra,mode,PREFIX} = require("../lib");
const config = require("../config");

rudhra(
  {
    pattern: "mode ?(.*)",
    fromeMe: true,
    desc: "Change work type",
    type: "user",
  },
  async (message, match) => {
if (mode) {
type = "Pʀɪᴠᴀᴛᴇ"
} else {
type = "Pᴜʙʟɪᴄ"
}
let link = `${config.BOT_INFO.split(";")[2]}`;
let url = await message.ParseButtonMedia(link)
    let data = {
      jid: message.jid,
      button: [
       {
          type: "reply",
          params: {
            display_text: "PUBLIC",
            id:  `${PREFIX}setvar MODE:public`,
          },
        },
       {
          type: "reply",
          params: {
            display_text: "PRIVATE",
            id:  `${PREFIX}setvar MODE:private`,
          },
        },
      ],
      header: {
        title: `${config.BOT_NAME}`,
        subtitle: "",
        hasMediaAttachment: true
      },
      footer: {
        text: "TYPE : " + type,
      },
      body: {
        text: "",
      },
    };
     if (link.endsWith(".mp4")) {
    data.header.videoMessage = url;
  } else {
    data.header.imageMessage = url;   
  }
    return await message.sendMessage(message.jid, data, {}, "interactive");
  }
);
