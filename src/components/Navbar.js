import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Text, Image, Heading } from 'gestalt';
const Navbar = () => {
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

export default Navbar;
