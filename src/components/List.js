import React, { Component } from 'react'
// redux things
import { connect } from "react-redux";
// methods
import { fetchLocations, filterLocation } from '../redux/actions/index';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
//Bootstrap Components
import { Table, Spinner, Row, Col, Card, Form } from 'react-bootstrap';
// leaflets
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
// chart JS
import { Line } from 'react-chartjs-2';
// moment js
var moment = require('moment');

export class List extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: null,
      loaded: false,
      filter: false,
      pop: false,
      lat: 51.505,
      lng: -0.09,
      zoom: 2,
      confirmed: 0,
      deaths: 0,
      recovered: 0,
      latest_graph_confirmed : {
        labels: [],
        datasets: []
      },
      latest_graph_deaths : {
        labels: [],
        datasets: []
      },
      latest_graph_recovered : {
        labels: [],
        datasets: []
      },
      all_coordinates: []
    }
  }

  // on load
  componentDidMount() {
    this.props.fetchLocations().then(res => { // call actions
      if(this.props) {
        this.setState({ loaded: true });
      }
    });
  }

  // when click one of table's row
  getData(data) {
    this.setState({
      id: data.id,
      pop: true,
      lat: parseInt(data.coordinates.latitude),
      lng: parseInt(data.coordinates.longitude),
      zoom: 5,
      confirmed: data.latest.confirmed,
      deaths: data.latest.deaths,
      recovered: data.latest.recovered,
    });
    this._handleChange(data.id, 'getdata');
  }
  // handle dropdown change
  _handleChange = (id, state) => {
    this.setState({ loaded: false }); // load state done
    if(id === "") { // if id is null or empty, load world wide data
      this.props.fetchLocations().then(res => { // call actions => fetchLocations()
        if(this.props) {
          this.setState({ 
            id: null,
            loaded: true,
            filter: false,
            pop: false,
            lat: 51.505,
            lng: -0.09,
            zoom: 2
          });
        }
      });
    } else {
      // if id is not null, load data based on id
      this.props.filterLocation(id).then(res => { // call actions => filterLocation()
        if(this.props) {
          this.setState({ loaded: true, filter: true });
          this.setState({ selectLocation: this.props.location.id });
          // map timeline object for line chart - START
          let labels_confirmed, labels_confirmed_formatted = []; 
          let labels_deaths, labels_deaths_formatted = [];
          let labels_recovered, labels_recovered_formatted = [];
          labels_confirmed = Object.keys(this.props.location.timelines.confirmed.timeline);
          labels_confirmed.map((el) => {
            labels_confirmed_formatted.push(moment(el).format('ll'));
          });
          labels_deaths = Object.keys(this.props.location.timelines.deaths.timeline);
          labels_deaths.map((el) => {
            labels_deaths_formatted.push(moment(el).format('ll'));
          });
          labels_recovered = Object.keys(this.props.location.timelines.recovered.timeline);
          labels_recovered.map((el) => {
            labels_recovered_formatted.push(moment(el).format('ll'));
          });
          this.setState({ 
            latest_graph_confirmed: {
              labels: labels_confirmed_formatted,
              datasets: [
                { label: 'Confirmed',data: Object.values(this.props.location.timelines.confirmed.timeline) }
              ]
            },
            latest_graph_deaths: {
              labels: labels_deaths_formatted,
              datasets: [
                { label: 'Deaths',data: Object.values(this.props.location.timelines.deaths.timeline) }
              ]
            },
            latest_graph_recovered: {
              labels: labels_recovered_formatted,
              datasets: [
                { label: 'Recovered',data: Object.values(this.props.location.timelines.recovered.timeline) }
              ]
            }
          });
          // map timeline object for line chart - END
          if(state !== 'getdata') {
            this.getData(this.props.location);
          }
        }
      });
    }
  }

  render() {
    return (
      <div style={{padding:'1%',marginTop:"0.5%"}}>
        {/* Map and dropdown START */}
        <Row> 
          <Col lg={3} md={3} sm={12} xs={12}>
            <Card>
              <Card.Body>
                <h5> Coronavirus (COVID-19) </h5>
                <hr/>
                <Form.Group>
                  <Form.Control as="select" custom className="formControl" value={this.state.selectLocation} onChange={(e) => this._handleChange(e.target.value)} >
                    <option value=""> Worldwide </option>
                    { this.state.loaded ? this.props.locations.map(el => (
                      <option key={el.id} value={el.id}>{el.country}{ el.province ? ' - '+el.province : '' }</option>
                    )) : <option> No Data </option> }
                  </Form.Control>
                </Form.Group>
                <hr/>
                { !this.state.filter ? 
                  this.state.loaded ? <Row>
                    <Col lg={4}>
                      <small className="textMuted">Confirmed</small>
                      <h6>{this.props.latest.confirmed}</h6>
                    </Col>
                    <Col lg={4}>
                      <small className="textMuted">Deaths</small>
                      <h6>{this.props.latest.deaths}</h6>
                    </Col>
                    <Col lg={4}>
                      <small className="textMuted">Recovered</small>
                      <h6>{this.props.latest.recovered}</h6>
                    </Col>
                  </Row> : <div><Spinner style={{marginTop:"10px", marginBottom:"10px"}} animation="border" role="status"><span className="sr-only">Loading....</span></Spinner><h5>Please Wait...</h5></div>
                : this.state.loaded ? <Row>
                    <Col lg={4}>
                      <small className="textMuted">Confirmed</small>
                      <h6>{this.props.location.latest.confirmed}</h6>
                    </Col>
                    <Col lg={4}>
                      <small className="textMuted">Deaths</small>
                      <h6>{this.props.location.latest.deaths}</h6>
                    </Col>
                    <Col lg={4}>
                      <small className="textMuted">Recovered</small>
                      <h6>{this.props.location.latest.recovered}</h6>
                    </Col>
                  </Row> : <div><Spinner style={{marginTop:"10px", marginBottom:"10px"}} animation="border" role="status"><span className="sr-only">Loading....</span></Spinner><h5>Please Wait...</h5></div>
                }
              </Card.Body>
            </Card>
          </Col>
          <Col lg={9} md={9} sm={12} xs={12}> 
            <div>
              <Map center={[this.state.lat, this.state.lng]} zoom={this.state.zoom}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                { this.state.loaded ? this.props.locations.map(el => (
                      <Marker key={el.id} position={[
                        el.coordinates.latitude, el.coordinates.longitude
                      ]}/>
                    ))
                : '' }
                { this.state.pop ? <Popup
                  position={[
                    this.state.lat,
                    this.state.lng
                  ]}
                  onClose={() => {
                    this.setState({pop:false})
                  }}
                >
                  <div>
                    <span>Confirmed:{this.state.confirmed}</span> <br/>
                    <span>Deaths:{this.state.deaths}</span> <br/>
                    <span>Recovered:{this.state.recovered}</span>
                  </div>
                </Popup> : '' }
              </Map>
            </div>
          </Col>
        </Row>
        {/* Map and dropdown END */}
        <hr/>
        <div className="text-center">
          <h4> CASES </h4>
        </div>
        {/* Table START */}
        <Row>
          <Col lg={2} md={2} sm={12} xs={12}></Col>
          <Col lg={8} md={8} sm={12} xs={12}>            
            { !this.state.filter ? <div style={{ height:"420px", overflowY: "auto", marginTop: "12px"}}>
              <Table size="sm" bordered striped hover>
                <thead>
                  <tr>
                    <th> Locations </th>
                    <th> Confirmed </th>
                    <th> Deaths </th>
                    <th> Recovered </th>
                    <th> Last Update </th>
                  </tr>
                </thead>
                <tbody>
                  { this.state.loaded ? this.props.locations.map(el => (
                    <tr key={el.id} onClick={() => this.getData(el)} style={{cursor:"pointer"}}>
                      <td>{el.country}{ el.province ? ' - '+el.province : '' }</td>
                      <td>{el.latest.confirmed}</td>
                      <td>{el.latest.deaths}</td>
                      <td>{el.latest.recovered}</td>
                      <td>{el.last_updated}</td>
                    </tr>
                  ))  : <tr><td colSpan="5" align="center"><Spinner style={{marginTop:"10px", marginBottom:"10px"}} animation="border" role="status"><span className="sr-only">Loading....</span></Spinner></td></tr>}
                </tbody>
              </Table>
            </div> : <Table size="sm" bordered striped hover style={{ marginTop: "10px"}}>
                <thead>
                  <tr>
                    <th> Locations </th>
                    <th> Confirmed </th>
                    <th> Deaths </th>
                    <th> Recovered </th>
                    <th> Last Update </th>
                  </tr>
                </thead>
                <tbody>
                  { this.state.loaded ?
                    <tr>
                      <td>{this.props.location.country}{ this.props.location.province ? ' - '+this.props.location.province : '' }</td>
                      <td>{this.props.location.latest.confirmed}</td>
                      <td>{this.props.location.latest.deaths}</td>
                      <td>{this.props.location.latest.recovered}</td>
                      <td>{this.props.location.last_updated}</td>
                    </tr>
                  : <tr><td colSpan="5" align="center"><Spinner style={{marginTop:"10px", marginBottom:"10px"}} animation="border" role="status"><span className="sr-only">Loading....</span></Spinner></td></tr>}
                </tbody>
                </Table> }
          </Col>
          <Col lg={2} md={2} sm={12} xs={12}></Col>
        </Row>
        {/* Table END */}
        <hr/>
        <h5 className="text-center"> MORE STATS (CHOOSE COUNTRY FIRST)</h5>
        {/* Chart START */}
        { this.state.filter ? <div><Row style={{marginTop:"20px", height:"300px"}}>
          <Col lg={2} md={2} sm={12} xs={12}></Col>
          <Col lg={8} md={8} sm={12} xs={12}>
            { this.state.loaded ? <Line data={this.state.latest_graph_confirmed} options={{ maintainAspectRatio: false }} redraw/> : ''}
          </Col>
          <Col lg={2} md={2} sm={12} xs={12}></Col>
        </Row>
        <Row style={{marginTop:"20px", height:"300px"}}>
          <Col lg={2} md={2} sm={12} xs={12}></Col>
          <Col lg={8} md={8} sm={12} xs={12}>
            { this.state.loaded ? <Line data={this.state.latest_graph_deaths} options={{ maintainAspectRatio: false }} redraw/> : ''}
          </Col>
          <Col lg={2} md={2} sm={12} xs={12}></Col>
        </Row>
        <Row style={{marginTop:"20px", height:"300px"}}>
          <Col lg={2} md={2} sm={12} xs={12}></Col>
          <Col lg={8} md={8} sm={12} xs={12}>
            { this.state.loaded ? <Line data={this.state.latest_graph_recovered} options={{ maintainAspectRatio: false }} redraw/> : ''}
          </Col>
          <Col lg={2} md={2} sm={12} xs={12}></Col>
        </Row></div> : ''}
        {/* Chart END */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    locations: state.locations,
    location: state.location,
    latest: state.latest
  };
}

export default connect(
  mapStateToProps,
  { fetchLocations, filterLocation }
)(List);