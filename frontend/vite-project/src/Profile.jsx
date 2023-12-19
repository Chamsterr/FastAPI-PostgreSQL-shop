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
      { field: 'order_id', headerName: 'ID заказа', width: 150 },
      { field: 'status', headerName: 'Статус', width: 150 },
      { field: 'amount', headerName: 'Количество', width: 150 },
      { field: 'created_at', headerName: 'Дата создания', width: 200 },
      { field: 'product_name', headerName: 'Название продукта', width: 150 },
    ];

    return (
        <div style={{ height: 400, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h2>Профиль пользователя</h2>
            <DataGrid 
                rows={orders} 
                columns={columns} 
                pageSize={5} 
                getRowId={(row) => row.order_id}
                sx={{
                    '& .MuiDataGrid-cell': {
                        color: 'white',
                    },
                    '& .MuiPaginationItem-root': {
                      backgroundColor: 'white',
                    },
                    '& .MuiDataGrid-columnHeader': {
                        color: 'white',
                    },
                    '& .MuiDataGrid-footerContainer': {
                        backgroundColor: 'white',
                    },
                    '& .MuiIconButton-label': {
                        color: 'white',
                    },
                }}
            />
        </div>
    );
};

export default Profile;
