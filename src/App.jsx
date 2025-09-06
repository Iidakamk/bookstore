import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBook from './AddBook';
import './App.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([AllCommunityModule]);

function App() {
  const [books, setBooks] = useState([]);

  const [colDefs] = useState([
    { field: 'title', sortable: true, filter: true },
    { field: 'author', sortable: true, filter: true },
    { field: 'year', sortable: true, filter: true },
    { field: 'isbn', sortable: true, filter: true },
    { field: 'price', sortable: true, filter: true },
    {
      headerName: '',
      field: 'id',
      width: 90,
      cellRenderer: params =>
        <IconButton onClick={() => deleteBook(params.value)} size="small" color="error">
          <DeleteIcon />
        </IconButton>
    }
  ]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    fetch('https://kirjakauppa-8c078-default-rtdb.europe-west1.firebasedatabase.app/books.json')
      .then(res => res.json())
      .then(data => addKeys(data))
      .catch(err => console.error(err));
  };

  const addKeys = (data) => {
    if (!data) {
      setBooks([]);
      return;
    }
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) =>
      Object.defineProperty(item, 'id', { value: keys[index] })
    );
    setBooks(valueKeys);
  };

  const addBook = (newBook) => {
    fetch('https://kirjakauppa-8c078-default-rtdb.europe-west1.firebasedatabase.app/books.json', {
      method: 'POST',
      body: JSON.stringify(newBook)
    })
      .then(() => fetchBooks())
      .catch(err => console.error(err));
  };

  const deleteBook = (id) => {
    fetch(`https://kirjakauppa-8c078-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`, {
      method: 'DELETE'
    })
      .then(() => fetchBooks())
      .catch(err => console.error(err));
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">Bookstore</Typography>
        </Toolbar>
      </AppBar>
      <AddBook addBook={addBook} />
      <div className="ag-theme-alpine" style={{ height: 500, width: 900, margin: 'auto' }}>
        <AgGridReact
          rowData={books}
          columnDefs={colDefs}
        />
      </div>
    </>
  );
}

export default App;
