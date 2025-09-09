const telegramRegex = /^(@[a-zA-Z0-9_]{1,50}|(https?:\/\/)?(t\.me|telegram\.me)\/[a-zA-Z0-9_]{1,50})$/i;
const twitterRegex = /^(@[a-zA-Z0-9_]{1,20}|(https?:\/\/)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]{1,20})$/i;
// Discord: 2-32 chars, a-z0-9_., no consecutive dots, no leading/trailing dots
const discordRegex =
  /^(@(?=.{2,32}$)(?!.*\.\.)(?!.*^\.)(?!.*\.$)[a-z0-9_.]+|https?:\/\/(discord\.(gg|com)\/(gg\/[a-z0-9]+|users\/(?=.{2,32}$)(?!.*\.\.)(?!.*^\.)(?!.*\.$)[a-z0-9_.]+)|discordapp\.com\/users\/(?=.{2,32}$)(?!.*\.\.)(?!.*^\.)(?!.*\.$)[a-z0-9_.]+))$/i;
// Medium: 2-32 chars, a-z0-9_., no consecutive dots, no leading/trailing dots
const mediumRegex =
  /^(@(?=.{2,32}$)(?!.*\.\.)(?!.*^\.)(?!.*\.$)[a-z0-9_.]+|(https?:\/\/)?(medium\.com|www\.medium\.com)\/@?(?=.{2,32}$)(?!.*\.\.)(?!.*^\.)(?!.*\.$)[a-z0-9_.]+)$/i;
const urlRegex =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/i;

export { telegramRegex, twitterRegex, discordRegex, mediumRegex, urlRegex };
