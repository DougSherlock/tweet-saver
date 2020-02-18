import React, { useState } from 'react';
import './App.css';

function SearchBar(props) {
  const [text, setText] = useState('');
  const execSearch = (e) => {
      e.preventDefault();
      props.execSearch(text);
  }
  const onTextChange = (e) => {
      setText(e.target.value);
  }
  return (
    <form className="SearchBar" onSubmit={execSearch}>
      <input type="text" name="searchText" onChange={onTextChange} />
      <input type="submit" value="Search" />
    </form>
  );
}

export default SearchBar;
