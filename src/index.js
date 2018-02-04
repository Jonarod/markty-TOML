/*eslint no-unused-vars: 1*/
import markty from 'markty'

export default function marktytoml (TOML) {
    let tomlBlocks = '^\\s*\\[(\\[)?\\"?(.*?)\\"?\\]\\]?(?= *$)((?:[\\w\\W](?!^\\s*\\[))*)'
    let matchThis = new RegExp(`${tomlBlocks}`, 'gm')
    let json = {}
    TOML = TOML[0] === "[" ? TOML : "[]\n"+TOML

    markty(TOML, matchThis, (string, match) => {
        let [token, header_array, header_path, body] = match

        if (header_array){  // header is like [[grand.parent]]
            // @TODO: Should implement array blocks
        }
        else if (header_path === ""){ // header is like []
            json = Object.assign({}, json, parseBody(body))
        }
        else {  // header is like [grand.parent]
            setWithPath(header_path, parseBody(body), json )
        }

    })

    return json
}

function parseBody (TOML) {
    let tomlLines = '^ *([^\\s]+) *[=:] *"((?!")[\\w\\W]+?)"|^ *([^\\s]+) *[=:] *\\[((?!\\])[\\w\\W]+?)\\]|^ *([^\\s]+) *[=:] *(.+) *'
    let tomlHeaders = '^ *\\[(\\[)?\\"?(.*?)\\"?\\]\\]?(?= *$)'
    let matchThis = new RegExp(`${tomlLines}|${tomlHeaders}|^(.+)$`, 'gm')

    let json = {}

    markty(TOML, matchThis, (string, match) => {
        let [token,
            key_1, val_quotes,
            key_2, val_array,
            key_3, val_noquotes,
            header_double, header,
            trash
        ] = match, k, v

        if (key_1 || key_2 || key_3){
            k = key_1 || key_2 || key_3
            if (val_quotes) {v = val_quotes }
            if (val_array) {
                v = JSON.parse(`[${val_array}]`)
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
                else { v = val_noquotes }
            }        
            json[k] = v
            return ''
        }
        else if (header) return header_double ? '[["'+header+'"]]'  + '<br />': '["'+header+'"]' + '<br />'
        // If a user puts a value on multiple lines (using line-breaks), WITHOUT using double-quotes
        // everything coming after the line-break is trash
        else if (trash) return ''
    })

    return json
}

function setWithPath (pathKey, value, tree) {
    pathKey = ["."].indexOf(pathKey) === 0 ? pathKey : "." + pathKey // append dot to corrrectly split
    let keys = pathKey.split('.').slice(1)
    let currentKey = keys.shift()  // take out first element in array: removes it from the array as well 
    let nextPath = keys.join('.') // prepare new path for next iteration
    let found = (currentKey in tree)
    let keysLeft = keys.length > 0
    let currentNode = {}

    if (keysLeft){
        if ( !found ){
            tree[currentKey] = setWithPath(nextPath, value, currentNode)
        } else {
            currentNode = tree[currentKey] 
            currentNode = (currentNode !== null && typeof currentNode === 'object') ? currentNode : {}
            tree[currentKey] = setWithPath(nextPath, value, currentNode)
        }
        return tree
    } else {
        tree[currentKey] = value
        return tree
    }
} 

// export {setWithPath}