import React, { useState } from 'react';
import NavBar from './components/NavBar';
import CatList from './components/CatList';
import FavouriteCats from './components/FavouriteCats';
import Container from '@mui/material/Container';

function App() {
  const [favouriteCats, setFavouriteCats] = useState([]);

  const addToFavourites = (cat) => {
    setFavouriteCats((prev) => [...prev, cat]);
  };

  return (
    <>
      <NavBar />
      <Container>
        <CatList onAddFavourite={addToFavourites} />
        <FavouriteCats favourites={favouriteCats} />
      </Container>
    </>
  );
}

export default App;
