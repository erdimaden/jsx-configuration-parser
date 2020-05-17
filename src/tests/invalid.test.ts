import { parse } from './../index';

describe('Invalid cases', () => {
  const message = `Could not parse the value`;

  test('Non-completed tags should raise an error', () => {
    expect(() => {
      parse(`<Invalid component`);
    }).toThrow(message);
  });

  test('Unstructured tags should raise an error', () => {
    expect(() => {
      parse(`<View><Component1></View></Component1>`);
    }).toThrow(message);
  });

  test('Invalid props', () => {
    expect(() => {
      parse(`<View cb={{prop: 'prop'}()} />`);
    }).toThrow(message);
  });
});
