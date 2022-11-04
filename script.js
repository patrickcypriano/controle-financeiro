const transactionsUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text'); // vamos usar para verificar se os dois valores foram passados (Nome)
const inputTransactionAmount = document.querySelector('#amount');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
    transactions = transactions.filter(transaction => transaction.id !== ID);
    updateLocalStorage();
    init();
}

//Vai realizar o envio para a listagem das transações, para que elas sejam listadas
const addTransactionIntoDOM = transaction => {
    //vamos tratar recebendo um ternário onde os valores positivos como soma e os negativos como valores que vão ser debitados 
    const operator = transaction.amount < 0 ? '-' : '+'
    const CSSClass = transaction.amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(transaction.amount); //método abs vai retornar o valor absoluto do número (sem o sinal de + ou -), sendo assim vai evitar de vir com 2 sinais de -
    const li = document.createElement('li'); //vamos criar um novo elemento HTML

    li.classList.add(CSSClass) 
    li.innerHTML = `
        ${transaction.name} 
        <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
          x
        </button>
    `
    //o append vai receber como argumento o elemento que vai ser inserido dentro desse UL
    // transactionUl.append(li);
    transactionsUl.prepend(li); // o uso do prepend deixa a listagem com o mais recente por cima
}

const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts.filter(value => value < 0).reduce((accumulator, value) => accumulator + value, 0)).toFixed(2); //vai receber o array só com as despesas das transações

const getIncome = transactionsAmounts => transactionsAmounts.filter(value => value >  0).reduce((accumulator, value) => accumulator + value, 0).toFixed(2);

const getTotal = transactionsAmounts => transactionsAmounts.reduce((accumulator, transaction) => accumulator + transaction, 0).toFixed(2); //vai realizar os cálculos dos valores passados e gerando o valor do saldo da conta

const updateBalanceValues = () => {
    // const transactionsAmounts = transactions.map(transaction => transaction.amount);
    const transactionsAmounts = transactions.map(({amount}) => amount);
    const total = getTotal(transactionsAmounts);
    const income = getIncome(transactionsAmounts);
    const expense = getExpenses(transactionsAmounts);
    //foi usado o Math.abs para remover o sinal de - na interface

    //Vamos inserir no DOM os valores que a interface deve exibir
    balanceDisplay.textContent = `R$ ${total}` //exibir o saldo total na tela
    incomeDisplay.textContent = `R$ ${income}` //exibir o valor total das receitas
    expenseDisplay.textContent = `R$ ${expense}` //exibir o valor total das despesas
}

// função que vai executar o preenchimento das informações do estado da aplicação quando a página for carregada
const init = () => {
    transactionsUl.innerHTML = ''; //Limpar a UL
    transactions.forEach(addTransactionIntoDOM);
    updateBalanceValues()
}

init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

// gerar os ID´s de forma aleatória de 0 até 1000
const generateID  = () => Math.round(Math.random() * 1000);

const addToTransactionsArray = (transactionName, transactionsAmount) => {
    transactions.push({
        id: generateID(), 
        name: transactionName, 
        amount: Number(transactionsAmount)
    });

}

const cleanInputs = () => {
    inputTransactionName.value = '';
    inputTransactionAmount.value = '';
}

const handleFormSubmit = event => {
    event.preventDefault();

    const transactionName = inputTransactionName.value.trim(); //método trim remove qualquer espaço em branco do início ao fim da string
    const transactionsAmount = inputTransactionAmount.value.trim();
    const isSomeInputEmpty = transactionName === '' || transactionsAmount === '';

    //verificar se foi passado os dois valores
    if (isSomeInputEmpty) {
        alert('Por favor, preencha tanto o nome quanto o valor da transação');
        return // caso o if seja ativado a execução da função para aqui, por causa do return
    }

    addToTransactionsArray(transactionName, transactionsAmount);
    init();
    updateLocalStorage();
    cleanInputs();
}

form.addEventListener('submit', handleFormSubmit);