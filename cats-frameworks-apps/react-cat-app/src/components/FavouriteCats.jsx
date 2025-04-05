import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

const FavouriteCats = ({ favourites }) => (
  <>
    <Typography variant="h5" mt={4} mb={2}>Favourite Cats</Typography>
    <Grid container spacing={2}>
      {favourites.map((cat) => (
        <Grid item xs={12} sm={6} md={4} key={cat.id}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={cat.url}
              alt="cat"
            />
          </Card>
        </Grid>
      ))}
    </Grid>
  </>
);

export default FavouriteCats;