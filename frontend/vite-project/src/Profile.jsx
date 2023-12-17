import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const Profile = ({ user }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/order/get_user_orders', { withCredentials: true })
            .then(response => setOrders(response.data))
            .catch(error => console.error('Error fetching orders:', error));
    }, []);

    const columns = [
        { field: 'order_detail_id', headerName: 'ID заказа', width: 150 },
        { field: 'product_id', headerName: 'ID продукта', width: 150 },
        { field: 'order_id', headerName: 'ID заказа', width: 150 },
        { field: 'status', headerName: 'Статус', width: 150 },
        { field: 'amount', headerName: 'Количество', width: 150 },
        { field: 'created_at', headerName: 'Дата создания', width: 200 },
        { field: 'user_id', headerName: 'ID пользователя', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'username', headerName: 'Имя пользователя', width: 200 },
        { field: 'registered_at', headerName: 'Дата регистрации', width: 200 },
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <h2>Профиль пользователя</h2>
            <DataGrid 
                rows={orders} 
                columns={columns} 
                pageSize={5} 
                getRowId={(row) => row.order_detail_id}
                sx={{
                    '& .MuiDataGrid-cell': {
                      color: 'white', // Изменение цвета текста ячеек
                    },
                    '& .MuiDataGrid-columnHeader': {
                      color: 'white', // Изменение цвета текста заголовков столбцов
                    },
                    '& .MuiDataGrid-footerContainer': {
                      color: 'white', // Изменение цвета текста в пагинации
                    },
                    '& .MuiTablePagination-actions': {
                      color: 'white', // Изменение цвета текста кнопок в пагинации
                    },
                    '& .MuiIconButton-label': {
                      color: 'white', // Изменение цвета текста иконок в пагинации
                    },
                }}
            />
        </div>
    );
};

export default Profile;
