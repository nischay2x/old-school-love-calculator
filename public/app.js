import { initializeApp }  from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js"
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyDi7c3JTUY5MJtZO_f6J0tZXNQA_VEchqk",
    authDomain: "lovecalculator-ebb02.firebaseapp.com",
    projectId: "lovecalculator-ebb02",
    storageBucket: "lovecalculator-ebb02.appspot.com",
    messagingSenderId: "136956372935",
    appId: "1:136956372935:web:34acc6f29d212cfe391be2",
    measurementId: "G-0381DD3DEF"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app)

const switcher = document.getElementById('switch')
const p1 = document.getElementById('p-1')
const p2 = document.getElementById('p-2')
const form = document.getElementById('calculator')
const logDiv = document.getElementById('log-calculation')
let logArray = []

switcher.onclick = () => {
    [p1.value, p2.value] = [p2.value, p1.value];
}

form.onsubmit = (e) => {
    e.preventDefault()
    let n1 = p1.value
    let n2 = p2.value
    logArray.push(n1 + " Loves " + n2)

    n1 = n1.toLowerCase().replace(/([^a-zA-z]+)/gi, '')
    n2 = n2.toLowerCase().replace(/([^a-zA-z]+)/gi, '')

    const numString = firstPass(n1 + 'loves' + n2)
    calculate(numString)

    function calculate(numString) {
        if (numString.length > 2) {
            let length = numString.length;
            let newNumString = ''
            for (let i = 0; i < length; i++) {
                if (i < length - 1 - i) {
                    let s = parseInt(numString[i]) + parseInt(numString[length - 1 - i])
                    newNumString += s;
                } else {
                    newNumString += numString[i];
                    break;
                }
            }
            logArray.push(newNumString)
            calculate(newNumString)
        } else {
            sendData({
                p1 : n1,
                p2 : n2,
                timestamp : new Date(),
                result : numString
            })
            document.getElementById('pop-up-hold').style.visibility = 'visible';
            document.querySelector('#pop-up > div').innerHTML = `<h4 style="margin-bottom: 2px;">${logArray[0]}</h4>`
            document.getElementById('result-circle').innerHTML = `<span class="display-2">${numString}</span>`
        }
    }

    logDiv.innerHTML = ''
    logDiv.classList.add('card', 'card-body')
    logArray.forEach((item, idx) => {
        let newDiv = document.createElement('li')
        newDiv.classList.add('nav-link')
        if (idx > 0) {
            newDiv.innerHTML = item.split('').join(' ')
        }
        else {
            newDiv.innerHTML = item
            newDiv.classList.add('capitalize')
        }
        logDiv.append(newDiv)
    })
}

function firstPass(string) {
    let num = ''
    let ts = string;
    for (let i in ts) {
        let c = count(string[i], ts)
        num += (c ? c : '')
        ts = ts.replace(new RegExp(string[i], 'gi'), '')
    }
    return num
}

function count(letter, word) {
    let c = 0;
    for (let i in word) {
        if (word[i] === letter) c++;
    }
    return c;
}

async function sendData(data){
    await addDoc(collection(db, "calculations"), data)
}

document.getElementById('pop-up-hold').onclick = () => {
    document.getElementById('pop-up-hold').style.visibility = 'hidden'
}