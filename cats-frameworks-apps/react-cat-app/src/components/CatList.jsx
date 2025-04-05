import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

const CatList = ({ onAddFavourite }) => {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    axios.get('https://api.thecatapi.com/v1/images/search?limit=10', {
      headers: {
        'x-api-key': import.meta.env.VITE_CAT_API_KEY
      }
    }).then((response) => {
      setCats(response.data);
    });
  }, []);

  return (
    <Grid container spacing={2} mt={2}>
      {cats.map((cat) => (
        <Grid item xs={12} sm={6} md={4} key={cat.id}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={cat.url}
              alt="cat"
            />
            <CardActions>
              <Button fullWidth onClick={() => onAddFavourite(cat)}>Add to Favourites</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default CatList;
