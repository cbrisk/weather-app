import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zip: '',
      weather: null,
      favorites: [],
      display: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDisplay = this.handleDisplay.bind(this);
    this.removeZip = this.removeZip.bind(this);
    this.addFavorite = this.addFavorite.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  handleChange(event) {
    this.setState({ zip: event.target.value });
  }

  resetState(zipCode) {
    this.setState({
      zip: zipCode
    }, () => {
      this.handleSubmit();
    });
  }

  handleSubmit(event) {
    this.setState({ display: false });
    const { zip } = this.state;
    if (event) {
      event.preventDefault();
    }
    if (zip.length !== 5) {
      window.alert("Zip Code must be 5 digits");
    }
    fetch(`/api/weather/${zip}`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          weather: data
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  addFavorite(zip, name) {
    const body = { zip, name };
    fetch(`/api/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  removeZip(zip) {
    fetch(`/api/favorites/${zip}`, {
      method: 'DELETE'
    })
      .catch(error => {
        console.error('Error:', error);
      });
    let copyFavs = this.state.favorites.slice();
    copyFavs = copyFavs.filter(item => item.zip !== zip);
    this.setState({
      favorites: copyFavs
    });
  }

  handleDisplay() {
    fetch(`/api/favorites`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          favorites: data
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
    this.setState({display: true});
  }

  renderTemp() {
    if (this.state.weather) {
      const { name, main, weather, rain, wind } = this.state.weather;
      const temperature = Math.round(main.temp);
      const desc = weather[0].main;
      const rainfall = rain ? Math.round(rain['1h']) : 0;
      const windSpeed = Math.round(wind.speed);
      return (
        <div className="card mt-3">
          <div className="card mt-0" >
            <div className="card-body mt-0">
              <h4 className="card-title grey">
                {name}
              </h4>
              <div className="row">
                <div className="col-sm-4">
                  <h1 className="grey">{`${temperature}°`}</h1>
                  <h6 className="grey">{desc}</h6>
                </div>
                <div className="col-sm-4 col-5">

                </div>
                <div className="col-sm-4">
                  <h5 className="grey">{`Precipitation ${rainfall}%`}</h5>
                  <h5 className="grey">{`Humidity ${main.humidity}%`}</h5>
                  <h5 className="grey">{`Wind ${windSpeed} mph`}</h5>
                  <div className="row" >
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4 col-5"></div>
                    <div className="col-sm-4"></div>
                  </div>
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => this.addFavorite(this.state.zip, name)}>Add to favorites</button>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    let element;
    if (this.state.display && this.state.favorites.length) {
      element = this.state.favorites.map((item, index) => {
        return (
          <li className="list-group-item d-flex justify-content-between py-4 grey" key={index}>
            <div className="city" onClick={() => this.resetState(item.zip)}>
              {item.city}
            </div>
            <button type="button" className="btn btn-default" onClick={() => this.removeZip(item.zip)}>X</button>
          </li>
        );
      });
    }

    return (
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="navbar-nav mr-auto">
            </div>
            <form className="form-inline my-2 my-lg-0" onSubmit={this.handleSubmit} _lpchecked="1">
              <input className="form-control mr-sm-2" type="text" required placeholder="Zip Code" aria-label="Zip Code" value={this.state.value} onChange={this.handleChange} onFocus={this.handleDisplay} />
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
          </div>
        </nav>
        <div>
          { element }
        </div>
        <div>
          {this.renderTemp()}
        </div>
      </div>
    );
  }
}
