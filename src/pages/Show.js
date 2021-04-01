import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGet } from '../misc/Config';

// eslint-disable-next-line arrow-body-style
const Show = () => {
  const { id } = useParams();

  const [show, setShow] = useState(null);

  useEffect(() => {
    apiGet(`shows/${id}?embed[]=seasons&embed[]=cast`).then(results => {
      setShow(results);
    });
  }, [id]);

  console.log('show', show);

  return <div>This is Show Page</div>;
};

export default Show;
