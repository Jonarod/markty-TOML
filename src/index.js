/*eslint no-unused-vars: 1*/
import markty from 'markty'


export default function marktytoml (TOML) {
  let matchThis = new RegExp(`^\\s*\\[(\\[)?(.*?)\\]\\]?(?= *$)((?:[\\w\\W](?!^\\s*\\[))*)`, 'gm')
  let json = {}

  // preprocess to assert the string starts with a node like []
  TOML = TOML[0] === "[" ? TOML : "[]\n"+TOML

  // catch edge cases before processing
  TOML = TOML.replace(/('{3,}(?:(?!'{3,})[\w\W]+?)'{3,})/gm, (s, literal)=> {
    // If string literal simulates a header, like [grand.parent], 
    // we should escape it so that the process doesn't think it's a genuine header.
    // Neutralize any line starting with [ and convert it to ⭼[⭺ (to be converted back later)
    if(literal){return literal.replace(/^(\s*)(\[)/gm, '$1__>>[<<__')}
  })

  markty(TOML, matchThis, (string, match) => {
      // let [token, header_array, header_path, body] = match
      // let [  0,        1,            2,      3   ] = match

      if (match[1]){  // header is like [[grand.parent]]
        // @TODO: Should implement array blocks
        setWithPath(json, match[2].trim(), parseBody(match[3]), true)
      }
      else if (match[2] === ""){ // header is like []
        json = Object.assign({}, json, parseBody(match[3]))
      }
      else {  // header is like [grand.parent]
        setWithPath(json, match[2].trim(), parseBody(match[3]), false)
      }

  })

  return  JSON.parse(JSON.stringify(json, replacer), reviver)
}

function parseBody (TOML) {

  let matchThis = new RegExp(`^[ \t]*(.+?) *[=:] *(?:"((?!")[\\w\\W]+?)"|'{3,}((?!'{3,})[\\w\\W]+?)'{3,}|(\\[[\\w\\W]+?(?:(?: *])+ *$\\n*)+)|(\\{[\\w\\W]+?(?:(?: *})+ *$\\n*)+)|(.+) *)|^(.+)$`, 'gm')

  let json = {}

  markty(TOML, matchThis, (string, match) => {
    // let [token (0),
    //   key (1),
    //   val_quotes (2), val_literal (3), val_array (4), val_json (5), val_noquotes (6),
    //   trash (7)
    // ] = match, k, v

    let k, v

    if (match[1]){
      if (match[1].charAt(0) === "#") return
      k = match[1].charAt(0) === '\"' && match[1].charAt(match[1].length-1) === '\"' ? match[1].slice(1, -1) : match[1]
      if (match[2] || match[3]) {
        v = match[2] || match[3].replace(/^(\s*)(__>>\[<<__)/gm, "$1[")
      }
      if (match[4] || match[5]) {
        v = JSON.parse(`${match[4] || match[5]}`)
      }
      // val_noquotes is important: it is a value NOT surrounded by double-quotes
      if (match[6]) {
        match[6] = match[6].trim()
        if (+match[6] === +match[6]){ v = Number(match[6])}
        else if (match[6] === 'true' || match[6] === 'false'){ v = (match[6] === 'true') }
        else if (match[6] === 'inf' || match[6] === '+inf'){ v = Infinity }
        else if (match[6] === '-inf'){ v = -Infinity }
        else if (parseInt(match[6], 16).toString(16) === match[6].toLowerCase() ){ v = parseInt(match[6], 16) }
        else if (parseInt(match[6], 8).toString(8) === match[6].toLowerCase() ){ v = parseInt(match[6], 8) }
        else if (parseInt(match[6], 2).toString(2) === match[6].toLowerCase() ){ v = parseInt(match[6], 2) }
        // else if (dateRegex) {
        //     /(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?([Z+-])?(?:(\d{1,2}):(\d{2}))?/
        // }
        else { v = match[6] }
      }
      json[k] = v
      return ''
    }
    // If a user puts a value on multiple lines (using line-breaks), WITHOUT using double-quotes
    // everything coming after the line-break is trash
    else if (match[7]) return ''
  })

  return json
}

// function sanitizeSpaces(str) {
//   str = str.trim()
//   str = (str.substr(0,1) === '"' && str.substr(-1) === '"') ? str.slice(1,-1) : str
//   return str
// }

function setWithPath(obj, keys, val, asArray) {
	asArray = asArray ? true : false
  keys.split && (keys=keys.split('.'))
	var i=0, l=keys.length, t=obj, x
	for (; i < l; ++i) {

    // sanitize spaces
    keys[i] = keys[i].trim()
    keys[i] = (keys[i].substr(0,1) === '"' && keys[i].substr(-1) === '"') ? keys[i].slice(1,-1) : keys[i]

    if (t instanceof Array){x = t[t.length-1]; i--} else { x = t[keys[i]] }

    if (i === l-1) {
      x instanceof Array ? t[keys[i]].push(val) : (t[keys[i]]=asArray?[val]:val)
    }
    else {
      x instanceof Array ? ( t = x ) : (t = t[keys[i]] = (x == null ? {} : x))
    }
	}
}


let replacer = function(k,v){    
  if (v !== v) { return '__>>NaN<<__' }
  if (v === Infinity) { return '__>>Inf<<__' }
  if (v === -Infinity) { return '__>>-Inf<<__' }
  return v
}

let reviver = function(k,v){
  if (v === '__>>NaN<<__') { return NaN }
  if (v === '__>>Inf<<__') { return Infinity }
  if (v === '__>>-Inf<<__') { return -Infinity }
  return v
}