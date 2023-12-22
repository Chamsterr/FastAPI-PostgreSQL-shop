import * as React from 'react';
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';

const ProductCard = () => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/product/get_product/1', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        var reader = new FileReader();
        reader.onloadend = function() {
          setProduct({ ...data, image: reader.result });
        }
        reader.readAsDataURL(new Blob([new Uint8Array(data.image.data)]));
      });
  }, []);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={product.image}
          alt={product.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.price}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
