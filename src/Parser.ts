import { Parser } from 'acorn';
import { print } from 'recast';
import { NodeType } from './types';
const ExtendedJsxParser = Parser.extend(require('acorn-jsx')());

export default class JsxParser {
  public readonly parse = (rawJSX: string): NodeType[] => {
    try {
      // TODO: Implement Typings. no typing for acorn-jsx
      const nodes: any = ExtendedJsxParser.parse(`<root>${rawJSX}</root>`);
      const parsedJsx = (nodes?.body?.[0].expression.children || []);
      return parsedJsx.map(this.parseExpression).filter(Boolean);
    } catch (error) {
      throw new Error(`Could not parse the value`);
    }
  };

  public readonly parseExpression = (expression) => {
    switch (expression.type) {
      case 'ArrowFunctionExpression':
        return print(expression).code;
      case 'JSXAttribute':
        return this.parseExpression(expression?.value);
      case 'JSXElement':
        return this.parseElement(expression);
      case 'JSXExpressionContainer':
        return this.parseExpression(expression.expression);
      case 'JSXText':
        return expression.value;
      case 'ArrayExpression':
        return expression.elements.map(this.parseExpression);
      case 'BinaryExpression':
        switch (expression.operator) {
          case '-':
            return (
              this.parseExpression(expression.left) -
              this.parseExpression(expression.right)
            );
          case '!=':
            return (
              this.parseExpression(expression.left) !=
              this.parseExpression(expression.right)
            );
          case '!==':
            return (
              this.parseExpression(expression.left) !==
              this.parseExpression(expression.right)
            );
          case '*':
            return (
              this.parseExpression(expression.left) *
              this.parseExpression(expression.right)
            );
          case '**':
            return (
              this.parseExpression(expression.left) **
              this.parseExpression(expression.right)
            );
          case '/':
            return (
              this.parseExpression(expression.left) /
              this.parseExpression(expression.right)
            );
          case '%':
            return (
              this.parseExpression(expression.left) %
              this.parseExpression(expression.right)
            );
          case '+':
            return (
              this.parseExpression(expression.left) +
              this.parseExpression(expression.right)
            );
          case '==':
            return (
              this.parseExpression(expression.left) ==
              this.parseExpression(expression.right)
            );
          case '===':
            return (
              this.parseExpression(expression.left) ===
              this.parseExpression(expression.right)
            );
        }
      case 'CallExpression':
        const parsedCallee = this.parseExpression(expression.callee);
        return (
          parsedCallee &&
          parsedCallee(...expression.arguments.map(this.parseExpression))
        );
      case 'ConditionalExpression':
        return this.parseExpression(expression.test)
          ? this.parseExpression(expression.consequent)
          : this.parseExpression(expression.alternate);
      case 'Identifier':
        return {};
      case 'Literal':
        return expression.value;
      case 'LogicalExpression':
        const left = this.parseExpression(expression.left);
        if (expression.operator === '||' && left) { return left; }
        if (
          (expression.operator === '&&' && left) ||
          (expression.operator === '||' && !left)
        ) {
          return this.parseExpression(expression.right);
        }
        return false;
      case 'MemberExpression':
        const thisObj = this.parseExpression(expression.object) || {};
        return thisObj[expression.property.name];
      case 'ObjectExpression':
        const object = {};
        expression.properties.forEach((prop) => {
          object[prop.key.name || prop.key.value] = this.parseExpression(
            prop.value
          );
        });
        return object;
      case 'UnaryExpression':
        switch (expression.operator) {
          case '+':
            return expression.argument.value;
          case '-':
            return -1 * expression.argument.value;
          case '!':
            return !expression.argument.value;
        }
        return undefined;
    }
  };

  public readonly parseName = (element) => {
    switch (element.type) {
      case 'JSXIdentifier':
        return element.name;
      case 'JSXMemberExpression':
        return this.parseName(element.object);
    }
  };

  public readonly parseElement = (element) => {
    const { children: childNodes, openingElement } = element;
    const { attributes } = openingElement;
    const component = this.parseName(openingElement.name);

    const children = childNodes
      ?.map(this.parseExpression)
      .filter((c) => c?.component);

    const props: Record<string, any> = {};

    attributes?.forEach((expr) => {
      if (expr.type === 'JSXAttribute') {
        const rawName = expr.name.name;
        const value = this.parseExpression(expr);
        if (value === 'true' || value === 'false') {
          props[rawName] = value === 'true';
        } else {
          props[rawName] = value;
        }
      }
    });

    if (children) {
      props.children = children;
    }
    return { component, ...props, raw: print(element).code };
  };
}
