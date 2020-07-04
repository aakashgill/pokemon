const API_URL = 'https://pokeapi.co/api/v2/pokemon/';
const pokemonTypes = [];
const pokemonCount = 100;
const bgColors = {
  grass: '#defde0',
  fire: '#fddfdf',
  water: '#def3fd',
  poison: '#f8d5a3',
  normal: '#f5f5f5',
  bug: "#98d7a5"
}

function getAllElements() {
  return {
    body: document.querySelector('body'),
    resultDiv: document.querySelector('.cards'),
    filterDiv: document.querySelector('.filter'),
    searchInput: document.querySelector('input[type="search"'),
    loadingImg: document.querySelector('.loading img'),
    main: document.querySelector('.main'),
    card: document.querySelectorAll('.card'),
    cardTitle: document.querySelectorAll('.card__title'),
    buttons: document.querySelectorAll('[data-type]'),
    loading: document.querySelectorAll('.loading')
  }
}

async function getPokemon(id) {
  const req = await fetch(API_URL + id);
  const data = await req.json();
  return data;
}

async function fetchPokemon() {
  for(let i = 1; i < pokemonCount; i++) {
    try {
      var data = await getPokemon(i);
      var type = data.types[0].type.name;
      var name = data.name;
      var path = data.sprites.front_default;
      pokemonTypes.push(type);
      getAllElements().resultDiv.innerHTML += `
        <div class="card ${type}" style="background: ${bgColors[type]}">
          <img class="card__img" src="${path}">
          <span class="card__title">${name}</span>
          <span class="card__type">Type: ${type}</span>
        </div>`;
    }
    catch(err) {
      getAllElements().loadingImg.remove();
      getAllElements().main.classList.add('show');
      getAllElements().main.children[0].classList.add('hide');
      getAllElements().main.innerHTML += 'Couldn\'t fetch data';
      throw new Error('Snap! Couldn\'t fetch data!')
    }
  }
}

function searchTitle () {
  let titleDiv = Array.from(getAllElements().cardTitle);
  let a = titleDiv.filter(item => item.textContent == getAllElements().searchInput.value);
  if(a.length) {
    titleDiv.forEach(item => item.parentNode.style.display="none");
    a[0].parentNode.style.display="block";
  }
  else {
    titleDiv.forEach(item => item.parentNode.style.display="block");
  }
}

function uniqueArray(arr) {
  var a = [];
  for (let i = 0; i < arr.length; i++)
      if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
        a.push(arr[i]);
    return a;
}

function addFilterButton() {
  let uniquePoke = uniqueArray(pokemonTypes);
  let pokemonBtnType  = uniquePoke.map((poke,index) => {
    let str = '';
    if(index == 0) {
      str += `<button class="btn btn-active" data-type="all">All</button> `;
    }
    str += `<button class="btn" data-type="${poke}">${poke}</button>`;
    return str;
  }).join(' ');
  getAllElements().filterDiv.innerHTML += pokemonBtnType;
}

function filteredPokemon() {
  const buttons = getAllElements().buttons;
  buttons.forEach(btn => {
    btn.addEventListener('click', function() {
      let $that = this;
      getAllElements().buttons.forEach(btn => btn.classList.remove('btn-active'));
      $that.classList.add('btn-active');
      let allCards = getAllElements().card;
      let thisCard = document.querySelectorAll('.'+$that.textContent);
      if($that.textContent.toLowerCase() == 'all') {
        allCards.forEach(item => item.style.display = "block");
      }
      else {
        allCards.forEach(item => item.style.display = "none");
        thisCard.forEach(item => item.style.display = "block");
      }
    })
  })
}

function removeLoadingState() {
  getAllElements().loading.forEach(item => item.remove());
  setTimeout(function(){
    getAllElements().main.classList.add('show');
    getAllElements().body.classList.remove('fixed-body');
  }, 300);
}


fetchPokemon()
  .then(_ => {
    addFilterButton();
    filteredPokemon();
    removeLoadingState();
  })

getAllElements().searchInput.addEventListener('change', searchTitle);
