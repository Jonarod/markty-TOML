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
        // it('parses keys with quotes', () => {
        //     var input = '"key" = value'
        //     var output = {"key": "value"}
        //     expect(marktyTOML(input)).to.deep.equal(output)
        // })
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
        // it('parses array of array', () => {
        //     var input = 'arr-arr = [["a","b"], [1,2]]'
        //     var output = {"arr-arr" : [["a","b"], [1,2]]}
        //     expect(marktyTOML(input)).to.deep.equal(output)
        // })
        // it('parses object as value', () => {
        //     var input = 'json = {"key" : "value"}'
        //     var output = {"json" : {"key" : "value"}}
        //     expect(marktyTOML(input)).to.deep.equal(output)
        // })
        // it('parses date', () => {
        //     var input = 'a-long-time-ago = 1979-05-27T07:32:00Z'
        //     var output = {"a-long-time-ago": new Date('1979-05-27T07:32:00Z')}
        //     expect(marktyTOML(input)).to.deep.equal(output)
        // })
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

