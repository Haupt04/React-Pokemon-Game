import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [error, setError] = useState('');
  const [score, setScore] = useState(0);
  const [clickedButton, setClickedButton] = useState([]);

  const shuffleArray = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
    }
    return shuffledArray;
  };

  const handleButtonClicked = (pName) => {
    setClickedButton((prev) => {
      const newClickedButton = [...prev, pName];

     
      console.log("Clicked Buttons:", newClickedButton);

      if (newClickedButton.length === 2) {
        if (newClickedButton[0] === newClickedButton[1]) {
          setScore((prevScore) => {
            const newScore = prevScore + 1;
            console.log("Score updated:", newScore);
            return newScore;
          });
        }
        setPokemonList((prevList) => shuffleArray(prevList))
        return [];
      }

      return newClickedButton;
    });
  };

  const fetchPokemon = async () => {
    try {
      setError('');
      const promises = [];

      for (let i = 0; i < 30; i++) {
        const randomId = Math.floor(Math.random() * 898) + 1;
        promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`).then((res) => res.json()));
      }

      const pokemonData = await Promise.all(promises);

      const pokemonList = pokemonData.map((pokemon) => ({
        name: pokemon.name,
        image: pokemon.sprites.front_default,
      }));

      // Optionally double the list
      const doubledPokemonList = [...pokemonList, ...pokemonList];

      console.log(doubledPokemonList);  // Log the doubled list
      setPokemonList(doubledPokemonList);
    } catch (err) {
      setError('Failed to fetch Pokémon. Please try again.');
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Pokémon Finder</h1>
      <h3>Score: {score}</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '50px' }}>
        {pokemonList.map((pokemon, index) => (
          <button onClick={() => handleButtonClicked(pokemon.name)} key={index} style={{ textAlign: 'center', width: '200px' }}>
            <h3>{pokemon.name}</h3>
            <img src={pokemon.image} alt={pokemon.name} style={{ width: '100px', height: '100px' }} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
