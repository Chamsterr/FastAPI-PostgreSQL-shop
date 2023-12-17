import React, { useEffect, useState } from 'react';
import { Box, ListItem, ListItemText } from '@mui/material';
import ProductList from './ProductList.jsx';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

const CategoryPanel = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8000/catergory/get_categories', { credentials: 'include' });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Ошибка при получении категорий:', error);
            }
        };

        fetchCategories();
    }, []); 

    const fetchProducts = async (categoryId) => {
        try {
            console.log(categoryId)
            const response = await axios.get(`http://localhost:8000/product/get_products/${categoryId}`);
            setProducts(response.data);
        } catch (error) {
            console.error(`Ошибка при получении продуктов для категории ${categoryId}:`, error);
        }
    };

    return (
        <div>
            <Box display="flex" flexDirection="row" flexWrap="wrap">
                {categories.map((category, index) => (
                    <NavLink to={`/category/${category.id}`} key={index}>
                        <ListItem sx={{ width: 'auto' }} onClick={() => fetchProducts(category.id)}>
                            <ListItemText primary={category.name} />
                        </ListItem>
                    </NavLink>
                ))}
            </Box>
         </div>
    );
};

export default CategoryPanel;
