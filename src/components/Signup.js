import React, { Component } from 'react';
import { Container, Box, Text, Button, Heading, TextField } from 'gestalt';
import { required, email, password, lt } from '../utils/validation';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import ToastMessage from './ToastMessage';
import { setToken } from '../utils';
import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);
// import PropTypes from 'prop-types';

class Signup extends Component {
  state = {
    username: '',
    password: '',
    email: '',
    showToast: false,
    toastMessage: '',
    loading: false
  };

  handleSubmit = async e => {
    e.preventDefault();
    console.log(this.state);
    const { password, email, username } = this.state;
    if (this.checkIsEmpty(this.state)) {
      this.showToast('Fill all of the field');
    }
    try {
      this.setState({ loading: true, showToast: true });
      const response = await strapi.register(password, email, username);
      this.setState({ loading: false });
      setToken(response.jwt)
      console.log(response);
      this.redirectUser('/')
    } catch (error) {
      console.error(error);
      this.setState({ loading: false });
      this.showToast(error.message);
    }
  };

  redirectUser=(path) => {
    this.props.history.push(path)
  }
  
  showToast = toastText => {
    if (toastText) {
      this.setState({ showToast: true, toastMessage: toastText });
      setTimeout(() => {
        this.setState({ showToast: false, toastMessage: '' });
      }, 3000);
    }
  };

  checkIsEmpty = ({ username, password, email }) => {
    return !username || !password || !email;
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
    // console.log(this.state);
  };

  render() {
    const { toastMessage, showToast, loading } = this.state;
    return (
      <Container>
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: '#ebe2da'
            }
          }}
          margin={4}
          padding={4}
          shape="rounded"
          display="flex"
          justifyContent="center"
        >
          <Form
            onSubmit={this.handleSubmit}
            style={{
              display: 'inlineBlock',
              textAlign: 'center',
              maxWidth: 450
            }}
          >
            <Box display="flex" direction="column" alignItems="center">
              <Heading color="midnight">Lets get started</Heading>
              <Text italic color="orchid">
                Sign up to order some brew
              </Text>
            </Box>

            <Input
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.handleChange}
              validations={[required]}
            />
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              onChange={this.handleChange}
              validations={[email]}
            />
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.handleChange}
              // maxLength={6}
              minLength={6}
              validations={[lt]}
            />
            <Button inline disabled={loading} color="blue" text="Submit" type="submit"></Button>
          </Form>
        </Box>
        <ToastMessage show={showToast} message={toastMessage} />
      </Container>
    );
  }
}
// Signup.propTypes = {};

export default Signup;
