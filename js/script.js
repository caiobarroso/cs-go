const form = document.getElementById('form')
const main = document.getElementById('main');

// Arrays responsáveis pelos nomes dos players ::: O supNames serve como uma ponte entre o names e o arr.
var names = []
var supNames = []
var arr = []
// Arrays responsáveis pelos KDS dos players ::: O supKds serve como uma ponte entre o kds e o arr2.
var kds = []
var supKds = []
var arr2 = []
// N é o tamanho do array, e r é a o numero de elementos que irá conter cada grupo
let r = 5;
var n
// Variáveis responsáveis por calcular e armazenar as médias de cada time
var sum = 0
var index = 0
var media = 0
// Formato final do array
var avgs = [] // media de kd de cada time -> array com 252 posições
var difs = [] // mostrará a diferença entre as médias de KD de cada duelo -> Será um array com 126 posições.
var comb = [] // mostrará o array em formato de time (Time A vs Time B) [ [ [a,b,c,d] , [e,f,g,h] ], [ [x,y,v,w,k] , [q,r,t,i,u] ] ] -> No fim das contas, será um array multidimensional com 126 posiçÕes. 
// REMAKE
let qtd = 7
let rmk = []
let i = 1

var min

const fill = () => {
    $('input[type=text]').each(function () {
        var values = ($(this).val());
        names.push(values)
    });
    $('input[type=number]').each(function () {
        var values = ($(this).val());
        kds.push(values)
    });
    n = names.length
}

const combinationUtil = (names, data, kds, storage, start, end, index, r) => {
    if (index == r) {
        supNames = []
        supKds = []
        for (let j = 0; j < r; j++) {
            supNames.push(data[j])
            supKds.push(parseFloat(storage[j]))
        }
        arr.push(supNames)
        arr2.push(supKds)
    }
    for (let i = start; i <= end && end - i + 1 >= r - index; i++) {
        data[index] = names[i];
        storage[index] = kds[i]
        combinationUtil(names, data, kds, storage, i + 1, end, index + 1, r);
    }
}

const printCombination = (names, kds, n, r) => {
    let data = new Array(r);
    let storage = new Array(r)
    combinationUtil(names, data, kds, storage, 0, n - 1, 0, r);
}

const fillAvgs = () => {
    for (var i = 0; i < arr2.length; i++) {
        sum = 0
        index = 0
        for (var j = 0; j < arr2[i].length; j++) {
            sum += arr2[i][j]
            index++
        }
        media = sum / index
        avgs.push(media.toFixed(3))
    }
}

const dif = () => {
    var j = avgs.length
    for (var i = 0; i < avgs.length / 2; i++) {
        j--
        var ta = arr[i]
        var tb = arr[j]
        var diferenca = parseFloat(Math.abs(avgs[i] - avgs[j]).toFixed(3))
        difs.push(diferenca)
        comb.push([ta, tb])
    }

    remake()
    getValues(Math.min.apply(Math, difs))
}

const getValues = (min) => {
    // min = Math.min.apply(Math, difs); // Pega o menor valor do array difs
    var index = difs.indexOf(min) // Index da menor posição

    var nta = (comb[index][0]) // Os 5 nomes do time A
    var ntb = (comb[index][1]) // Os 5 nomes do time B

    var kda = arr2[index] // Os 5 kds do time A
    var kdb = arr2[(arr2.length - 1) - index] // Os 5 kds do time B

    var mta = avgs[index] // Media time A
    var mtb = avgs[(avgs.length - 1) - index] // Média time B

    var mvpta = Math.max.apply(Math, kda) // Maior valor array time A
    var indexA = kda.indexOf(mvpta) // Index do maior

    var mvptb = Math.max.apply(Math, kdb) // Maior valor array time B
    var indexB = kdb.indexOf(mvptb) // Index do maior

    var mvp1 = comb[index][0][indexA] // Pega o nome no array comb com o index do maior
    var mvp2 = comb[index][1][indexB]

    showInfo(nta, ntb, kda, kdb, mta, mtb, min, mvp1, mvp2)
}

const createCard = () => {
    const cardHTML = `
                <div class="main-content">
                    <div class="card-a">
                        <div class="title-a">
                            <h1>TEAM A</h1>
                        </div>
                        <div class="info-a">
                            <div id="ta">
                            </div>
                            <div id="na">
                            </div>
                        </div>
                    </div>
                    <div class="box">
                        <div class="main-title">
                            <h1>STATS</h1>
                        </div>
                        <div class="stats">
                            <div class="avgs-title">
                                <h1>AVERAGES K/D</h1>
                            </div>
                            <div class="avgs-section">
                                <div class="stat-a">
                                    <h1 id="med-a"></h1>
                                </div>
                                <div class="stat-b">
                                    <h1 id="med-b"></h1>
                                </div>
                            </div>
                            <div class="mvps-title">
                                <h1>MVP'S</h1>
                            </div>
                            <div class="mpvs-section">
                                <div class="mvpa">
                                    <h1 id="val-a"></h1>
                                </div>
                                <div class="mvpb">
                                    <h1 id="val-b"></h1>
                                </div>
                            </div>
                            <div class="med-title">
                                <h1>DIFF</h1>
                            </div>
                            <div class="med-section">
                                <h1 id="med-ger"></h1>
                            </div>
                        </div>

                        <div class="button-area">
                            <button class="rmk-btn" onClick="onClick()">Remake</button>
                        </div>
                    </div>
                <div class="card-b">
                    <div class="title-b">
                        <h1>TEAM B</h1>
                    </div>
                    <div class="info-b">
                        <div id="nb">
                        </div> 
                        <div id="tb">
                        </div>
                    </div>
                </div>
                </div>
                    
    `
    main.innerHTML = cardHTML
}

