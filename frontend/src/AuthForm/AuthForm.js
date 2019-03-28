import React, { Component } from 'react';
// import CourtsideCounterAPI from '../util/CourtsideCounterAPI';
import { getUserData } from '../util/mockAPI';
import Button from '../Button';
import { Redirect } from 'react-router-dom';

class AuthForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      formType: null,
      errors: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (this.props.location.pathname === '/login') {
      this.setState({ formType: 'login' });
    } else {
      this.setState({ formType: 'signup' });
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    try {
      if (this.props.location.pathname === '/login') {
        // let token = await CourtsideCounterAPI.login({
        //   email: this.state.email
        // });
        let token = await getUserData();
        debugger;
        localStorage.setItem('token', token);
        this.setState({ email: '', name: '' });
        this.props.history.push('/players');
      } else {
        // let token = await CourtsideCounterAPI.signup({
        //   email: this.state.email,
        //   name: this.state.name,
        // });
        let token = await getUserData();
        localStorage.setItem('token', token);
        this.setState({ email: '', name: '' });
        this.props.history.push('/players');
      }
    } catch (err) {
      this.setState({ errors: err });
    }
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    if (this.props.currUser) return <Redirect to="/players" />;
    const nameInput = (
      <>
        <label htmlFor="name">Name: </label>
        <input
          onChange={this.handleChange}
          id="name"
          name="name"
          type="text"
          value={this.state.name}
        />
      </>
    );
    const errors = this.state.errors.map(err => <div>err</div>);
    return (
      <>
        {this.state.errors ? errors : null}
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="email">Email: </label>
          <input
            onChange={this.handleChange}
            id="email"
            name="email"
            type="text"
            value={this.state.email}
          />
          {this.state.formType === 'signup' ? nameInput : null}
          <Button>Submit</Button>
        </form>
      </>
    );
  }
}

export default AuthForm;
