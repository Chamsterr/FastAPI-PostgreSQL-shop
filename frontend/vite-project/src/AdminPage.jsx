import React from 'react';
import DataTable from './DataTable';

const AdminPage = () => {
    return (
        <div>
            <h1>Административная панель</h1>
            <p>Добро пожаловать в административную панель!</p>

            <DataTable></DataTable>
        </div>
    );
};

export default AdminPage;
