import React, { Component, Fragment } from 'react';

import {
  Container,
  Box,
  Heading,
  Card,
  Image,
  Text,
  SearchField,
  Icon,
  Spinner
} from 'gestalt';
import { Link } from 'react-router-dom';

import './App.css';
import Loader from './Loader';
import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class App extends Component {
  state = { brands: [], searchText: '', loadingBrands: true };
  async componentDidMount() {
    try {
      const response = await strapi.request('POST', '/graphql', {
        data: {
          query: `query{
  brands{
    _id
    name
    description
    image{
      id
      url
      name
    }
  }
}
    `
        }
      });
      // console.log(response);
      this.setState({
        brands: response.data.brands,
        loadingBrands: false
      });
      // console.log(this.state);
    } catch (error) {
      console.error(error);
    }
  }
  handleChange = ({ value }) => {
    this.setState({
      searchText: value,
      loadingBrands: false
    });
    // console.log(this.state.searchText);
  };
  filteredBrands = ({ searchText, brands }) => {
    return brands.filter(brand => {
      return (
        brand.name.toLowerCase().includes(searchText.toLowerCase()) ||
        brand.description.toLowerCase().includes(searchText.toLowerCase())
      );
    });
  };

  render() {
    const { searchText, loadingBrands } = this.state;

    return (
      <Fragment>
        <Container>
          <Box display="flex" justifyContent="center" direction="column">
            <Heading size="md" color="midnight">
              Brew Brands
            </Heading>
            <Box display="flex" justifyContent="center">
              <SearchField
                accessibilityLabel="Search field"
                value={searchText}
                id="Search"
                onChange={this.handleChange}
              />
              <Box margin={2}>
                <Icon
                  accessibilityLabel="Filter"
                  color={searchText ? 'orange' : 'gray'}
                  size={20}
                  icon="filter"
                />
              </Box>
            </Box>
          </Box>
          <Box
            wrap
            dangerouslySetInlineStyle={{
              __style: {
                backgroundColor: '#d6c8ec'
              }
            }}
            shape="rounded"
            display="flex"
            justifyContent="around"
            // margin={100}
          >
            {this.filteredBrands(this.state).map(brand => (
              <Box
                paddingY={4}
                display="flex"
                justifyContent="center"
                margin={2}
                maxWidth={200}
                maxHeight={400}
                key={brand._id}
              >
                <Card
                  height={400}
                  width={200}
                  marginRight={100}
                  display="flex"
                  justifyContent="center"
                  image={
                    <Box
                      display="flex"
                      // alignItems="center"
                      justifyContent="center"
                      height={200}
                      width={200}
                    >
                      <Image
                        fit="cover"
                        alt="brandImage"
                        naturalHeight={1}
                        naturalWidth={1}
                        src={`${apiUrl}${brand.image.url}`}
                      ></Image>
                    </Box>
                  }
                >
                  <Box
                    display="flex"
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text margin={2} bold>
                      {brand.name}
                    </Text>
                    <Text textAlign="center" margin={2}>
                      {brand.description}
                    </Text>
                    <Text margin={2} size="xl">
                      <Link to={`/${brand._id}`}>See brew </Link>
                    </Text>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
          {/* <Spinner
            show={loadingBrands}
            accessibilityLabel="Loading spinner"
          ></Spinner> */}
          {loadingBrands && <Loader/>}
        </Container>
      </Fragment>
    );
  }
}

export default App;