const showInfo = (nta, ntb, kda, kdb, mta, mtb, dif, mvpa, mvpb) => {

    const listA = document.getElementById('ta')
    const listB = document.getElementById('tb')

    const namesA = document.getElementById('na')
    const namesB = document.getElementById('nb')

    const meda = document.getElementById('med-a')
    const medb = document.getElementById('med-b')
    const medger = document.getElementById('med-ger')

    const mvp01 = document.getElementById('val-a')
    const mvp02 = document.getElementById('val-b')

    kda.forEach(item => {
        const el = document.createElement("a")
        el.classList.add("kd-teamA")
        el.innerText = item
        listA.appendChild(el)
    })
    kdb.forEach(item => {
        const el = document.createElement("a")
        el.classList.add("kd-teamB")
        el.innerText = item
        listB.appendChild(el)
    })
    nta.forEach(item => {
        const el = document.createElement("a")
        el.classList.add("names-a")
        el.innerText = item
        namesA.appendChild(el)
    })
    ntb.forEach(item => {
        const el = document.createElement("a")
        el.classList.add("names-b")
        el.innerText = item
        namesB.appendChild(el)
    })

    meda.innerHTML = mta
    medb.innerHTML = mtb
    medger.innerHTML = dif
    mvp01.innerHTML = mvpa
    mvp02.innerHTML = mvpb
}

function onClick () {
    if (i < qtd) {
        min = rmk[i]
        i++;
        console.log(min)
    } else {
        i = i;
    }
}
const remake = () => {

    let copy_arr = [...difs]
    copy_arr.sort((a, b) => a - b)
    let removeDuplicates = [...new Set(copy_arr)]
    let tenSmallestDifs = removeDuplicates.slice(0, 10)
    let size = tenSmallestDifs.length

    fillRemakeArray(tenSmallestDifs, size, qtd, removeDuplicates)
}

const fillRemakeArray = (arr, size, n, removeDuplicates) => {
    for (let i = 0; i < size; ++i) {
        if (arr[i] < removeDuplicates[n]) {
            rmk.push(arr[i]);
        }
    }
    console.log(rmk)
}


const clearAll = () => {
    names = [], supNames = [], arr = [],
        kds = [], supKds = [], arr2 = [], avgs = []
    sum = 0, index = 0, media = 0, difs = [],
        comb = []
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    fill()
    printCombination(names, kds, n, r);
    fillAvgs()
    createCard()
    dif()
    clearAll()
})



// DOCUMENTATION:
// -> fill() -> PREENCHEU OS VETORES 'names' E 'kds' COM TODAS AS INFORMAÇÕES
// -> combinationUtil() -> GEROU TODAS AS COMBINAÇÕES POSSÍVEIS DE TIMES, QUE SÃO 252 NO TOTAL. SENDO 126 PARA CADA LADO
// -  A LÓGICA DO combinationUtil() É A SEGUINTE: PRIMEIRO O 'supNames' RECEBE 5 NOMES POR VEZ, APÓS OS 5 NOMES SEREM PREENCHIDOS, 
//    ESSES 5 NOMES SERAM REPASSADOS PARA O 'arr' EM FORMA DE ARRAY, APÓS ISSO, O 'supNames' É LIMPO, E RECOMEÇA TODA A OPERAÇÃO. OU SEJA, 
//    O 'supNames' SÓ RECEBE 5 NOMES POR VEZ, E SUA FUNÇÃO É REPASSAR PARA O ARRAY PRINCIPAL DE 5 EM 5 NOMES, SENDO ASSIM, O 'supNames' 
//    NUNCA RECEBERÁ MAIS DE 5 ELEMENTOS EM SUA ESTRUTURA.
// -> fillAvgs() -> VAI RECEBER O 'arr2' COMO ARGUMENTO E VAI CALCULAR TODAS AS MÉDIAS QUE EXISTEM NO ARR2 E ARMAZENÁ-LAS EM OUTRO ARRAY. 
//    POR EXEMPLO : var array = [[1,2,3],[4,5,6]]  ---- var averages = [2,5]
// -> dif() -> PRIMEIRAMENTE ELE ORDENA O ARRAY 'avgs' E O 'arr' EM FORMATO DE TIME. O PADRAO SEGUIDO É 0-251 :: 125-126. OU SEJA, 
//    O TIME QUE ESTÁ NA POSIÇÃO 'arr[0]', ENFRENTARÁ O TIME QUE ESTÁ NA POSIÇÃO 'arr[251]' E ASSIM POR DIANTE. A BASE DO ARRAY DOS ADVERSÁRIOS É ASSIM:
//    [[[team-a],[team-b]]], A MESMA COISA FOI FEITA COM AS DIFERENÇAS. NO FIM DAS CONTAS, UM ARRAY DE 252 POSIÇÕES FOI CONVERTIDO EM UM ARRAY DE 126 POSIÇOES
//    Calculo de todas as probabilidades -> 10! ÷ 5!(10-5)! = 252







