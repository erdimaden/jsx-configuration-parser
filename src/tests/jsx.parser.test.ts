import JsxParser from '../Parser';

describe('Test Parser functionality', () => {
  const cls = new JsxParser();
  test('Test Binary Expressions', () => {
    const [result] = cls.parse(`<View
      case1={23/1} 
      case2={23+1} 
      case3={23*1}
      case4={23-1} 
      case5={23**1} 
      case6={23%1} 
      case7={23==1} 
      case8={23===1} 
      case9={23!==1}
      case10={23!=1} 
    />`);

    const expectedResults = {
      case1: 23,
      case2: 24,
      case3: 23,
      case4: 22,
      case5: 23,
      case6: 0,
      case7: false,
      case8: false,
      case9: true,
      case10: true,
    };

    Object.keys(expectedResults).forEach((key) => {
      expect(result[key]).toEqual(expectedResults[key]);
    });
  });

  test('Test Conditional Expressions', () => {
    const [result] = cls.parse(
      `<View conditionTrue={true ? 1 : 0} conditionFalse={false ? 1 : 0} />`
    );
    expect(result.conditionTrue).toEqual(1);
    expect(result.conditionFalse).toEqual(0);
  });

  test('Test Unary Expressions', () => {
    const [unaryOperators] = cls.parse(
      `<View undefinedCase={~1} negative={-1} positive={+1} boolean={!false} />`
    );
    expect(unaryOperators.negative).toEqual(-1);
    expect(unaryOperators.positive).toEqual(1);
    expect(unaryOperators.boolean).toEqual(true);
  });

  test('Test Logical Expressions', () => {
    const [result] = cls.parse(
      `<View propFalseOr={0 || 1} propTrueOr={1 || 1} propFalseAnd={0 && 1} />`
    );
    expect(result.propFalseOr).toEqual(1);
    expect(result.propTrueOr).toEqual(1);
    expect(result.propFalseAnd).toEqual(false);
  });

  test('Test Member Expression', () => {
    const [result] = cls.parse(`<View popup={View.Detail} />`);
    expect(result.popup).toEqual(undefined);
  });

  test('Test boolean values', () => {
    const [result] = cls.parse(
      `<View propTrue={"true"} propFalse={"false"} />`
    );
    expect(result.propTrue).toEqual(true);
    expect(result.propFalse).toEqual(false);
  });

  test('Test Jsx usage in props', () => {
    const [result] = cls.parse(
      `<View 
        background={<BackgroundImage />}
        popup={<View.Popup onLoad={evt => props.onLoad(evt)}/>}   
      />`
    );

    expect(result.background.component).toEqual(`BackgroundImage`);
    expect(result.popup.component).toEqual(`View`);
    expect(result.popup.onLoad).toEqual(`evt => props.onLoad(evt)`);
  });
});
