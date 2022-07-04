"use strict"

const disableSelect = (e) => {
  return false
}
document.onselectstart = disableSelect
document.onmousedown = disableSelect

const keys = document.querySelectorAll(".key")
const delKey = document.querySelector(".key-del")
const resetKey = document.querySelector(".key-reset")
const outputKey = document.querySelector(".key-output")
const themeControllers = document.querySelectorAll(".theme__item")
const screen = document.querySelector(".display__output")
const body = document.querySelector("body")

const fnKeyArr = Array.from(document.querySelectorAll(".key-function")).map(
  (fnKey) => fnKey.dataset.key
)
const operatorKeyArr = Array.from(
  document.querySelectorAll(".key-number-sign")
).map((oKey) => oKey.dataset.key)

let theme = 1
let display = ""
let keepString = ""

// Key functions-----------------------------------------------------------
// Display user's input
let counter = 1

const addSeparator = function (input) {
  let modifiedInput = input.replaceAll(",", "")

  if (+modifiedInput < 1000) return
  if (+modifiedInput / Math.pow(1000, counter) >= 1) counter++
  console.log(`this is counter😀😀😀:` + counter)

  for (let i = counter - 1; i > 0; i--) {
    modifiedInput =
      modifiedInput.slice(0, -3 * i) + "," + modifiedInput.slice(-3 * i)
  }

  display = modifiedInput
}

console.log(Math.pow(1000, 0))

const displayInput = function (e) {
  // Situations should ignore user's action --------------------------
  // if function key is pressed, return
  if (fnKeyArr.includes(e.target.dataset.key)) return

  // if display is 0 and pressed operator, return
  if (display === "" && operatorKeyArr.includes(e.target.dataset.key)) return

  // if display is 0 and keep pressing 0, return
  if (display === "" && e.target.dataset.key === "0") return

  // if input operator more than 1 time, return
  if (
    operatorKeyArr.includes(e.target.dataset.key) &&
    operatorKeyArr.includes(screen.innerHTML.slice(-1))
  )
    return

  // -------------------------------------------------------------------

  if (display === 0) display = ""

  // if pressed number key
  if (!operatorKeyArr.includes(e.target.dataset.key)) {
    // 1) first number, 如常顯示(addSeparator)
    console.log("you pressed 1️⃣3️⃣2️⃣4️⃣ key")

    if (keepString) {
      console.log("this is new number after operator")
      display += e.target.dataset.key
      console.log("have keep string and the keep string is: " + keepString)
      console.log("and this is display: " + display)
      console.log("this is combine string:" + keepString + display)

      addSeparator(display)
      screen.innerHTML = keepString + display
    } else {
      // 2) number after input operator, 最後得出黎永遠都係var+新num, 新num獨立,
      console.log("this is first number")
      display += e.target.dataset.key
      addSeparator(display)
      console.log("this is display: " + display)
      screen.innerHTML = display
    }
  }
  // if pressed fn key
  if (operatorKeyArr.includes(e.target.dataset.key)) {
    console.log("you pressed ➕➖✖➗ key")
    keepString = ""
    keepString = display + e.target.dataset.key
    display = ""
    console.log("this is display: " + display)
    console.log("this is keep string: " + keepString)
    screen.innerHTML = keepString
    // 加埋個operator save落var
  }
}

keys.forEach((k) =>
  k.addEventListener("click", function (e) {
    displayInput(e)
  })
)

delKey.addEventListener("click", function () {
  display = display.slice(0, -1) === "" ? 0 : display.slice(0, -1)
  screen.innerHTML = display
})

resetKey.addEventListener("click", function () {
  display = 0
  counter = 1
  keepString = ""
  screen.innerHTML = display
  console.log(display)
})

const plus = (num1, num2) => num1 + num2
const minus = (num1, num2) => num1 - num2
const times = (num1, num2) => num1 * num2
const div = (num1, num2) => num1 / num2
const calcArr = [plus, minus, times, div]
let index = 0

outputKey.addEventListener("click", function () {
  let operator = ""

  if (screen.innerHTML === "0") return

  operatorKeyArr.forEach((oKey, i) => {
    if (screen.innerHTML.includes(oKey)) {
      operator = oKey
      index = i
    }
  })

  if (operator === "") return

  // 將display用operator分成array
  const numArr = screen.innerHTML.split(operator)

  //clear 空白 array item, 如果clear後只有1個item就return
  if (numArr.includes("")) numArr.splice(numArr.indexOf(""), 1)
  if (numArr.length === 1) return

  display = String(
    calcArr[index](
      +numArr[0].replaceAll(",", ""),
      +numArr[1].replaceAll(",", "")
    )
  )

  keepString = ""
  addSeparator(display)
  screen.innerHTML = display.includes(".") ? (+display).toFixed(2) : display
})

