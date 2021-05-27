import React from 'react';
import ContentLoader from 'react-content-loader';

const CardLoader = () => (
  <ContentLoader 
    speed={1}
    width="100%"
    height={360}
    backgroundColor="#ecebeb"
    foregroundColor="#d6d2d2"
  >
    <rect x="0" y="0" rx="10" ry="10" width="2000" height="70" />
    <rect x="0" y="150" rx="10" ry="10" width="2000" height="70" />
  </ContentLoader>
)

export default CardLoader;