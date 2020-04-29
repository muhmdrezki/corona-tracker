
import axios from 'axios';
// Consts
import { FETCH_LOCATIONS, FILTER_LOCATION } from "../constans/index";

// Fetch Location List
export function fetchLocations() {
  return function(dispatch) {
    let config = {
      header : {
        'Content-Type' : 'application-json'
      }
    }
    return axios.get( 'https://coronavirus-tracker-api.herokuapp.com/v2/locations', config )
    .then(res => {
      if(res.data) {
        dispatch({ type: FETCH_LOCATIONS, payload: res.data });
      }
    }).catch(err => {
      dispatch({type: FETCH_LOCATIONS, payload: err });
    })
  }
};
// Filter Location
export function filterLocation(id) {
  return function(dispatch) {
    let config = {
      header : {
        'Content-Type' : 'application-json'
      }
    }
    return axios.get( 'https://coronavirus-tracker-api.herokuapp.com/v2/locations/' + id + '?source=jhu&timelines=true', config )
    .then(res => {
      if(res.data) {
        dispatch({ type: FILTER_LOCATION, payload: res.data });
      }
    }).catch(err => {
      dispatch({type: FILTER_LOCATION, payload: err });
    })
  }
}