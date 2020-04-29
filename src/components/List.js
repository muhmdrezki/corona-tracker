import React, { Component } from 'react'
// redux things
import { connect } from "react-redux";
// methods
import { fetchLocations, filterLocation } from '../redux/actions/index';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
//Bootstrap Components
import { Table, Spinner, Row, Col, Tabs, Tab, Form } from 'react-bootstrap';
// leaflets
import { Map, Marker, Popup, TileLayer } from "react-leaflet";

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
    }
  }

  componentDidMount() {
    this.props.fetchLocations().then(res => {
      if(this.props) {
        this.setState({ loaded: true });
      }
    });
  }

  getData(data) {
    this.setState({
      id: data.id,
      pop: true,
      lat: parseInt(data.coordinates.latitude),
      lng: parseInt(data.coordinates.longitude),
      zoom: 5,
      confirmed: data.latest.confirmed,
      deaths: data.latest.deaths,
      recovered: data.latest.recovered
    });
    console.log(data);
  }
  
  _handleChange = (id) => {
    this.setState({ loaded: false });
    this.props.filterLocation(id).then(res => {
      if(this.props) {
        this.setState({ loaded: true, filter: true });
        this.getData(this.props.location);
      }
    });
  }

  render() {
    return (
      <div style={{padding:'1%',marginTop:"0.5%"}}>
        <h2> Corona (Covid-19) Tracker </h2>
        <hr/>
        <Row>
          <Col lg={5} md={5} sm={12} xs={12}>
            <Form.Label>Cari Negara</Form.Label>
            <Form.Control as="select" custom className="formControl" defaultValue={this.state.selectLocation} onChange={(e) => this._handleChange(e.target.value)} >
              <option> Pilih </option>
              { this.state.loaded ? this.props.locations.map(el => (
                <option key={el.id} value={el.id}>{el.country}{ el.province ? ' - '+el.province : '' }</option>
              )) : <option> No Data </option> }
            </Form.Control>
            { !this.state.filter ? <div style={{ height:"420px", overflowY: "auto", marginTop: "10px"}}>
              <Table size="sm" bordered striped hover>
                <thead>
                  <tr>
                    <th> Locations </th>
                    <th> Confirmed </th>
                    <th> Deaths </th>
                    <th> Recovered </th>
                  </tr>
                </thead>
                <tbody>
                  { this.state.loaded ? this.props.locations.map(el => (
                    <tr key={el.id} onClick={() => this.getData(el)} style={{cursor:"pointer"}}>
                      <td>{el.country}{ el.province ? ' - '+el.province : '' }</td>
                      <td>{el.latest.confirmed}</td>
                      <td>{el.latest.deaths}</td>
                      <td>{el.latest.recovered}</td>
                    </tr>
                  ))  : <tr><td colSpan="4" align="center"><Spinner style={{marginTop:"10px", marginBottom:"10px"}} animation="border" role="status"><span className="sr-only">Loading....</span></Spinner></td></tr>}
                </tbody>
              </Table>
            </div> : <Table size="sm" bordered striped hover style={{ marginTop: "10px"}}>
                <thead>
                  <tr>
                    <th> Locations </th>
                    <th> Confirmed </th>
                    <th> Deaths </th>
                    <th> Recovered </th>
                  </tr>
                </thead>
                <tbody>
                  { this.state.loaded ?
                    <tr>
                      <td>{this.props.location.country}{ this.props.location.province ? ' - '+this.props.location.province : '' }</td>
                      <td>{this.props.location.latest.confirmed}</td>
                      <td>{this.props.location.latest.deaths}</td>
                      <td>{this.props.location.latest.recovered}</td>
                    </tr>
                  : <tr><td colSpan="4" align="center"><Spinner style={{marginTop:"10px", marginBottom:"10px"}} animation="border" role="status"><span className="sr-only">Loading....</span></Spinner></td></tr>}
                </tbody>
              </Table> }
          </Col>
          <Col lg={7} md={7} sm={12} xs={12}>
          <Tabs defaultActiveKey="map" id="uncontrolled-tab-example">
            <Tab eventKey="map" title="World Map">
              <div style={{padding: "1%"}}>
                <Map center={[this.state.lat, this.state.lng]} zoom={this.state.zoom}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  { this.state.pop ? <Marker
                      position={[
                        this.state.lat,
                        this.state.lng
                      ]}
                  /> : '' }
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
                  </Popup>
                   : '' }
                </Map>
              </div>
            </Tab>
            <Tab eventKey="statistic" title="Statistic">
              <h6>Here are graph</h6>
            </Tab>
          </Tabs>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    locations: state.locations,
    location: state.location
  };
}

export default connect(
  mapStateToProps,
  { fetchLocations, filterLocation }
)(List);