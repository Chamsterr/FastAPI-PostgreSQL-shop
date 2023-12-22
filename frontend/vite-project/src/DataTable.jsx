import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';

const DataTable = () => {
    const [rows, setRows] = React.useState([
        { id: 1, username: 'User1' },
        { id: 2, username: 'User2' },
        // добавьте больше пользователей здесь
    ]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'username', headerName: 'Username', width: 130 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Button variant="contained" color="secondary" onClick={() => handleDelete(params.row.id)}>
                    Удалить
                </Button>
            ),
        },
    ];

    const handleDelete = (id) => {
        setRows(rows.filter((row) => row.id !== id));
    };

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} pageSize={5} />
        </div>
    );
};

export default DataTable;
