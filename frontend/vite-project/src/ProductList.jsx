import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { Box, Drawer, TextField, Slider } from '@mui/material';
import { NavLink, useParams } from 'react-router-dom';

import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import BookmarkAdd from '@mui/icons-material/BookmarkAddOutlined';

const ProductList = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const { id: category_id } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/product/get_products/${category_id}`, { withCredentials: true });
        setAllProducts(response.data);
        setDisplayedProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [category_id]);

  useEffect(() => {
    const filteredProducts = allProducts.filter(product => {
      return product.name.toLowerCase().includes(searchTerm.toLowerCase()) && product.price >= priceRange[0] && product.price <= priceRange[1];
    });
    setDisplayedProducts(filteredProducts);
  }, [searchTerm, priceRange]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  return (
    <div style={{ paddingBottom: '5%'}}>
        <div >
            <div style={{ display: 'flex', justifyContent: 'center'}}>
                <TextField 
                    label="Поиск" 
                    value={searchTerm} 
                    onChange={handleSearchChange} 
                    style={{backgroundColor: 'white', width: '50%'  }}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Slider 
                value={priceRange} 
                onChange={handlePriceChange} 
                min={0} 
                max={5000} 
                style={{ width: '50%' }}
                />
            </div>
        </div>

      <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2} justifyContent="flex-start" alignItems="center" maxWidth="64.9%" mx="auto">
        {displayedProducts.map((product, index) => (
          <Card sx={{ width: 320 }}>
            <div>
              <Typography level="title-lg">{ product.name }</Typography>
            </div>
            <AspectRatio minHeight="120px" maxHeight="200px">
              <img
                src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
                srcSet="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286&dpr=2 2x"
                loading="lazy"
                alt=""
              />
            </AspectRatio>
            <CardContent orientation="horizontal">
              <div>
                <Typography level="body-xs">Total price:</Typography>
                <Typography fontSize="lg" fontWeight="lg">
                  { product.price } 
                </Typography>
              </div>
              <NavLink to={`/product/${product.id}`} key={index}>
                <Button
                  variant="solid"
                  size="md"
                  color="primary"
                  aria-label="Explore Bahamas Islands"
                  sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 600 }}
                >
                  Explore
                </Button>
              </NavLink>
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
};

export default ProductList;
