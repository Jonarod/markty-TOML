:microscope: Nano implementation of [TOML](https://github.com/toml-lang/toml) using [Markty](https://github.com/Jonarod/markty).

:construction: *W.I.P* (see pros/cons) :construction: 


# Demo

:eyes: **[Try the live converter here](https://jsfiddle.net/sL9ssuch/)** :eyes:


# Quick start

#### For Node

`npm install markty-toml`

```js
var toml = require('markty-toml')
// or using ES6:
import toml from 'markty-toml'

const SomeTOML = `
key = "value"

[deeply.nested.key]
secret = "Shhhhh"
`

console.log( toml(CAKES) )

// > prints
// {
//     "key" : "value",
//     "deeply": {
//         "nested": {
//             "key": {
//                 "secret" : "Shhhhh"
//             }
//         }
//     }
// }
```

#### In-Browser

Find latest version [here](https://unpkg.com/markty-toml).

To get the `umd` version:
1. Observe the URL [here](https://unpkg.com/markty-toml) and see the latest version used after `@` like `@0.0.3`.
2. Just modify the URL to get something like this: `https://unpkg.com/markty-toml@0.0.3/dist/martytoml.umd.js`

Then just import it normally :

```html
<script type="text/javascript" src="https://unpkg.com/markty-toml@0.0.3/dist/martytoml.umd.js"></script>
```
Then the exported name is `marktytoml()`, so you can just:

```js
<script>
var someTOML = 'key = "value"\n[deeply.nested.key]\nsecret = "Shhhhh"';
console.log( marktytoml(someTOML) )
</script>

// > prints
// {
//     "key" : "value",
//     "deeply": {
//         "nested": {
//             "key": {
//                 "secret" : "Shhhhh"
//             }
//         }
//     }
// }
```


## CONS
- :baby: Baby stage - EXPLOSIONS MAY HAPPEN :bomb: :bomb: :bomb: #WipPreAlpha
- [ ] Lack of proper :zap: benchmark :zap: against [big players](https://github.com/toml-lang/toml/wiki)
- Not TOML v0.4 compliant. For instance, here are UNsupported things:
    - comments: not in the roadmap for now
    - [ ] array of arrays like `stuff = [[1,2], ["a","b"]]` (known bug)
    - [ ] inline tables like `stuff = {"key" : "value"}` (known bug) 
    - [ ] dates like `1979-05-27T00:32:00-07:00`, `1979-05-27` (already feasible, just WIP)
    - [ ] array of tables like `[[header]]` (already feasible, just WIP)

## PROS
- :microscope: **Ridiculously SMALL:**: 100 LOC, 800 bytes gzipped
- **Handles basic native data types:**
    - [x] strings
    - [x] integers
    - [x] float
    - [x] boolean
    - [x] array of values
    - [x] signed numbers like `+27`, `-23`
    - [x] infinity like `+inf`, `inf`, `-inf`
    - [x] hexadecimals like `0xDEADBEEF`
    - [x] octals like `0o01234567`, `0o755`
    - [x] binaries like `0b11010110`
- :umbrella: **Less error-prone:** can use colons `:` AND `=` sign to separate key/value pairs
- :lollipop: **Reduced overhead:** double quotes `"` can be ommitted in single line strings: use them only to expressely define a phrase with line-breaks. (little gotcha: does not work in array of strings. Srings in arrays should still be surrounded by double-quotes, exactly like the official TOML docs)

e.g:
```js
string = hello I do NOT need double quotes

array = ["I", "still", "need", "double-quotes", "except for", 1, true, 3.14, ":)"]

other : hey look ! I can have a colon instead of an equal sign

sentence = "this is a long sentence
with line breaks
one here
and another here
so I need double quotes"
```

This will correctly parse to :

```js
{
    "string" : "hello I do NOT need double quotes",
    "array" : ["I", "still", "need", "double-quotes", "except for", 1, true, 3.14, ":)"],
    "other" : "hey look ! I can have a colon instead of an equal sign",
    "sentence": "this is a long sentence\nwith line breaks\none here\nand another here\nso I need double quotes"
}
```

