import React, { Component, Fragment } from 'react';
import {
  Box,
  Container,
  Heading,
  Card,
  Image,
  Text,
  Button,
  Mask,
  IconButton
} from 'gestalt';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import { calcPrice, setItem, getItem } from '../utils';

import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);
export default class Brews extends Component {
  state = { brews: [], brand: '', cardItems: [] };
  //   componentWillUnmount() {
  //   this.setState({

  //     cardItems:[]
  //   })
  // }
  async componentDidMount() {
    // console.log(this.props.match.params.brandId);
    try {
      const response = await strapi.request('POST', '/graphql', {
        data: {
          query: `query{
  brand(id: "${this.props.match.params.brandId}"){
    _id
    name
    description
	brews{
    id
    name
    description
    image{
      url
    }
    price
    brand{
      _id
    }
  }
  }
}`
        }
      });
      // console.log(response.data);

      this.setState({
        ...this.state,
        brews: response.data.brand.brews,
        brand: response.data.brand.name,
        cardItems: getItem()
      });

      // console.log(this.state);
    } catch (error) {}
  }

  clickHandler = brew => {
    console.log(this.state.cardItems);
    const alreadyIn = this.state.cardItems.findIndex(item => {
      return item.id === brew.id;
    });

    if (alreadyIn === -1) {
      const updatedItem = this.state.cardItems.concat({
        ...brew,
        quantity: 1
      });
      this.setState(
        {
          cardItems: updatedItem
        },
        setItem(updatedItem)
      );
    } else {
      const updatedItem = [...this.state.cardItems];
      console.log(updatedItem);
      updatedItem[alreadyIn].quantity += 1;
      this.setState(
        {
          cardItems: updatedItem
        },
        setItem(updatedItem)
      );
    }
  };

  deleteItemFromCart = id => {
    console.log(this.state.cardItems);
    const itemToDelete = this.state.cardItems.findIndex(card => {
      return card.id === id;
    });
    this.setState(
      {
        ...this.state.cardItems.splice(itemToDelete, 1)
      },
      setItem(this.state.cardItems)
    );
    console.log(this.state.cardItems);
  };

  render() {
    const { brews, brand, cardItems } = this.state;
    return (
      <Fragment>
        {brews.length === 0 ? (
          <Loader />
        ) : (
          <Box display="flex" justifyContent="center" wrap>
            <Container>
              <Box display="flex" justifyContent="center">
                <Heading>{brand}</Heading>
              </Box>
              <Box
                dangerouslySetInlineStyle={{
                  __style: {
                    backgroundColor: '#d6c8ec'
                  }
                }}
                wrap
                shape="rounded"
                display="flex"
                justifyContent="center"
              >
                {brews.map((brew, i = 0) => {
                  return (
                    <Box
                      dangerouslySetInlineStyle={{
                        __style: {
                          backgroundColor: '#d6f8ec'
                        }
                      }}
                      paddingY={4}
                      shape="rounded"
                      display="flex"
                      justifyContent="center"
                      wrap
                      margin={2}
                      maxWidth={200}
                      maxHeight={400}
                      key={i++}
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
                              alt="brewImage"
                              naturalHeight={1}
                              naturalWidth={1}
                              src={`${apiUrl}${brew.image.url}`}
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
                            {brew.name}
                          </Text>
                          <Text textAlign="center" margin={2}>
                            {brew.description}
                          </Text>
                          <Text>{brew.price}</Text>
                          <Box>
                            <Text margin={2} size="xl">
                              <Button
                                onClick={() => {
                                  this.clickHandler(brew);
                                }}
                                color="blue"
                                text="Add To Card"
                              />
                            </Text>
                          </Box>
                        </Box>
                      </Card>
                    </Box>
                  );
                })}
              </Box>
            </Container>
            <Box marginTop={12}>
              <Mask shape="rounded" wash>
                <Box display="flex" direction="column" alignItems="center">
                  <Heading>You card</Heading>
                  <Text color="gray" italic>
                    {cardItems.length} items selected
                  </Text>
                  {cardItems.map(item => (
                    <Box key={item.name} display="flex" alignItems="center">
                      <Text>
                        {item.name} x {item.quantity} - $
                        {(item.price * item.quantity).toFixed(2)}
                      </Text>
                      <IconButton
                        accessibilityLabel="Delete item"
                        icon="cancel"
                        size="sm"
                        iconColor="red"
                        onClick={() => {
                          this.deleteItemFromCart(item.id);
                        }}
                      />
                    </Box>
                  ))}
                  <Box>
                    {cardItems.length === 0 && (
                      <Text color="red">Please select some item</Text>
                    )}
                  </Box>
                  <Text size="lg">Total: ${calcPrice(cardItems)}</Text>
                  <Text>
                    <Link to="/checkout">Checkout</Link>
                  </Text>
                </Box>
              </Mask>
            </Box>
          </Box>
        )}
      </Fragment>
    );
  }
}
