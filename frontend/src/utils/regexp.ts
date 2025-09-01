const telegramRegex = /^(@[a-zA-Z0-9_]{1,50}|(https?:\/\/)?(t\.me|telegram\.me)\/[a-zA-Z0-9_]{1,50})$/i;
const twitterRegex = /^(@[a-zA-Z0-9_]{1,20}|(https?:\/\/)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]{1,20})$/i;
const discordRegex = /^https?:\/\/(discord\.(gg|com)\/(gg\/[\w]+|users\/\d+|@[\w.-]+)|discordapp\.com\/users\/\d+)$/i;
const mediumRegex = /^((https?:\/\/)?(medium\.com|www\.medium\.com)\/@[\w.-]+|@[\w.-]+)$/i;
const urlRegex =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/i;

export { telegramRegex, twitterRegex, discordRegex, mediumRegex, urlRegex };
