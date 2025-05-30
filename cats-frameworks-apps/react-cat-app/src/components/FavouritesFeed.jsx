import { Box, CircularProgress, Grid } from '@mui/material';
import React, { useEffect } from 'react';
import Image from './Image';

const FavouritesFeed = () => {

    const [images, setImages] = React.useState([]);
    
    async function onImageUnfavourited(favouriteId)
    {
        setImages(images.filter(image => image.favourite.id !== favouriteId))
    }

    async function refreshImages()
    {
        setImages([])

        try{

            const response = await fetch('https://api.thecatapi.com/v1/favourites?order=DESC',{
                headers:{
                    "content-type":"application/json",
                    'x-api-key': import.meta.env.VITE_CAT_API_KEY
                }
            });
            const json = await response.json();

            const mapped = json.map(favourite => {
                return {
                    id: favourite.image.id,
                    url: favourite.image.url,
                    favourite,
                    breeds:[]
                }})

            setImages(mapped);
        
        }catch(e){
            console.log(e)
        }

    }

    useEffect(() => {
        refreshImages();
    }, [])

    return (
        <>
        <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={2}>
            {images && images.map(image => (
                <Grid
                    key={image.id}
                    sx={{
                        gridColumn: {
                        xs: 'span 2',
                        sm: 'span 4',
                        md: 'span 4',
                        },
                    }}
                >
                    <Image data={image} onUnFavourite={onImageUnfavourited}/>

                </Grid>
            ))}
        </Grid>

        <Box textAlign={'center'}>
            {images.length === 0 && <CircularProgress/>}
        </Box>
        </>
    );
}

export default FavouritesFeed;