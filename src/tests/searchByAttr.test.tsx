import { parse, searchByAttr } from './../index';

describe(`searchByAttr test cases`, () => {

	const nodes = parse(`<View>
        <Dummy className="x" />
        <Dummy className="y" />
        <Dummy id={5} />
        <Dummy minLength={4} />
        <Dummy minLength={5} />
        <Dummy minLength={6} />
        <Dummy minLength={7} />
        <Dummy className="box_1" />
        <Dummy className="box_2" />
        <View>
            <Dummy className="box_3" />
            <Dummy className="box_4" />
            <Dummy minLength={8} />
            <Dummy minLength={9} />
        </View>
        <Dummy />
    </View>`);

	test('Searching by unique value should return only one element', () => {
		expect(
			searchByAttr(nodes, (node) => node.className === 'x').length
		).toEqual(1);
		expect(
			searchByAttr(nodes, (node) => node.className === 'y').length
		).toEqual(1);
	});

	test('Search multiple nodes that have minLength attr which is <7', () => {
		expect(searchByAttr(nodes, (node) => node.minLength < 10).length).toEqual(
			6
		);
	});

	test('Search multiple nodes that have minLength attr which is >1 with depth parameter', () => {
		const numberOfNodes = searchByAttr(nodes, (node) => node.minLength > 1, 2)
			.length;
		expect(numberOfNodes).toEqual(4);
	});
});
