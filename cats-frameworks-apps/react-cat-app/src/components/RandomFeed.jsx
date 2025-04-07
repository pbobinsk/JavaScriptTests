import { Box, CircularProgress, Grid } from '@mui/material';
import React, { useEffect } from 'react';
import Image from './Image';

const Feed = () => {

    const [images, setImages] = React.useState([]);

    async function refreshImages()
    {
        setImages([])

        try{

            const response = await fetch('https://api.thecatapi.com/v1/images/search?limit=12&has_breeds=1',{
                headers:{
                    "content-type":"application/json",
                    'x-api-key': import.meta.env.VITE_CAT_API_KEY
                }
            });
            const json = await response.json();
            setImages(json);
            console.log('images set')
        
        }catch(e){
            console.log(e)
        }

    }

    const hasFetched = React.useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        refreshImages();
    }, []);


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
                    <Image data={image} />
                </Grid>
            ))}
        </Grid>

       <Box textAlign={'center'}>
            {images.length === 0 && <CircularProgress/>}
        </Box>
        </>
    );
}

export default Feed;