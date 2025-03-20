import React, { useState, useContext } from 'react';
import { LocationContext } from '../context/locationContext';
const Search = () =>{
    const [searchText, setSearchText] = useState('');
    const {setLocation} = useContext(LocationContext)
    const handleSearch = () => {
        // Burada arama işlemlerini yapabilirsiniz
        console.log('Arama:', searchText);
        const sehir = searchText;
        setLocation(sehir);
    }

    return(
        <div>
            <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            <button onClick={handleSearch}>Git</button>
        </div>
    )

}
export default Search;