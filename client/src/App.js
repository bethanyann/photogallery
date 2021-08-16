import React, { Component, useEffect, useState } from 'react';
import { getImages, searchImages } from './api';
// import images from './api-mock.json';
import './App.css'

const App = () => {
  //console.log("images", images)
  const [imageList, setImageList] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  //state hook to hold search value
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
			const responseJson = await getImages();
			setImageList(responseJson.resources);
      //grab the 'next cursor' property if there is one  to load the next batch of images
      setNextCursor(responseJson.next_cursor);
		};

		fetchData();
  }, []);

  const handleLoadMoreButtonClick = async () => {
    const responseJson = await getImages(nextCursor);
    //since the api will return more images if 'nextCursor' has a value, don't overwrite the existing photos
    //append the next batch of photos to the current list
    //so create an arrow function and pass in the currentImageList as what is currently in the state
    //and then create a new array, spreading the existing array and appending the new one
    setImageList((currentImageList) => [...currentImageList, ...responseJson.resources]);
    //and then set the new next_cursor value from the response into the state if there is one
    setNextCursor(responseJson.next_cursor);
  }

  const handleSearchFormSubmit = async (event) => {
    //prevent the form from doing a post and refreshing the page
    event.preventDefault();
    if(!searchValue || searchValue === '' ) return; //maybe set a modal to show a message that nothing was found ?
    const responseJson = await searchImages(searchValue, nextCursor);
    setImageList(responseJson.resources);
    setNextCursor(responseJson.next_cursor);
  }

  const resetForm = async () => {
    //get the first bunch of images
    const responseJson = await getImages();
    setImageList(responseJson.resources);
    setNextCursor(responseJson.next_cursor);
    //resetting the search value to an empty string
    setSearchValue('');
  }

  return (
    <div>
      <form onSubmit={handleSearchFormSubmit}>
        <input value={searchValue} onChange ={(event) => setSearchValue(event.target.value)} require="required" placeholder='Enter a search value..' ></input>
        <button type='submit'>Search</button>
        <button type="button" onClick={resetForm}>Clear</button>
      </form>
      <div className='image-grid'>
        {imageList.map((image) => <img key={image.public_id} src={image.url} alt={image.public_id} className="image-class"></img>)}
      </div>
      <div className='footer button-div'> 
          {nextCursor && <button className='load-more-button' onClick={handleLoadMoreButtonClick}>Load More</button>}
      </div>
    </div>
    )
}

export default App;