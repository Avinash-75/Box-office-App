import { useReducer, useEffect, useState, useCallback } from 'react';
import { apiGet } from './Config';

function showsReducer(prevState, action) {
  switch (action.type) {
    case 'ADD': {
      return [...prevState, action.showId];
    }
    case 'REMOVE': {
      return prevState.filter(showId => showId !== action.showId);
    }
    default:
      return prevState;
  }
}

function usePersistedReducer(reducer, InitialState, key) {
  // key is for local storage
  const [state, dispatch] = useReducer(reducer, InitialState, initial => {
    const persisted = localStorage.getItem(key);

    return persisted ? JSON.parse(persisted) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  return [state, dispatch];
}

export function useShows(key = 'shows') {
  return usePersistedReducer(showsReducer, [], key);
}

export function useLastQuery(key = 'lastQuery') {
  const [input, setInput] = useState(() => {
    const persisted = sessionStorage.getItem(key);

    return persisted ? JSON.parse(persisted) : '';
  });

  const setPersistedInput = useCallback(
    newState => {
      setInput(newState);
      sessionStorage.setItem(key, JSON.stringify(newState));
    },
    [key]
  );

  return [input, setPersistedInput]; // problem :- setInput wouldn't write to session storage
}

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

export function useShow(showId) {
  const [state, dispatch] = useReducer(reducer, {
    show: null,
    isLoading: true,
    error: null,
  }); // Destructure the state --> {show, isLoading, error}

  // const [show, setShow] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);

  let isMounted = true; // React doesn't know,show is unmounted,still try to update the states

  useEffect(() => {
    apiGet(`shows/${showId}?embed[]=seasons&embed[]=cast`)
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
    };
  }, [showId]);

  return state;
}

// export function useWhyDidYouUpdate(name, props) {
//   // Get a mutable ref object where we can store props ...
//   // ... for comparison next time this hook runs.
//   const previousProps = useRef();

//   useEffect(() => {
//     if (previousProps.current) {
//       // Get all keys from previous and current props
//       const allKeys = Object.keys({ ...previousProps.current, ...props });
//       // Use this object to keep track of changed props
//       const changesObj = {};
//       // Iterate through keys
//       allKeys.forEach(key => {
//         // If previous is different from current
//         if (previousProps.current[key] !== props[key]) {
//           // Add to changesObj
//           changesObj[key] = {
//             from: previousProps.current[key],
//             to: props[key],
//           };
//         }
//       });

//       // If changesObj not empty then output to console
//       if (Object.keys(changesObj).length) {
//         console.log('[why-did-you-update]', name, changesObj);
//       }
//     }

//     // Finally update previousProps with current props for next hook call
//     previousProps.current = props;
//   });
// }
