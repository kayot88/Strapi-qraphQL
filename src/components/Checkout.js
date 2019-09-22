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
import {
  Elements,
  StripeProvider,
  CardElement,
  injectStripe
} from 'react-stripe-elements';
import Strapi from 'strapi-sdk-javascript/build/main';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import { withRouter } from 'react-router-dom';
import { required, email, password, lt } from '../utils/validation';
import ToastMessage from './ToastMessage';
import { calcPrice, getItem, calcAmount, clearCard } from '../utils';

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class _CheckoutForm extends Component {
  state = {
    cartItem: [],
    showToast: false,
    toastMessage: '',
    loading: false,
    address: '',
    postalCode: null,
    city: '',
    confirmEmail: '',
    orderLoading: false,
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

  showToast = (toastText = 'loading', redirect = false) => {
    this.setState({ showToast: true, toastMessage: toastText });
    setTimeout(() => {
      this.setState({ showToast: false, toastMessage: '' }, () => {
        return redirect && this.props.history.push('/');
      });
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
  handleSubmitOrder = async () => {
    const { address, city, postalCode, cartItem } = this.state;
    const amount = calcAmount(cartItem);
    this.setState({ orderLoading: true });
    let token;
    try {
      //token
      const response = await this.props.stripe.createToken();
      token = response.token.id;
      //create order
      await strapi.createEntry('orders', {
        amount,
        postalCode,
        address,
        brew: cartItem,
        token,
        city
      });
      //clearbrews in cart items
      this.setState({ orderLoading: false, modal: false });
      this.showToast('You successefully add to order', true);
      clearCard();
      //success msg
    } catch (error) {
      this.setState({ orderLoading: false, modal: false });
      this.showToast(`Error is ${error.message}`);
      //error msg
    }
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
                  type="text"
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
                <CardElement
                  id="stripe__input"
                  onReady={input => input.focus()}
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
          ></Button>
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
    <Spinner show={orderLoading} accessibilityLabel="for " />
  </Modal>
);
// Checkout.propTypes = {};
const CheckoutForm = withRouter(injectStripe(_CheckoutForm));
const Checkout = () => (
  <StripeProvider apiKey='process.env.STRIPE_PUBLISH_KEY'>
    <Elements>
      <CheckoutForm />
    </Elements>
  </StripeProvider>
);

export default Checkout;
