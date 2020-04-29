
import { FETCH_LOCATIONS, FILTER_LOCATION } from "../constans/index";

const initialState = {
  locations: {},
  location: {},
};

function rootReducer(state = initialState, action) {
  if(action.type === FETCH_LOCATIONS) {
    state.locations = [];
    let object = state.locations.concat(action.payload);
    let new_object = Object.assign({}, state, object[0]);
    return new_object;
  }
  if(action.type === FILTER_LOCATION) {
    state.location = [];
    let object = state.location.concat(action.payload);
    let new_object = Object.assign({}, state, object[0]);
    return new_object;
  }
  return state;
};

export default rootReducer;