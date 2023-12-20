import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, TextField, Slider, Pagination } from '@mui/material';
import { NavLink, useParams } from 'react-router-dom';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';

const ProductList = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState([]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    const { id: category_id } = useParams();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/product/get_products/${category_id}`, { withCredentials: true });
                setAllProducts(response.data);
                setDisplayedProducts(response.data.slice((page - 1) * itemsPerPage, page * itemsPerPage));
                if (response.data.length > 0) {
                    const min = Math.min(...response.data.map(product => product.price));
                    const max = Math.max(...response.data.map(product => product.price));
                    setMinPrice(min);
                    setMaxPrice(max);
                    setPriceRange([min, max]);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, [category_id, page]);

    useEffect(() => {
        const filteredProducts = allProducts.filter(product => {
            return product.name.toLowerCase().includes(searchTerm.toLowerCase()) && product.price >= priceRange[0] && product.price <= priceRange[1];
        });
        setDisplayedProducts(filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage));
    }, [searchTerm, priceRange, page]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const marks = [
        { value: minPrice, label: <span style={{ color: 'white' }}>{minPrice.toString()}</span> },
        { value: maxPrice, label: <span style={{ color: 'white' }}>{maxPrice.toString()}</span> },
    ];

    return (
        <div style={{ paddingBottom: '5%' }}>
            <div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <TextField label="Поиск" value={searchTerm} onChange={handleSearchChange} style={{ backgroundColor: 'white', width: '50%' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', margin: "35px 0 0 0" }}>
                    <Slider valueLabelDisplay="on" value={priceRange} onChange={handlePriceChange} min={minPrice} max={maxPrice} marks={marks} style={{ width: '50%' }} />
                </div>
                <br/>
            </div>
            <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2} justifyContent="flex-start" alignItems="center" maxWidth="64.9%" mx="auto">
                {displayedProducts.map((product, index) => (
                    <Card sx={{ width: 320 }}>
                        <div>
                            <Typography level="title-lg">{product.name}</Typography>
                        </div>
                        <AspectRatio minHeight="120px" maxHeight="200px">
                            <img src={product.image} loading="lazy" alt="" />
                        </AspectRatio>
                        <CardContent orientation="horizontal">
                            <div>
                                <Typography level="body-xs">Total price:</Typography>
                                <Typography fontSize="lg" fontWeight="lg">
                                    {product.price}
                                </Typography>
                            </div>
                            <NavLink to={`/product/${product.id}`} key={index}>
                                <Button variant="solid" size="md" color="primary" aria-label="Explore Bahamas Islands" sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 600 }}>
                                    Подробнее
                                </Button>
                            </NavLink>
                        </CardContent>
                    </Card>
                ))}
            </Box>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2%' }}>
                <Pagination
                  count={Math.ceil(allProducts.length / itemsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: 'white',
                      backgroundColor: '#1976d2',
                    },
                    '& .Mui-selected': {
                      color: 'white',
                      backgroundColor: '#0d47a1',
                    },
                    '& .MuiPaginationItem-ellipsis': {
                      color: 'white',
                    },
                  }}
                />
            </div>
        </div>
    );
};
export default ProductList;