let favorites = JSON.parse(localStorage.getItem('favorites')) || []
const allPokeContent = document.querySelector('#allPoke')
const cardContent = document.querySelector('#cardContent')

function showFavorites() {
    removeAll()

    allPokeContent.style.display = 'none'
    cardContent.style.display = 'flex'
    favorites.forEach((pokemon) => {
        const card = document.createElement('div');
        card.classList.add('card');

        const textContent = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}">
            <span class="id">#${pokemon.id}</span>
            <h3>${pokemon.name}</h3>
            <span class="type">type: ${pokemon.types[0].type.name}</span>
        `;

        card.innerHTML = textContent;
        
        card.onclick = () => {
            removePoke(pokemon)
            showFavorites()
            save()
        }
       

        document.querySelector('#cardContent').appendChild(card);
    });
}

function save() {
    localStorage.setItem('favorites', JSON.stringify(favorites))
}

document.querySelector('#search').addEventListener('submit',  (event) => {
    event.preventDefault()

    const { value } = document.querySelector('#search input')

     get(value)


})

async function get(value) {
    try {
        const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${value}`)
        
        if(data.status === 404){
            throw new Error('Pokemon não encontrado');
        }

        var poke = await data.json()

        favorites.forEach((pokemon) => {
            if(poke.id == pokemon.id){
                throw new Error('Pokemon já esta na sua lista')
            }
        })
    } catch (error) {
        alert(error.message)
        return;
    }
    
    favorites = [poke, ...favorites]
    showFavorites()
    save()


}

function removeAll(){
    document.querySelectorAll('.card').forEach((card) => {
        card.remove()
    })
}

function removePoke(poke) {
    const pokemonsFav = favorites.filter(favorites => favorites.id !== poke.id  )

    favorites = pokemonsFav
}

async function showAll() {
    allPokeContent.style.display = 'flex'
    cardContent.style.display = 'none'

    for(let i = 1; i <= 1024; i++){
        let pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then(data => data.json())

        const card = document.createElement('div');
        card.classList.add('card');

        const textContent = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}">
            <span class="id">#${pokemon.id}</span>
            <h3>${pokemon.name}</h3>
            <span class="type">type: ${pokemon.types[0].type.name}</span>
        `;

        card.innerHTML = textContent;
       

        document.querySelector('#allPoke').appendChild(card);
    }
}

const myFavorites = document.querySelector('#myFavorites')
const allPokemon = document.querySelector('#AllPokemon')

myFavorites.onclick = () => {
    showFavorites()
}

allPokemon.onclick = () => {
    showAll()
}

showFavorites()