import React, { Component, Fragment } from 'react';
import {
  Container,
  Box,
  Text,
  Button,
  Heading,
  TextField,
  Modal,
  Spinner
} from 'gestalt';
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
    confirmEmail: '',
    orderLoading: true,
    modal: false
  };

  componentDidMount() {
    this.setState({ cartItem: getItem() });
  }

  handleConfirm = e => {
    e.preventDefault();
    if (this.checkIsEmpty(this.state)) {
      // console.log(this.loading);
      return this.showToast('Fill all of the field');
    }
    try {
      this.setState({ loading: true, showToast: true, modal: true });
    } catch (error) {
      console.error(error);
      this.setState({ loading: false, modal: false });
      this.showToast(error.message);
    }
  };

  showToast = (toastText = 'loading') => {
    this.setState({ showToast: true, toastMessage: toastText });
    setTimeout(() => {
      this.setState({ showToast: false, toastMessage: '' });
    }, 3000);
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
  handleSubmitOrder = params => {
    // this.setState({orderLoading: true})
    console.log(this.state.orderLoading);
  };
  closeModal = () => {
    this.setState({ modal: false, loading: false });
  };
  render() {
    const {
      loading,
      showToast,
      toastMessage,
      cartItem,
      modal,
      orderLoading
    } = this.state;
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
            // alignItems="left"
            direction="column"
            marginBottom={6}
          >
            <Text>{cartItem.length} item for checkout</Text>
            {cartItem.map(item => (
              <Box key={item.id}>
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
                <Button
                  // inline
                  disabled={loading}
                  color="blue"
                  type="submit"
                  text="Submit"
                ></Button>
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
        {modal && (
          <ConfirmationComp
            orderLoading={orderLoading}
            cartItem={cartItem}
            closeModal={this.closeModal}
            handleSubmitOrder={this.handleSubmitOrder}
          />
        )}
        {/* <Modal show={modal}></Modal> */}
      </Container>
    );
  }
}
const ConfirmationComp = ({
  orderLoading,
  cartItem,
  loading,
  closeModal,
  handleSubmitOrder
}) => (
  <Modal
    accessibilityCloseLabel="close"
    accessibilityModalLabel="Confirm your order"
    heading="Confirm your order"
    onDismiss={closeModal}
    footer={
      <Box
        display="flex"
        justifyContent="center"
        marginRight={-1}
        marginLeft={-1}
      >
        <Box padding={1}>
          <Button
            size="lg"
            color="red"
            text="Submit"
            disable={orderLoading}
            onClick={handleSubmitOrder}
          ></Button>
        </Box>
        <Box padding={1}>
          <Button
            size="lg"
            color="red"
            text="Cancel"
            disable={orderLoading}
            onClick={closeModal}
          >
          </Button>
        </Box>
      </Box>
    }
    role="alertdialog"
    // size="sm"
  >
    {!orderLoading && (
      <Box
        color="lightWash"
        display="flex"
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        {cartItem.map(item => (
          <Box key={item.id}>
            {item.name} {item.quantity} * {item.price} = $
            {item.quantity * item.price}
          </Box>
        ))}
        <b>Total: ${calcPrice(cartItem)}</b>
      </Box>
    )}
    <Spinner show={orderLoading} accessibilityLabel='for '/>
  </Modal>
);
// Checkout.propTypes = {};

export default Checkout;
