//this is where we will put our api requests
const API_URL = process.env.REACT_APP_API_URL;

//pass in the nextCursor here to pass on to the API/node server and then on to cloudinary to tell them we want the next batch of images
//the api for cloudinary says to pass the next cursor in as a url query param
export const getImages = async (nextCursor) => {
    const params = new URLSearchParams();

    //check that the nextCursor has a value before appending it to the params
    if(nextCursor){
        params.append('next_cursor', nextCursor);
    }

    const response = await fetch(`${API_URL}/photos?${params}`, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
           }
    }).then((response) => response.json());
    //const responseJson = await response.json();

    return response;
}

//accepts the value from the search bar as a param
export const searchImages = async(searchValue,nextCursor) => {
    const params = new URLSearchParams();
    params.append(`expression`, searchValue);

    //check to see if nextCursor has value and if so append that to the query params as well
    if(nextCursor){
        params.append('next_cursor', nextCursor)
    }

    //create fetch request that will call our node api search endpoint
    const response = await fetch(`${API_URL}/search?${params}`);
    const responseJson = await response.json();

    return responseJson;
}
