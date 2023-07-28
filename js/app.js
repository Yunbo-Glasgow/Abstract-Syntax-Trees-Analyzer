function isValidExpression(expression) {
    const regex = /^[+\-*/0-9\s()]+$/;
    return regex.test(expression);
}

function buildTree() {
    let expression = document.getElementById('expression').value;
    if (!isValidExpression(expression)) {
        alert('Invalid expression! Please enter a valid math expression.');
        return;
    }

    // 去掉字符串间字符的空格
    const stringWithoutSpaces = expression.replace(/\s+/g, '');
    // 将每个字符间仅相隔一个空格
    const formattedString = stringWithoutSpaces.replace(/(.)/g, '$1 ');
    expression = formattedString.trim(); // 去掉首尾空格

    const treeData = parseExpression(expression);
    new Treant(treeData);
}

var chart_config = {
    chart: {
        container: "#tree-container",
        animateOnInit: true,
        node: {
            collapsable: true
        },
        animation: {
            nodeAnimation: "easeOutBounce",
            nodeSpeed: 700,
            connectorsAnimation: "bounce",
            connectorsSpeed: 700
        }
    },
    nodeStructure: {
        text: {
            name: "+",
        },
        children: [

        ],
    },
};

class Text {
    constructor(value) {
        this.name = value;
    }
}

class NodeStructure {
    constructor(value) {
        this.text = new Text(value);
        this.children = [];
    }
}

function parseExpression(expression) {
    const arr = infixToPrefix(expression);
    const stack = [];

    for (let i = arr.length - 1; i >= 0; i--) {
        const token = arr[i];

        if (!isOperator(token)) {
            // If the token is a number, create a leaf node and push it to the stack
            stack.push(new NodeStructure(token));
        } else {
            // If the token is an operator, create a new node, assign its left and right children from the stack, and push it back to the stack
            const operatorNode = new NodeStructure(token);
            operatorNode.children.push(stack.pop());
            operatorNode.children.push(stack.pop());
            stack.push(operatorNode);
        }
    }

    chart_config.nodeStructure = stack.pop();
    return chart_config;
}

function isOperator(char) {
    return char === '+' || char === '-' || char === '*' || char === '/';
}

function precedence(operator) {
    if (operator === '+' || operator === '-') {
        return 1;
    } else if (operator === '*' || operator === '/') {
        return 2;
    }
    return 0;
}

function infixToPrefix(expression) {
    const operatorsStack = [];
    const prefixExpression = [];
    const tokens = expression.split('').filter((token) => token !== ' ');

    for (let i = tokens.length - 1; i >= 0; i--) {
        const token = tokens[i];

        if (!isNaN(parseFloat(token))) {
            // If the token is a number, add it to the prefix expression
            prefixExpression.push(token);
        } else if (isOperator(token)) {
            // If the token is an operator, handle it with the operators stack
            while (
                operatorsStack.length > 0 &&
                precedence(operatorsStack[operatorsStack.length - 1]) >= precedence(token)
            ) {
                prefixExpression.push(operatorsStack.pop());
            }
            operatorsStack.push(token);
        } else if (token === ')') {
            // Handle closing parenthesis
            operatorsStack.push(token);
        } else if (token === '(') {
            // Handle opening parenthesis
            while (operatorsStack.length > 0 && operatorsStack[operatorsStack.length - 1] !== ')') {
                prefixExpression.push(operatorsStack.pop());
            }
            operatorsStack.pop(); // Pop the closing parenthesis from the stack
        }
    }

    // Push any remaining operators from the stack to the prefix expression
    while (operatorsStack.length > 0) {
        prefixExpression.push(operatorsStack.pop());
    }

    return prefixExpression.reverse();
}

// 示例
// const infixExpression = "3 + 4 * 2 / ( 1 - 5 )";
// const prefixArray = infixToPrefix(infixExpression);
// console.log(prefixArray); // 输出 ["+", "3", "/", "*", "4", "2", "-", "1", "5"]
