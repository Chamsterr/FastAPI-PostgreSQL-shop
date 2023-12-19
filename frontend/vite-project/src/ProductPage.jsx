import * as React from 'react';
import { useEffect, useState } from 'react';
import { Box, Card, CardMedia, CardContent, Typography, Button, TextField, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

const ProductCard = () => {
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id: product_id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/product/get_product/${product_id}`, { withCredentials: true });
        setProduct({ ...response.data });
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
    } else {
      try {
        const orderData = {
          order_status: 'OPENED',
          order_amount: 1,
          product_id: product_id,
        };
        await axios.post('http://localhost:8000/order/create_order', orderData, { withCredentials: true });
        alert('Заказ успешно создан!');
      } catch (error) {
        console.error('Ошибка при создании заказа:', error);
      }
    };
  };

  const handleCommentSubmit = async () => {
    if (!user) {
      navigate('/login');
    } else {
      try {
        const commentData = {
          text: newComment,
          user_id: user.id,
          product_id: product_id,
        };
        if (newComment){
          await axios.post('http://localhost:8000/comment/add_comment', commentData, { withCredentials: true });
          setNewComment('');
          const response = await axios.get(`http://localhost:8000/comment/get_comments/${product_id}`, { withCredentials: true });
          setComments(response.data);
        }
      } catch (error) {
        console.error('Ошибка при добавлении комментария:', error);
      }
    };
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <Box display="flex" flexDirection='column' justifyContent="center" alignItems="center" padding="2rem" >
        <Card sx={{ width: '80%', height: '80%', display: 'flex', flexDirection: 'column' }}>
          <CardMedia component="img" src={product.image} alt={product.name} />
          <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="div">
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {product.description}
            </Typography>
            <Typography variant="h5" color="text.secondary">
              Вес - {product.weight}
            </Typography>
            <Typography variant="h5" color="text.secondary">
              Цена - {product.price}
            </Typography>
            <Button size="small" color="primary" variant="contained" onClick={handlePurchase}>
              Приобрести товар
            </Button>
          </CardContent>
        </Card>
      </Box>
      <Box display="flex" flexDirection='column' justifyContent="center" alignItems="center" padding="2rem">
          <Card sx={{ width: '80%', display: 'flex', flexDirection: 'column' }}>
            <TextField label="Новый комментарий" value={newComment} onChange={(e) => setNewComment(e.target.value)} variant="outlined" multiline rows={4} />
            <Button color="primary" variant="contained" onClick={handleCommentSubmit}>Отправить комментарий</Button>
          </Card>
          <br/>
          <Card sx={{ width: '80%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" component="div">Comments:</Typography>
          <List>
            {comments.map((comment, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${comment.email}`} secondary={` ${comment.text}`} />
              </ListItem>
            ))}
          </List>
        </Card>
      </Box>

    </Box>
  );
};

export default ProductCard;
