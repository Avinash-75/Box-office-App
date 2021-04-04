import React, { useState, useCallback } from 'react';
import ActorGrid from '../components/actor/ActorGrid';
import CustomRadio from '../components/CustomRadio';
import MainPageLayout from '../components/MainPageLayout';
import ShowGrid from '../components/show/ShowGrid';
import { apiGet } from '../misc/Config';
import { useLastQuery } from '../misc/Custom-hooks';
import {
  RadioInputsWrapper,
  SearchButtonWrapper,
  SearchInput,
} from './Home.styled';

const renderResults = results => {
  if (results && results.length === 0) {
    return <div>No Results</div>;
  }

  if (results && results.length > 0) {
    return results[0].show ? (
      <ShowGrid data={results} /> // results.map(item => <div key={item.show.id}>{item.show.name}</div>)
    ) : (
      <ActorGrid data={results} /> // results.map(item => ( <div key={item.person.id}>{item.person.name}</div> )
    );
  }

  return null;
};

// eslint-disable-next-line arrow-body-style
const Home = () => {
  const [input, setInput] = useLastQuery();
  const [results, setResult] = useState(null);
  const [searchOption, setSearchOption] = useState('shows');

  const isShowsSearch = searchOption === 'shows';

  const onSearch = () => {
    apiGet(`/search/${searchOption}?q=${input}`).then(result => {
      setResult(result);
      // console.log(result);
    });
  };

  const onInputChange = useCallback(
    ev => {
      setInput(ev.target.value);
      // console.log(ev.target.value);
    },
    [setInput]
  );

  const onKeyDown = ev => {
    if (ev.keyCode === 13) {
      // console.log(ev.keyCode);
      onSearch();
    }
  };

  const onRadioChange = useCallback(ev => {
    setSearchOption(ev.target.value);
  }, []);

  return (
    <MainPageLayout>
      <SearchInput
        type="text"
        placeholder="Search for something"
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        value={input}
      />

      <RadioInputsWrapper>
        <div>
          <CustomRadio
            label="Shows"
            id="shows-search"
            value="shows"
            checked={isShowsSearch}
            onChange={onRadioChange}
          />
          {/* <label htmlFor="shows-search">
            Shows
            <input
            id="shows-search"
              type="radio"
              value="shows"
              checked={isShowsSearch}
              onChange={onRadioChange}
            />
          </label> */}
        </div>

        <div>
          <CustomRadio
            label="Actors"
            id="actors-search"
            value="people"
            checked={!isShowsSearch}
            onChange={onRadioChange}
          />

          {/* <label htmlFor="actors-search">
            Actors
            <input
              id="actors-search"
              type="radio"
              value="people"
              checked={!isShowsSearch}
              onChange={onRadioChange}
            />
          </label> */}
        </div>
      </RadioInputsWrapper>

      <SearchButtonWrapper>
        <button type="button" onClick={onSearch}>
          Search
        </button>
      </SearchButtonWrapper>

      {renderResults(results)}
    </MainPageLayout>
  );
};

export default Home;