//change theme color-------------------------------------------------------
const changeTheme = function (e) {
  //set theme number
  theme = +e.target.dataset.themeNumber

  //generate and compare new html with old one
  const newMarkup = generateMarkup(theme)
  const newDOM = document.createRange().createContextualFragment(newMarkup)
  const newElements = Array.from(newDOM.querySelectorAll("*"))
  const curElements = Array.from(body.querySelectorAll("*"))

  newElements.forEach((newEl, i) => {
    let curEl = curElements[i]

    if (!newEl.isEqualNode(curEl)) {
      curEl.classList = newEl.classList
    }
  })

  themeControllers.forEach((con) => (con.classList = "theme__item"))
  e.target.classList.add(`theme-${theme}-key-output-bg`)

  body.classList = ""
  body.classList.add(`theme-${theme}-bg-main`)
}

themeControllers.forEach((con) =>
  con.addEventListener("click", function (e) {
    changeTheme(e)
  })
)

const generateMarkup = function (theme = 1) {
  return `
    <main class="container">
      <header class="header">
        <h1 class="logo theme-${theme}-text-color-2">clac</h1>
        <div class="theme theme-${theme}-text-color-2">
          <h2 class="theme__title">theme</h2>
          <ol class="theme__list theme-${theme}-bg-keypad">
            <li class="theme__item" data-theme-number="1"></li>
            <li class="theme__item" data-theme-number="2"></li>
            <li class="theme__item" data-theme-number="3"></li>
          </ol>
        </div>
      </header>

      <section class="display theme-${theme}-bg-screen">
        <span class="display__output theme-${theme}-text-color-2">0</span>
      </section>

      <section class="keypad theme-${theme}-bg-keypad">
        <button
          class="key key-0 theme-${theme}-key-number-bg theme-${theme}-key-number-shadow theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 key-short key-number"
          data-key="0"
        >
          0
        </button>
        <button
          class="key key-1 theme-${theme}-key-number-bg theme-${theme}-key-number-shadow theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 key-short key-number"
          data-key="1"
        >
          1
        </button>
        <button
          class="key key-2 theme-${theme}-key-number-bg theme-${theme}-key-number-shadow theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 key-short key-number"
          data-key="2"
        >
          2
        </button>
        <button
          class="key key-3 theme-${theme}-key-number-bg theme-${theme}-key-number-shadow theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 key-short key-number"
          data-key="3"
        >
          3
        </button>
        <button
          class="key key-4 theme-${theme}-key-number-bg theme-${theme}-key-number-shadow theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 key-short key-number"
          data-key="4"
        >
          4
        </button>
        <button
          class="key key-5 theme-${theme}-key-number-bg theme-${theme}-key-number-shadow theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 key-short key-number"
          data-key="5"
        >
          5
        </button>
        <button
          class="key key-6 theme-${theme}-key-number-bg theme-${theme}-key-number-shadow theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 key-short key-number"
          data-key="6"
        >
          6
        </button>
        <button
          class="key key-7 theme-${theme}-key-number-bg theme-${theme}-key-number-shadow theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 key-short key-number"
          data-key="7"
        >
          7
        </button>
        <button
          class="key key-8 theme-${theme}-key-number-bg theme-${theme}-key-number-shadow theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 key-short key-number"
          data-key="8"
        >
          8
        </button>
        <button
          class="key key-9 theme-${theme}-key-number-bg theme-${theme}-key-number-shadow theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 theme-${theme}-text-color-1 key-short key-number"
          data-key="9"
        >
          9
        </button>
        <button
          class="key key-plus theme-${theme}-key-number-bg theme-${theme}-key-number-shadow theme-${theme}-text-color-1 key-short key-number-sign"
          data-key="+"
        >
          +
        </button>
        <button
          class="key key-minus theme-${theme}-key-number-bg theme-${theme}-key-number-shadow theme-${theme}-text-color-1 key-short key-number-sign"
          data-key="-"
        >
          -
        </button>
        <button
          class="key key-time theme-${theme}-key-number-bg theme-${theme}-key-number-shadow theme-${theme}-text-color-1 key-short key-number-sign"
          data-key="*"
        >
          x
        </button>
        <button
          class="key key-div theme-${theme}-key-number-bg theme-${theme}-key-number-shadow theme-${theme}-text-color-1 key-short key-number-sign"
          data-key="/"
        >
          /
        </button>
        <button
          class="key key-dot theme-${theme}-key-number-bg theme-${theme}-key-number-shadow theme-${theme}-text-color-1 key-short key-number-sign"
          data-key="."
        >
          .
        </button>
        <button
          class="key key-del theme-${theme}-key-function-bg theme-${theme}-key-function-shadow theme-${theme}-text-white key-short key-function"
          data-key="del"
        >
          del
        </button>
        <button
          class="key key-reset theme-${theme}-key-function-bg theme-${theme}-key-function-shadow theme-${theme}-text-white key-long key-function"
          data-key="reset"
        >
          reset
        </button>
        <button
          class="key key-ouput theme-${theme}-key-output-bg theme-${theme}-key-output-shadow ${
    theme !== 3 ? `theme-${theme}-text-white` : ""
  } key-long key-output"
          data-key="output"
        >
          =
        </button>
      </section>
    </main>
  `
}
