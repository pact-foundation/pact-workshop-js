import React from 'react';
import 'spectre.css/dist/spectre.min.css';
import 'spectre.css/dist/spectre-icons.min.css';
import 'spectre.css/dist/spectre-exp.min.css';
import Layout from './Layout';
import Heading from './Heading';
import API from './api';

class ProductPage extends React.Component {
  constructor(props) {
    super(props);

    const bits = window.location.pathname.split('/');

    this.state = {
      loading: true,
      product: {
        id: bits[bits.length - 1]
      }
    };
  }

  componentDidMount() {
    API.getProduct(this.state.product.id)
      .then((r) => {
        this.setState({
          loading: false,
          product: r
        });
      })
      .catch(() => {
        this.setState({ error: true });
      });
  }

  render() {
    if (this.state.error) {
      throw Error('unable to fetch product data');
    }
    const productInfo = (
      <div>
        <p>ID: {this.state.product.id}</p>
        <p>Name: {this.state.product.name}</p>
        <p>Type: {this.state.product.type}</p>
      </div>
    );

    return (
      <Layout>
        <Heading text="Products" href="/" />
        {this.state.loading ? (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="loading loading-lg"
          />
        ) : (
          productInfo
        )}
      </Layout>
    );
  }
}

ProductPage.propTypes = {
  // match: PropTypes.array.isRequired,
  // history: PropTypes.shape({
  //     push: PropTypes.func.isRequired
  // }).isRequired
};

export default ProductPage;
