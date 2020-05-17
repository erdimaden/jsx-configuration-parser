# JSX Parser
JSX to Object parser.

## Usage
Just need to pass a valid JSX string
```
import { parse } from 'jsx-parser';
const nodes = parse(`<View id="4" />`);
```

`parse` function will return an array of Nodes. 
```
[ { component: 'View', id: 4, children: [], raw: '<View />' } ]
```

## Filtering
You may need a specific components. `searchByAttr` function filters the value with special function. 
```
import { parse, searchByAttr } from 'jsx-parser';
const nodes = parse(`<View>
    <Dummy className="x" />
    <Dummy className="y" />
    <Dummy id={5} />
    <Dummy minLength={8} />
    <View>
        <Dummy minLength={9} />
    </View>
    <Dummy />
</View>`);
console.log(searchByAttr(nodes, (node) => node.className === 'x'))
// Output
[ { component: 'Dummy',
          className: 'x',
          children: [],
          raw: '<Dummy className="x" />' } ]
```




