const net = require("net");
const documents = {};

const commands = {
  create: argumets => {
    const [documentName] = argumets;
    if (documentName) {
      documents[documentName] = "";
      return "200";
    }
    return "404";
  },
  help: () => `
 __        
 (_ |o_|_ _ 
 __)|| |_(/_.com
                 
  Commands:
  * Create document: create:nameofdoc`
};

const getCommand = input => {
  if (input.includes(":")) {
    return input.split(":")[0];
  }
  return input.split("\n")[0];
};

var server = net.createServer(socket => {
  socket.on("data", data => {
    const textChunk = data.toString("utf8");
    const command = getCommand(textChunk);
    if (commands[command]) {
      const response = commands[command](textChunk.split(":").slice(1));
      return socket.write(`${response}\r\n`);
    }
    return socket.write(
      `Command: ${command} does not exist or is missing some paramters \n`
    );
  });
});


server.listen(1337, "127.0.0.1");
