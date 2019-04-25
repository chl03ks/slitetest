# Slite Dev Test
The goal is to create a TCP server in Node.js that can store, update and display simple note with formatting.

## Example
The following commands:
```
> create:doca
> insert:doca:0:Hello
> format:doca:0:5:bold
> insert:doca:5: World!\n
> get:doca:md
```

Will output:
```
**Hello** World!

```

## Setup
* Add your code under the `src/` folder (index.js will be the entry point)
* Follow the instructions here https://slite.com/api/s/2bHnWJreoXNoVqotPi9Mci
* Run `npm install`
* Run your TCP server on `localhost:1337`
* Run `npm test`
* If all tests are passing, you succeeded 👏