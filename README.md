![npm bundle size](https://img.shields.io/bundlephobia/minzip/encryptio.svg?label=gzipped%20size&style=flat-square)

Simple, yet secure, encryption / decryption using Javascript.

- **ZERO dependencies:** uses `crypto` which natively ships with Node.js without any further install
- **Random:** Encrypted strings are always different *( using Initialization Vector )*
- **Asynchronous:** Promise-based, usable using either `.then()` or `async/await`
- **Options:** support manual algorithms and encodings (see the `Options` section)


# Quick start

`npm install encryptio`


#### Using `.then()`:

```js
var Encryptio = require('encryptio')
// or using ES6:
import Encryptio from 'encryptio'

var my_secret = process.env.SECRET_KEY // See note on "storing the secret key"
var safe = new Encryptio(my_secret); // secret_key should be 32 characters for AES256

var text = 'Hello World'

console.log('Original string: ', text)

safe.encrypt(text).then( encText => {
    console.log('Encrypted string: ', encText)

    safe.decrypt(enText).then( decText => {
        console.log('Decrypted string: ', decText)
    })
})

// > prints:
// Original string: Hello World
// Encrypted string: 6jIW7HfpEaarSm0B/o4qDw==:ch9KL0HyTlASypHQfm/XUg==
// Decrypted string: Hello World
```

#### Using `async/await`:

```js
var Encryptio = require('encryptio')
// or using ES6:
import Encryptio from 'encryptio'

var my_secret = process.env.SECRET_KEY // See note on "storing the secret key"
var safe = new Encryptio(my_secret); // secret_key should be 32 characters for AES256

var main = async function(){
    var text = 'Hello World'
    console.log('Original string: ', text)

    var encText = await safe.encrypt(text)
    console.log('Encrypted string: ', encText)

    var decText = await safe.encrypt(encText)
    console.log('Encrypted string: ', decText)
}

main()

// > prints:
// Original string: Hello World
// Encrypted string: 6jIW7HfpEaarSm0B/o4qDw==:ch9KL0HyTlASypHQfm/XUg==
// Decrypted string: Hello World
```


# Options

By default, `encryptio` uses `aes_256_cbc` algorithm to encrypt strings and `base64` to encode them.

Both options are manually configurable. Just pass an object to the `Encryptio` constructor, like so:

```js
var custom_options = {
    algorithm: 'aes256',
    encoding: 'hex'
}

var safe = new Encryptio(process.env.SECRET_KEY, custom_options);
```

Here are some options:

##### algorithm

- `aes-256-cbc` **(default)** : requires a 32 byte secret key
- `aes256` : requires a 32 byte secret key
- `aes-192-cbc` : requires a 24 byte secret key
- `aes192` : requires a 24 byte secret key
- `aes-128-cbc` : requires a 16 byte secret key
- `aes128` : requires a 16 byte secret key

##### encoding

- `base64` **(default)**
- `hex`
- `binary`


# Note on storing the secret key

**!! NEVER PUT YOUR SECRET KEY IN YOUR CODE !!**

**!! NEVER PUT YOUR SECRET KEY IN YOUR CODE !!**

**!! NEVER PUT YOUR SECRET KEY IN YOUR CODE !!**


> It is strongly recommended to store any private key or secret localy (on a secured machine...) and never send these to the cloud or even to git or even to team mates. Here are 3 recommended ways to store them:


### Quick and dirty

Export a variable in your terminal before `node`:

```bash
SECRET_KEY=1234567890098765432112 node index.js
```
Then in your code (here `index.js` as an example), you can call your variable like this:

```js
// index.js
// ...
var my_secret = process.env.SECRET_KEY
// ...
```

### Using `direnv` (recommended)

[direnv](https://direnv.net/) solves this problem quite nicely. First you install `direnv` (just go and follow the steps in `direnv` docs). Then, at the root of your project, you can create a file named `.envrc` and put your secrets like so:

```bash
# in your .envrc
export SECRET_KEY=1234567890098765432112
```

Then in your code (here `index.js` as an example), you can call your variable like this:

```js
// in your index.js
// ...
var my_secret = process.env.SECRET_KEY
// ...
```

**CAUTION:** Please, make **100% sure** that your `.envrc` is never sent to git or anywhere. It should just be kept secret in your machine. So, do not forget to update your `.gitignore` file accordingly:

```bash
# in your .gitignore
# exclude direnv file
.envrc
```

### Using `dotenv`

[dotenv](https://github.com/motdotla/dotenv) does somewhat the same thing as `direnv` but has to be explicitly added to your code.

First create a `.env` file at the root of your project:

```
SECRET_KEY=1234567890098765432112
```

then install `dotenv`

`npm i dotenv --save`

finally in your code, import `dotenv`, and get your vars:

```js
// in your index.js
require('dotenv').config()

var my_secret = process.env.SECRET_KEY
```

**CAUTION:** Please, make **100% sure** that your `.env` is never sent to git or anywhere. It should just be kept secret in your machine. So, do not forget to update your `.gitignore` file accordingly:

```bash
# in your .gitignore
# exclude dotenv file
.env
```


# How secure is this ?

##### DOs

You can safely use the lib to encrypt low to highly confidential things.

**!! USE A REALLY RANDOM SECRET KEY !!**

Just to recap, here are some common things adressed:

- This is `AES-256-CBC` by default. One cool thing about it is that the encryption is not made by blocks of words but rather given the whole string. So it is not possible to statistically count word/letter frequences against the encrypted string.

- `AES-256-CBC` enforces a 32 bytes long secret key composed of any characters. It would require billions of billions of years to try all possibilities of the secret key. That beinng said, if your secret key is `00000000000000000000000000000000` it may take only 2 minutes... since any brute-force program might just start with zeros, then `12345...` then dictionnaries... So make it crazy random !

- Since `encryptio` uses a random Initilization Vector, several encryption of the same string will always output a new encrypted string. This means that an attacker cannot compare two encrypted strings in the hope to find patterns.

Really, unless you pick a dumb easy secret-key and/or blindly distribute it to the cloud... you should be able to sleep peacefully. It would require a considerable amount of efforts and money to break this encryption.


##### DONTs

Let's face it, if you plan to use this lib to encrypt political, highly pricey secrets, or the name of who killed JFK... that may not be a good idea.

Like exposed in the `DOs` section above, this is not a bulletproof solution. The main reason being... YOU. You are more likely to fail keeping the secret key than someone breaking the `AES` encryption. For example, if you choose a weak predictable secret key... brute force can quickly take your secret down.

One common mistake might also be to trust other 3rd parties like team mates, co-workers, or applications that might just also neglect your secret until... some attacker gets it.

Finally, if you store a secret key that gives a $200 billion price... someone might actually put $100 billion to the table to buy sufficient computing power to crack your secret. Who knows?

##### Summary

**!! USE A REALLY RANDOM SECRET KEY !!**

**!! NEVER SHARE IT... LIKE NEVER EVER EVER !!**

...and you'll be cool ;)