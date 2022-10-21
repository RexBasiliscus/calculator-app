//================== INITIAL CACHING ==================//

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const clearButton = document.querySelector('[data-clear]');
const deleteButton = document.querySelector('[data-delete]');
const upperScreen_div = document.querySelector('[data-upper-screen]');
const lowerScreen_div = document.querySelector('[data-lower-screen]');

//=================== CALCULATOR CLASS ===================//

class Calculator {
  constructor(upperScreen_div, lowerScreen_div) {
    this.upperScreen_div = upperScreen_div;
    this.lowerScreen_div = lowerScreen_div;
    this.clear();
  }

  clear() {
    this.lowerScreen = '';
    this.upperScreen = '';
    this.operation = undefined;
  }

  delete() {
    this.lowerScreen = this.lowerScreen.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === '.' && this.lowerScreen.includes('.')) return;
    // if we type '.' and the lowerScreen already contains it, the functions doesn't do the next part
    this.lowerScreen = this.lowerScreen.toString() + number.toString();
    // transforming into a string so it doesn't calculate but concatenate numbers as we input them
  }

  chooseOperation(operation) {
    if (this.lowerScreen === '') return;
    if (this.upperScreen !== '') {
      this.compute();
    }
    this.operation = operation;
    this.upperScreen = this.lowerScreen;
    this.lowerScreen = '';
    // these last two take the number we entered before using an 
    // operand and put it in the upperScreen, while emptying the 
    // lowerScreen field 
  }

  compute() {
    let computation;
    const prev = parseFloat(this.upperScreen);
    const current = parseFloat(this.lowerScreen);
    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+': 
        computation = prev + current;
        break
      case '-': 
        computation = prev - current;
        break
      case 'x': 
          computation = prev * current;
        break
      case '/': 
        if (prev === 0 || current === 0) {
          computation = 'ERROR';
        } else {
          computation = prev / current;
        }
        break
      default: 
        return
    }

    this.lowerScreen = computation;
    this.operation = undefined;
    this.upperScreen = '';
  }

  updateDisplay() {
    this.lowerScreen_div.innerText = this.lowerScreen;
    if (this.operation != null) {
      this.upperScreen_div.innerText = 
        `${this.upperScreen} ${this.operation}`;
    } else {
      this.upperScreen_div.innerText = '';
    }
  }
}

//============ INSTANTIATION =============//

const calculator = new Calculator(upperScreen_div, lowerScreen_div);

//=============== BUTTON EVENTS ==================//

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener('click', button => {
  calculator.compute();
  calculator.updateDisplay();
})

clearButton.addEventListener('click', button => {
  calculator.clear();
  calculator.updateDisplay();
})

deleteButton.addEventListener('click', button => {
  calculator.delete();
  calculator.updateDisplay();
})

//================== KEYBOARD SUPPORT ==================//

window.addEventListener('keydown', (e) => {
  if (e.key >= 0 && e.key <= 9 && '.') {
      calculator.appendNumber(e.key);
      calculator.updateDisplay();
  }

  if (e.key === ',') {
    calculator.appendNumber('.');
    calculator.updateDisplay();
  }
    
  if (e.key === '/' || e.key === '+' || e.key === '-') {
      calculator.chooseOperation(e.key);
      calculator.updateDisplay();
  }

  if (e.key === '*') {
      calculator.chooseOperation('x');
      calculator.updateDisplay();
  }

  if (e.key === '=' || e.key === 'Enter') {
      calculator.compute(e.key);
      calculator.updateDisplay();
  }

  if (e.key === 'Delete') {
    calculator.clear(e.key);
    calculator.updateDisplay();
  }

  if (e.key === 'Backspace') {
    calculator.delete(e.key);
    calculator.updateDisplay();
  }
})

