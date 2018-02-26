/*eslint no-unused-vars: 1*/
import markty from 'markty'

export default function marktytoml (TOML) {
    let tomlBlocks = '^\\s*\\[(\\[)?(.*?)\\]\\]?(?= *$)((?:[\\w\\W](?!^\\s*\\[))*)'
    let matchThis = new RegExp(`${tomlBlocks}`, 'gm')
    let json = {}
    TOML = TOML[0] === "[" ? TOML : "[]\n"+TOML

    markty(TOML, matchThis, (string, match) => {
        let [token, header_array, header_path, body] = match

        if (header_array){  // header is like [[grand.parent]]
            // @TODO: Should implement array blocks
            setWithPath(json, header_path, parseBody(body), true)
        }
        else if (header_path === ""){ // header is like []
            json = Object.assign({}, json, parseBody(body))
        }
        else {  // header is like [grand.parent]
            setWithPath(json, header_path, parseBody(body), false)
        }

    })

    return json
}

function parseBody (TOML) {
    let matchThis = new RegExp(`^ *(.+?) *[=:] *(?:"((?!")[\\w\\W]+?)"|(\\[[\\w\\W]+?(?:(?: *])+ *$\\n*)+)|(\\{[\\w\\W]+?(?:(?: *})+ *$\\n*)+)|(.+) *)|^(.+)$`, 'gm')

    let json = {}

    markty(TOML, matchThis, (string, match) => {
        let [token,
            key, 
            val_quotes, val_array, val_json, val_noquotes,
            trash
        ] = match, k, v

        if (key){
            k = key.charAt(0) === "\"" && key.charAt(key.length-1) === "\"" ? key.slice(1, -1) : key
            if (val_quotes) {v = val_quotes }
            if (val_array || val_json) {
                v = JSON.parse(`${val_array || val_json}`)
            }
            // val_noquotes is important: it is a value NOT surrounded by double-quotes
            if (val_noquotes) {
                if (+val_noquotes === +val_noquotes){ v = Number(val_noquotes)}
                else if (val_noquotes === 'true'){ v = true }
                else if (val_noquotes === 'false'){ v = false }
                else if (val_noquotes === 'inf' || val_noquotes === '+inf'){ v = Infinity }
                else if (val_noquotes === '-inf'){ v = -Infinity }
                else if (parseInt(val_noquotes, 16).toString(16) === val_noquotes.toLowerCase() ){ v = parseInt(val_noquotes, 16) }
                else if (parseInt(val_noquotes, 8).toString(8) === val_noquotes.toLowerCase() ){ v = parseInt(val_noquotes, 8) }
                else if (parseInt(val_noquotes, 2).toString(2) === val_noquotes.toLowerCase() ){ v = parseInt(val_noquotes, 2) }
                // else if (dateRegex) {
                //     /(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?([Z+-])?(?:(\d{1,2}):(\d{2}))?/
                // }
                else { v = val_noquotes }
            }        
            json[k] = v
            return ''
        }
        // If a user puts a value on multiple lines (using line-breaks), WITHOUT using double-quotes
        // everything coming after the line-break is trash
        else if (trash) return ''
    })

    return json
}

function setWithPath(obj, keys, val, asArray) { 
	// asArray = asArray ? true : false
	keys.split && (keys=keys.split('.'))
	var i=0, l=keys.length, t=obj, x
	for (; i < l; ++i) {
  
        if (t instanceof Array){x = t[t.length-1]; i--} else { x = t[keys[i]] }
 
        if (i === l-1) {
          x instanceof Array ? t[keys[i]].push(val) : (t[keys[i]]=asArray?[val]:val)
        }
        else {
            x instanceof Array ? ( t = x ) : (t = t[keys[i]] = (x == null ? {} : x))          
        }
        
	}
}