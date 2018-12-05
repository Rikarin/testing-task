
const URL = 'https://storage.googleapis.com/goostav-static-files/rh-easy-data-source.json';

const FETCH_TWITTER_DATA_BEGIN = 'FETCH_TWITTER_DATA_BEGIN';
const FETCH_TWITTER_DATA_END = 'FETCH_TWITTER_DATA_END';

const initialState = {
  twitterData: []
};

export const fetchTwitterData = (dispatch) => {
  dispatch({ type: FETCH_TWITTER_DATA_BEGIN });

  fetch(URL).then(async x => {
    const data = await x.json();

    dispatch({
      type: FETCH_TWITTER_DATA_END,
      payload: data.slice(-50)
    });
  });
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TWITTER_DATA_BEGIN:
      break;

    case FETCH_TWITTER_DATA_END:
      return {
        ...state,
        twitterData: action.payload
      };

    default:
  }

  return state;
};

export default rootReducer;