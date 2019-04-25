const net = require("net");
const documents = {};

const commands = {
  create: argumets => {
    const [documentName] = argumets;
    if (documentName) {
      const name = documentName.replace(/\n$/, "");
      documents[name] = "";
      return 200;
    }
    return 404;
  },
  insert: argumets => {
    const [documentName, position, input] = argumets;

    if (documentName in documents) {
      let whereToInsert = position;
      let inputToinsert = input;
      const document = documents[documentName];

      if (isNaN(position)) {
        inputToinsert = position.replace(/\n$/, "");
        documents[documentName] = document.concat(inputToinsert);
        return 200;
      }

      documents[documentName] = [
        document.slice(0, whereToInsert),
        inputToinsert.replace(/\n$/, ""),
        document.slice(whereToInsert)
      ].join("");

      return 200;
    }
    return 404;
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
