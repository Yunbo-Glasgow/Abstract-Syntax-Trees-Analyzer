function isValidExpression(expression) {
    const regex = /^[+\-*/0-9\s()]+$/;
    return regex.test(expression);
}

function buildTree() {
    const expression = document.getElementById('expression').value;
    if (!isValidExpression(expression)) {
        alert('Invalid expression! Please enter a valid math expression.');
        return;
    }
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

function parseExpression(expression) {
    alert(expression)
    return chart_config;
}

