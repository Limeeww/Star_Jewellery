const Image = ({ src, alt, width, height }) => (
    <img 
      src={src} 
      alt={alt} 
      width={width} 
      height={height} 
      data-mocked-image="true" 
    />
  );
  
  export default Image;