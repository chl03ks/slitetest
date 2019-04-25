const documents = {};

module.exports = {
  create: argumets => {
    const [documentName] = argumets;
    if (documentName) {
      const name = documentName.replace(/\n$/, "");
      documents[name] = {
        content: ""
      };
      return 200;
    }
    return 404;
  },
  insert: argumets => {
    const [documentName, position, input] = argumets;

    if (documentName in documents) {
      let whereToInsert = position;
      let inputToinsert = input;
      const document = documents[documentName].content;

      if (isNaN(position)) {
        inputToinsert = position.replace(/\n$/, "");
        documents[documentName].content = document.concat(inputToinsert);
        return 200;
      }

      documents[documentName].content = [
        document.slice(0, whereToInsert),
        inputToinsert.replace(/\n$/, ""),
        document.slice(whereToInsert)
      ].join("");

      return 200;
    }
    return 404;
  },
  get: argumets => {
    const [documentName, formatype = ""] = argumets;
    const id = documentName.replace(/\n$/, "");
    const format = formatype.replace(/\n$/, "");
    if (id in documents) {
      if (format === "md") {
        if (documents[id].bold) {
          return documents[id].bold.reduce((total, currentValue) => {
            const values = currentValue.map((element, index) => {
              if (index === currentValue.length - 1) element += 2;
              total = [
                total.slice(0, element),
                "**",
                total.slice(element)
              ].join("");
              return total;
            });
            return values[values.length - 1];
          }, documents[id].content);
        }
        if (documents[id].italic) {
          return documents[id].italic.reduce((total, currentValue) => {
            const values = currentValue.map((element, index) => {
              if (index === currentValue.length - 1) element += 1;
              total = [total.slice(0, element), "*", total.slice(element)].join(
                ""
              );
              return total;
            });
            return values[values.length - 1];
          }, documents[id].content);
        }
        return documents[id].content;q
      }
      return documents[id].content;
    }
    return 404;
  },
  delete: argumets => {
    const [documentName] = argumets;
    const id = documentName.replace(/\n$/, "");
    if (id in documents) {
      delete documents[id];
      return 200;
    }
    return 404;
  },
  format: argumets => {
    const [documentName, startPosition, endPosition, typeOfStyle] = argumets;
    const id = documentName.replace(/\n$/, "");
    const style = typeOfStyle.replace(/\n$/, "");
    if (id in documents) {
      if (documents[id][style])
        documents[id][style] = [
          ...documents[id][style],
          [parseInt(startPosition), parseInt(endPosition)]
        ];
      else
        documents[id][style] = [
          [parseInt(startPosition), parseInt(endPosition)]
        ];
      return 200;
    }
    return 404;
  },
  help: () => `
 __        
 (_ |o_|_ _ 
 __)|| |_(/_.com
                 
  Commands:
  * Create document: create:nameofdoc
  * Insert content: insert:{nameofdoc}:({position}:){text}
  * Insert content ant the end: insert:{nameofdoc}:{text}
  * Format at position: format:{nameofdoc}:{positionStart}:{positionEnd}:{style}
  * Get Document in txt or md: get:{nameofdoc}:{format}
  * Delete document: delete:{nameofdoc}
  `
};
