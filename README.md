:microscope: Nano implementation of [TOML](https://github.com/toml-lang/toml) using [Markty](https://github.com/Jonarod/markty).

# Demo

:eyes: **[Try the live converter here](https://jsfiddle.net/sL9ssuch/3/)** :eyes:


# Quick start

#### For Node

`npm install markty-toml`

```js
var toml = require('markty-toml')
// or using ES6:
import toml from 'markty-toml'

const someTOML = `
key = "value"

[deeply.nested.key]
secret = "Shhhhh"
`

console.log( toml(someTOML) )

// > prints:
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
1. Observe the URL [here](https://unpkg.com/markty-toml) and see the latest version used after `@` like `@0.0.5`.
2. Just modify the URL to get something like this: `https://unpkg.com/markty-toml@0.0.5/dist/martytoml.umd.js`

Then just import it normally :

```html
<script type="text/javascript" src="https://unpkg.com/markty-toml@0.0.5/dist/martytoml.umd.js"></script>
```
Then the exported name is `marktytoml()`, so you can just:

```js
<script>
var someTOML = 'key = "value"\n[deeply.nested.key]\nsecret = "Shhhhh"';
console.log( marktytoml(someTOML) )
</script>

// > prints:
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

## FEATURES
- :microscope: **Ridiculously SMALL:**: 100 LOC, 800 bytes gzipped
- :zap: Blazing fast  :zap: see **benchmarks**
- **Use any of colon or equal sign:** `key : value` works the same as `key = value`
- **Single-line text withOUT double-quotes:** `key = single line without double-quotes allowed`
- **Multi-line text with double-quotes:** `key = "Multilined paragraphs with line breaks like this \n\n\n should be enclosed with double-quotes"`
- **Basic native data types** (should not be enclosed by double-quotes):
    - [x] strings like `hello world`
    - [x] integers like `1`, `2`, `3`...
    - [x] float like `3.14`
    - [x] boolean like `true`, `false`
    - [x] signed numbers like `+27`, `-23`
    - [x] infinity like `+inf`, `inf`, `-inf`
    - [x] hexadecimals like `0xDEADBEEF`
    - [x] octals like `0o01234567`, `0o755`
    - [x] binaries like `0b11010110`
    - [x] dates like `1979-05-27T00:32:00-07:00`, `1979-05-27`
- **Complex objects objects** as value:
    - [x] array of values like `stuff = ["one", "two", "three"]`
    - [x] array of arrays like `stuff = [[1,2], ["a","b"]]`
    - [x] inline tables like `stuff = {"key" : "value"}` 

- **Tables:**
    ```
    [sub.sub]
    key = value
    ```
- **Array of tables:**
    ```
    [[sub.sub]]
    key = value1

    [[sub.sub]]
    key = value2
    ```
- **Spaced keys** when surrounded by double quotes like `"spaced key here" = value`

# Example

```
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

## NOTES
- :baby: Even though a lot of [tests](https://github.com/Jonarod/markty-TOML/tree/master/test/index.js) have been implemented, this project is still at baby stage, and has not been battle tested in production.
- Not TOML v0.4 compliant **and not meant to be**. For instance, here are UNsupported specs:
    - There is no errors mechanism to print from.
    - Comments are not handled
    - Handling colons `:` as key/value separator is not allowed in TOML v0.4 (only `=` supported)
    - Handling strings without `"` is not allowed in TOML v0.4 (strings must be enclosed by `"`)
- `markty-TOML` considers any TOML source like a **database log**:
    - when two identical nodes are set, the last one **REPLACES** the first: TOML sources are treated like a list of updates which AFTER PARSING returns a final state. This clearly goes against official TOML specs which aims to parse a given source as a **final database state**: thus two identical nodes would throw an error for the whole source.
    - The nature of `markty-TOML` makes comments out of the scope and are unlikely to be implemented (if compulsory, comments can be set as a normal entries anyway...)


# Benchmarks

| Test | Observations | markty-TOML | [node-toml][1] |
|:-----|:-------------|------------:|---------------:|
| gzipped size |      |   **800 b** |        9.000 b |
| v0.4 compliant ? |  | :heavy_multiplication_x: | **:heavy_check_mark:** |
| **Parsing tests:**                                 |
| [simple_kv][5] | [link to bench][2] | **116,630 ops/s** | 8,134 ops/s |
| [simple_block][6] | [link to bench][3] | **73,593 ops/s** | 2,838 ops/s |
| [classic_config][7] | [link to bench][4] | **10,447 ops/s** | 233 ops/s |


[1]: https://github.com/BinaryMuse/toml-node
[2]: https://jsbench.me/96jd9g78vn/2
[3]: https://jsbench.me/cujd9gya1l/1
[4]: https://jsbench.me/txjd9h2y7d/2
[5]: https://github.com/Jonarod/markty-TOML/tree/master/benchmarks/simple_kv.toml
[6]: https://github.com/Jonarod/markty-TOML/tree/master/benchmarks/simple_block.toml
[7]: https://github.com/Jonarod/markty-TOML/tree/master/benchmarks/classic_config.toml

