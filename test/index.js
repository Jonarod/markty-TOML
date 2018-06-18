import { expect } from 'chai'
// import marktyTOML, {setWithPath} from '../src'
import marktyTOML from '../src'

describe('marktyTOML()', () => {
	describe('Simple', () => {
        it('parses with quote', () => {
            var input = 'key = "value"'
            var output = {"key": "value"}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('parses without quotes', () => {
            var input = 'key = value'
            var output = {"key": "value"}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('Allows spaced keys', () => {
            var input = 'spaced key = value'
            var output = {"spaced key": "value"}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('Trim down leading and trailing spaces', () => {
            var input = '       spaced key      =       value         '
            var output = {"spaced key": "value"}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('Keeps leading and trailing spaces with double-quotes', () => {
            var input = '"       spaced key     " = "      value         "'
            var output = {"       spaced key     ": "      value         "}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('parses keys with quotes', () => {
            var input = '"key" = value'
            var output = {"key": "value"}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('parses with colon', () => {
            var input = 'key : value'
            var output = {"key": "value"}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('parses with array', () => {
            var input = 'abc = ["one", "two", "three"]'
            var output = {"abc": ["one", "two", "three"]}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('parses without quotes', () => {
            var input = 'abc = baby you and me giiiiiirl'
            var output = {"abc": "baby you and me giiiiiirl"}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
				it('single line comments', () => {
						var input = '# This is a comment'
						var output = {}
						expect(marktyTOML(input)).to.deep.equal(output)
				})
    })
    describe('Data types', () => {
        it('parses string with double quotes', () => {
            var input = 'hello = "world"'
            var output = {"hello": "world"}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('parses string witout double quotes', () => {
            var input = 'hello = world'
            var output = {"hello": "world"}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('parses paragraphs', () => {
            var input = `hello = "this should be a long long paragraph including
            line breaks here
            and here
            but let\'s just pretend ok ?"`
            var output = {"hello": "this should be a long long paragraph including\n            line breaks here\n            and here\n            but let\'s just pretend ok ?"}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('parses integer', () => {
            var input = 'twenty-seven = 27'
            var output = {"twenty-seven": 27}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('parses float', () => {
            var input = 'twenty-seven = 27.15670'
            var output = {"twenty-seven": 27.15670}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('parses signed numbers', () => {
            var input = 'minus-twenty-seven = -27\nplus-twenty-seven = +27\nminus-pi = -3.14\nplus-pi = +3.14'
            var output = {"minus-twenty-seven": -27, "plus-twenty-seven" : 27, "minus-pi": -3.14, "plus-pi" : 3.14}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('parses infinite', () => {
            var input = 'plus-infinite = +inf\ninfinite = inf\nminus-infinite = -inf'
            var output = {"plus-infinite": Infinity, "infinite": Infinity, "minus-infinite": -Infinity}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('parses hexadecimal', () => {
            var input = 'hex1 = 0xDEADBEEF\nhex2 = 0xdeadbeef'
            var output = {"hex1": 0xDEADBEEF, "hex2": 0xdeadbeef}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('parses octals', () => {
            var input = 'oct1 = 0o01234567\noct2 = 0o755'
            var output = {"oct1": 0o01234567, "oct2": 0o755}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('parses binary', () => {
            var input = 'bin = 0b11010110'
            var output = {"bin": 0b11010110}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('parses array of array', () => {
            var input = 'arr-arr = [["a","b"], [1,2]]'
            var output = {"arr-arr" : [["a","b"], [1,2]]}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('parses object as value', () => {
            var input = 'json = {"key" : "value"}'
            var output = {"json" : {"key" : "value"}}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('parses dates', () => {
            var input = 'a-long-time-ago = 1979-05-27T07:32:00Z'
            var output = {"a-long-time-ago": "1979-05-27T07:32:00Z"}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('parses true', () => {
            var input = 'yes = true'
            var output = {"yes": true}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('parses false', () => {
            var input = 'no = false'
            var output = {"no": false}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('parses arrays of double-quoted strings', () => {
            var input = `eatWith : ["spoon", "fork", "hands"]`
            var output = {"eatWith" : ["spoon", "fork", "hands"]}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('parses arrays of numbers', () => {
            var input = `count : [1, 2, 3.14]`
            var output = {"count" : [1, 2, 3.14]}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('parses arrays of mixed numbers and double-quoted strings', () => {
            var input = `count : ["one", 2, 3.14]`
            var output = {"count" : ["one", 2, 3.14]}
            expect(marktyTOML(input)).to.deep.equal(output)
        })

        it('starter example', () => {
            var input = `
                type = "cakes"
                delicious = true
                eatWith = ["spoon", "fork", "hands"]

                [cake-1]
                name = "you don't want to know..."

                [cake-1.ingredients]
                eggs = 6
                milk = "0.5L"

                [cake-2]
                name : "something"

                [cake-2.ingredients]
                eggs = 6
                milk = "0.5L"
                special = "secret"
                `
            var output = {
                "cake-1": {
                    "ingredients": { "eggs": 6, "milk": "0.5L"},
                    "name": "you don't want to know..."
                },
                "cake-2": {
                    "ingredients": { "eggs": 6, "milk": "0.5L", "special": "secret"},
                    "name": "something"
                },
                "delicious": true,
                "eatWith": ["spoon", "fork", "hands"],
                "type": "cakes"
            }

            expect(marktyTOML(input)).to.deep.equal(output)
        })

				it('single line comments', () => {
						var input = `
						key1 = val1
						# This is a comment
						#This is a comment
						# [comment]
						[test]
						#[comment]
						key2 = val2
						# this = comment
						#this = comment
						   #this = comment
						key3 = val3`

						var output = {"key1":"val1", "test":{"key2":"val2", "key3":"val3"}}
						expect(marktyTOML(input)).to.deep.equal(output)
				})


        // it('parses arrays UNquoted strings', () => {
        //     var input = `count : [one, two, three]`
        //     var output = {"count" : ["one", "two", "three"]}
        //     expect(marktyTOML(input)).to.deep.equal(output)
        // })
    })
	describe('Intermediary', () => {
        it('Handles multiples lines', () => {
            var input = `line1 = I am line 1
                         line2 = I am line 2

                         line3 = I am line 3`
            var output = {"line1": "I am line 1", "line2": "I am line 2", "line3": "I am line 3"}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('Handles blocks', () => {
            var input = 'line1 = I am line 1\nline2 = I am line 2\n[block]\nline3 = I am line 3'
            var output = {"line1": "I am line 1", "line2": "I am line 2", "block":{"line3":"I am line 3"}}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('Handles blocks with spaced keys', () => {
            var input = `
                line1 = I am line 1
                line2 = I am line 2

                [spaced key.spaced sub key]
                line3 = I am line 3
                `
            var output = {"line1": "I am line 1", "line2": "I am line 2", "spaced key":{"spaced sub key":{"line3":"I am line 3"}}}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('Trims down leading and trailing spaces', () => {
            var input = `
                [    spaced key.spaced sub key    ]
                line3 = I am line 3
                `
            var output = {"spaced key":{"spaced sub key":{"line3":"I am line 3"}}}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('Allows dot to be surrounded by spaces too', () => {
            var input = `
                [    spaced key  .   spaced sub key    ]
                line3 = I am line 3
                `
            var output = {"spaced key":{"spaced sub key":{"line3":"I am line 3"}}}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('Keeps keys as is when surrounded by double quotes', () => {
            var input = `
                ["    spaced key  "."   spaced sub key    "]
                line3 = I am line 3
                `
            var output = {"    spaced key  ":{"   spaced sub key    ":{"line3":"I am line 3"}}}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('Handles blocks with indentation', () => {
            var input = `
            line1 = I am line 1
            line2 = I am line 2

                [block1]
                line3 = I am line 3

                [block2]
                line4 = I am line 4
                `
            var output = {"line1": "I am line 1", "line2": "I am line 2", "block1":{"line3":"I am line 3"}, "block2":{"line4":"I am line 4"}}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('Handles nested blocks', () => {
            var input = `
            line1 = I am line 1
            line2 = I am line 2

                [this]
                line3 = I am line 3

                [this.is.nested]
                line4 = I am line 4
                `
            var output = {"line1": "I am line 1", "line2": "I am line 2", "this":{"line3":"I am line 3", "is":{"nested":{"line4":"I am line 4"}}}}
            expect(marktyTOML(input)).to.deep.equal(output)
        })
    })
	describe('Advanced', () => {
        it('Handles array of tables', () => {
            var input = `
            [[products]]
            name = "Hammer"
            sku = 738594937

            [[products]]

            [[products]]
            name = "Nail"
            sku = 284758393
            color = "gray"
            `
            var output = {
                "products": [
                    { "name": "Hammer", "sku": 738594937 },
                    { },
                    { "name": "Nail", "sku": 284758393, "color": "gray" }
                ]
            }
            expect(marktyTOML(input)).to.deep.equal(output)
        })
        it('Handles official array of tables examples', () => {
            var input = `
            [[fruit]]
            name = "apple"

            [fruit.physical]
              color = "red"
              shape = "round"

            [[fruit.variety]]
              name = "red delicious"

            [[fruit.variety]]
              name = "granny smith"

            [[fruit]]
            name = "banana"

            [[fruit.variety]]
              name = "plantain"
            `
            var output = {
                "fruit": [
                  {
                    "name": "apple",
                    "physical": {
                      "color": "red",
                      "shape": "round"
                    },
                    "variety": [
                      { "name": "red delicious" },
                      { "name": "granny smith" }
                    ]
                  },
                  {
                    "name": "banana",
                    "variety": [
                      { "name": "plantain" }
                    ]
                  }
                ]
            }

            expect(JSON.stringify(marktyTOML(input))).to.deep.equal(JSON.stringify(output))
        })
        it('More complete examples 1', () => {
            var input = `
            title = "TOML Example"

            [owner]
            name = "Tom Preston-Werner"
            organization = "GitHub"
            bio = "GitHub Cofounder & CEO\n\tLikes \'tater tots\' and beer and backslashes: \\"
            dob = 1979-05-27T07:32:00Z

            [database]
            server = "192.168.1.1"
            ports = [ 8001, 8002, 8003 ]
            connection_max = 5000
            connection_min = -2
            max_temp = 87.1
            min_temp = -17.76
            enabled = true

            [servers]

            [servers.alpha]
            ip = "10.0.0.1"
            dc = "eqdc10"

            [servers.beta]
            ip = "10.0.0.2"
            dc = "eqdc10"
            `
            var output = {
                "title": "TOML Example",
                "owner": {
                  "name": "Tom Preston-Werner",
                  "organization": "GitHub",
                  "bio": "GitHub Cofounder & CEO\n\tLikes \'tater tots\' and beer and backslashes: \\",
                  "dob": "1979-05-27T07:32:00Z"
                },
                "database": {
                  "server": "192.168.1.1",
                  "ports": [8001, 8002, 8003],
                  "connection_max": 5000,
                  "connection_min": -2,
                  "max_temp": 87.1,
                  "min_temp": -17.76,
                  "enabled": true
                },
                "servers": {
                  "alpha": {
                    "ip": "10.0.0.1",
                    "dc": "eqdc10"
                  },
                  "beta": {
                    "ip": "10.0.0.2",
                    "dc": "eqdc10"
                  }
                }
            }

            expect(marktyTOML(input)).to.deep.equal(output)
        })
    })
        // describe('Append to Object', () => {
    //     it('appends in empty', () => {
    //         var pathKey = "hello"
    //         var value = "world"
    //         var tree = {}
    //         var output = {"hello": "world"}
    //         expect(setWithPath(pathKey, value, tree)).to.deep.equal(output)
    //     })
    //     it('appends in existing tree', () => {
    //         var pathKey = "hello"
    //         var value = "world"
    //         var tree = {"nano":"micro"}
    //         var output = {"nano":"micro", "hello": "world"}
    //         expect(setWithPath(pathKey, value, tree)).to.deep.equal(output)
    //     })
    //     it('appends nested', () => {
    //         var pathKey = "nano.hello"
    //         var value = "world"
    //         var tree = {"nano":"micro"}
    //         var output = {"nano":{"hello": "world"}}
    //         expect(setWithPath(pathKey, value, tree)).to.deep.equal(output)
    //     })
    //     it('adds entry aside if key exists', () => {
    //         var pathKey = "nano.hello"
    //         var value = "world"
    //         var tree = {"nano":{"serve":"peacock"}}
    //         var output = {"nano":{"serve":"peacock", "hello":"world"}}
    //         expect(setWithPath(pathKey, value, tree)).to.deep.equal(output)
    //     })
    //     it('long nesting', () => {
    //         var pathKey = "this.key.is.very.very.hidden.down.the.tree"
    //         var value = "added !"
    //         var tree = {}
    //         var output = {"this":{"key":{"is":{"very":{"very":{"hidden":{"down":{"the":{"tree":"added !"}}}}}}}}}
    //         expect(setWithPath(pathKey, value, tree)).to.deep.equal(output)
    //     })
    // })

})
