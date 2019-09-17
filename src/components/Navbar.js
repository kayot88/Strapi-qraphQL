import React, {Component} from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Box, Text, Image, Heading, Button } from 'gestalt';
import { getToken, clearCard, clearToken } from '../utils';
class Navbar extends Component {
  handlerSignout = () => {
    clearCard()
    clearToken()
    this.props.history.push('/')
  }
  
  render(){
    return getToken() !== null ? <AuthNavbar handlerSignout={this.handlerSignout} /> : <UnAuthNavbar />;

  }
};

const UnAuthNavbar = () => {
  return (
    <Box
      color="midnight"
      height={70}
      display="flex"
      alignItems="center"
      justifyContent="around"
    >
      <NavLink activeClassName="active" to="/signin">
        <Text size="xl" color="white">
          Sign in
        </Text>
      </NavLink>
      <NavLink activeClassName="active" to="/">
        <Box display="flex" alignItems="center">
          <Box width={50} height={50} margin={2}>
            <Image
              src="./icons/logo.svg"
              alt="BrewHaHa"
              naturalHeight={1}
              naturalWidth={1}
            ></Image>
          </Box>
          <Box>
            <Heading color="orange" size="xs">
              BrewHaHA
            </Heading>
          </Box>
        </Box>
      </NavLink>
      <NavLink activeClassName="active" to="/signup">
        <Text size="xl" color="white">
          Sign up
        </Text>
      </NavLink>
    </Box>
  );
};
const AuthNavbar = ({handlerSignout}) => {
  return (
    <Box
      color="midnight"
      height={70}
      display="flex"
      alignItems="center"
      justifyContent="around"
    >
      <NavLink activeClassName="active" to="/checkout">
        <Text size="xl" color="white">
          Checkout
        </Text>
      </NavLink>
      <NavLink activeClassName="active" to="/">
        <Box display="flex" alignItems="center">
          <Box width={50} height={50} margin={2}>
            <Image
              src="./icons/logo.svg"
              alt="BrewHaHa"
              naturalHeight={1}
              naturalWidth={1}
            ></Image>
          </Box>
          <Box>
            <Heading color="orange" size="xs">
              BrewHaHA
            </Heading>
          </Box>
        </Box>
      </NavLink>
      <Button
        onClick={handlerSignout}
        text="Sign out"
        color="transparent"
        inline
        size="md"
      ></Button>
    </Box>
  );
};

export default withRouter(Navbar);
