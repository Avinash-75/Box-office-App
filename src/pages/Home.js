import React, { useState } from 'react';
import MainPageLayout from '../components/MainPageLayout';

// eslint-disable-next-line arrow-body-style
const Home = () => {
  const [input, setInput] = useState('');

  const onSearch = () => {
    // https://api.tvmaze.com/search/shows?q=girls
    fetch(`https://api.tvmaze.com/search/shows?q=${input}`)
      .then(r => r.json())
      .then(result => {
        console.log(result);
      });
  };

  const onInputChange = ev => {
    setInput(ev.target.value);
    // console.log(ev.target.value);
  };

  const onKeyDown = ev => {
    if (ev.keyCode === 13) {
      // console.log(ev.keyCode);
      onSearch();
    }
  };

  return (
    <MainPageLayout>
      <input
        type="text"
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        value={input}
      />
      <button type="button" onClick={onSearch}>
        Search
      </button>
    </MainPageLayout>
  );
};

export default Home;
