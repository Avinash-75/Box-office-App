import React, { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { apiGet } from '../misc/Config';

const reducer = (prevState, action) => {
  switch (action.type) {
    case 'FETCH_SUCCESS': {
      return { isLoading: false, error: null, show: action.show };
    }

    case 'FETCH_FAILED': {
      return { isLoading: false, error: action.error };
    }

    default:
      return null;
  }
};

const InitialState = {
  show: null,
  isLoading: true,
  error: null,
};

// eslint-disable-next-line arrow-body-style
const Show = () => {
  const { id } = useParams();

  const [{ show, isLoading, error }, dispatch] = useReducer(
    reducer,
    InitialState
  ); // Destructure the state --> {show, isLoading, error}

  // const [show, setShow] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);

  let isMounted = true; // React doesn't know,show is unmounted,still try to update the states

  useEffect(() => {
    apiGet(`shows/${id}?embed[]=seasons&embed[]=cast`)
      .then(results => {
        if (isMounted) {
          dispatch({ type: 'FETCH_SUCCESS', show: results });

          // setShow(results);
          // setIsLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          dispatch({ type: 'FETCH_FAILED', error: err.message });

          // setError(err.message);
          // setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // console.log('state', state);

  console.log('show', show);

  if (isLoading) {
    return <div>Data is being Loaded...</div>;
  }

  if (error) {
    return <div>Error occured : {error}</div>;
  }

  return <div>This is Show Page</div>;
};

export default Show;
