import React, { Component, Fragment } from 'react';
import { Container, Box, Text, Button, Heading, TextField } from 'gestalt';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import { required, email, password, lt } from '../utils/validation';
import ToastMessage from './ToastMessage';
import { calcPrice, getItem } from '../utils';
import PropTypes from 'prop-types';

class Checkout extends Component {
  state = {
    cartItem: [],
    showToast: false,
    toastMessage: '',
    loading: false,
    address: '',
    postalCode: null,
    city: '',
    confirmEmail: ''
  };

  componentDidMount() {
    this.setState({ cartItem: getItem() });
  }

  handleConfirm = e => {
    e.preventDefault();
    if (this.checkIsEmpty(this.state)) {
      console.log(this.loading);
      return this.showToast('Fill all of the field');
    }
    try {
      this.setState({ loading: true, showToast: true });
    } catch (error) {
      console.error(error);
      this.setState({ loading: false });
      this.showToast(error.message);
    }
  };

  showToast = toastText => {
    if (toastText) {
      this.setState({ showToast: true, toastMessage: toastText });
      setTimeout(() => {
        this.setState({ showToast: false, toastMessage: '' });
      }, 3000);
    }
  };

  checkIsEmpty = ({ address, postalCode, city, confirmEmail }) => {
    return !address || !postalCode || !city || !confirmEmail;
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
    // console.log(this.state);
  };

  render() {
    const { loading, showToast, toastMessage, cartItem } = this.state;
    return (
      <Container>
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: '#4fe12f'
            }
          }}
          margin={4}
          padding={4}
          shape="rounded"
          display="flex"
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          <Heading color="midnight">Lets Checkout</Heading>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="left"
            direction="column"
            marginBottom={6}
          >
            <Text>{cartItem.length} item for checkout</Text>
            {cartItem.map(item => (
              <Box key={item._id}>
                <Text>
                  {item.name} {item.quantity} x ${item.price} = $
                  {item.quantity * item.price}
                </Text>
              </Box>
            ))}
            <Text bold>Total Amount:${calcPrice(cartItem)}</Text>
          </Box>
          {cartItem.length > 0 ? (
            <Fragment>
              <Form
                onSubmit={this.handleConfirm}
                style={{
                  display: 'inlineBlock',
                  textAlign: 'center',
                  maxWidth: 450
                }}
              >
                <Input
                  id="city"
                  type="text"
                  name="city"
                  placeholder="City of residence "
                  onChange={this.handleChange}
                  validations={[required]}
                />
                <Input
                  id="confirmEmail"
                  type="email"
                  name="confirmEmail"
                  placeholder="Confirm Email"
                  onChange={this.handleChange}
                  validations={[email]}
                />
                <Input
                  id="postalCode"
                  type="number"
                  name="postalCode"
                  placeholder="Postal Code"
                  onChange={this.handleChange}
                  // maxLength={6}
                  minLength={6}
                  validations={[lt]}
                />
                <Input
                  id="address"
                  type="text"
                  name="address"
                  placeholder="Address"
                  onChange={this.handleChange}
                />
                <button
                  // inline
                  disabled={loading}
                  color="blue"
                  type="submit"
                >
                  Submit
                </button>
              </Form>
            </Fragment>
          ) : (
            <Box>
              <Heading color="midnight">Your cart is empty</Heading>
              <Text>Select some brews</Text>
            </Box>
          )}
        </Box>
        <ToastMessage show={showToast} message={toastMessage} />
      </Container>
    );
  }
}

// Checkout.propTypes = {};

export default Checkout;
