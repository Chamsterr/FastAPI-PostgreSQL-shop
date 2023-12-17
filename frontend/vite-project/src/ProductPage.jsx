import * as React from 'react';
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

const ProductCard = () => {
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate(); 
  const { id: product_id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/product/get_product/${product_id}`, { withCredentials: true });
        var reader = new FileReader();
        reader.onloadend = function() {
          setProduct({ ...response.data, image: reader.result });
        }
        reader.readAsDataURL(new Blob([new Uint8Array(response.data.image.data)]));
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/comment/get_comments/${product_id}`, { withCredentials: true });
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchProduct();
    fetchComments();
  }, []);

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login');
    }
    else{
      try {
        const orderData = {
          order_status: 'pending',
          order_amount: 1,
          product_id: product_id,
        };
        await axios.post('http://localhost:8000/order/create_order', orderData, { withCredentials: true });
        alert('Заказ успешно создан!');
      } catch (error) {
        console.error('Ошибка при создании заказа:', error);
      }
    };
  }
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
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
          <Button size="small" color="primary" onClick={handlePurchase}>
            Приобрести товар
          </Button>
          <Button size="small" color="primary">
            Share
          </Button>
        </CardActions>
      </Card>
      <div>
        <Typography variant="h6" component="div">
          Comments:
        </Typography>
        <List>
          {comments.map((comment, index) => (
            <ListItem key={index}>
              <ListItemText primary={comment.user_id} />   
              <ListItemText primary={comment.text} />
            </ListItem>
          ))}
        </List>  
      </div>
    </div>
  );
};

export default ProductCard;