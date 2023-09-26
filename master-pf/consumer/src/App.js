import React from 'react';
import { Link } from 'react-router-dom';
import 'spectre.css/dist/spectre.min.css';
import 'spectre.css/dist/spectre-icons.min.css';
import 'spectre.css/dist/spectre-exp.min.css';
import Heading from './Heading';
import Layout from './Layout';
import API from './api';
import PropTypes from 'prop-types';

const productPropTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }).isRequired
};

function ProductTableRow(props) {
  return (
    <tr>
      <td>{props.product.name}</td>
      <td>{props.product.type}</td>
      <td>
        <Link
          className="btn btn-link"
          to={{
            pathname: '/products/' + props.product.id,
            state: {
              product: props.product
            }
          }}
        >
          See more!
        </Link>
      </td>
    </tr>
  );
}
ProductTableRow.propTypes = productPropTypes;

function ProductTable(props) {
  const products = props.products.map((p) => (
    <ProductTableRow key={p.id} product={p} />
  ));
  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th />
        </tr>
      </thead>
      <tbody>{products}</tbody>
    </table>
  );
}

ProductTable.propTypes = {
  products: PropTypes.arrayOf(productPropTypes.product)
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      searchText: '',
      products: [],
      visibleProducts: []
    };
    this.onSearchTextChange = this.onSearchTextChange.bind(this);
  }

  componentDidMount() {
    API.getAllProducts()
      .then((r) => {
        this.setState({
          loading: false,
          products: r
        });
        this.determineVisibleProducts();
      })
      .catch(() => {
        this.setState({ error: true });
      });
  }

  determineVisibleProducts() {
    const findProducts = (search) => {
      search = search.toLowerCase();
      return this.state.products.filter(
        (p) =>
          p.id.toLowerCase().includes(search) ||
          p.name.toLowerCase().includes(search) ||
          p.type.toLowerCase().includes(search)
      );
    };
    this.setState((s) => {
      return {
        visibleProducts: s.searchText ? findProducts(s.searchText) : s.products
      };
    });
  }

  onSearchTextChange(e) {
    this.setState({
      searchText: e.target.value
    });
    this.determineVisibleProducts();
  }

  render() {
    if (this.state.error) {
      throw Error('unable to fetch product data');
    }

    return (
      <Layout>
        <Heading text="Products" href="/" />
        <div className="form-group col-2">
          <label className="form-label" htmlFor="input-product-search">
            Search
          </label>
          <input
            id="input-product-search"
            className="form-input"
            type="text"
            value={this.state.searchText}
            onChange={this.onSearchTextChange}
          />
        </div>
        {this.state.loading ? (
          <div className="loading loading-lg centered" />
        ) : (
          <ProductTable products={this.state.visibleProducts} />
        )}
      </Layout>
    );
  }
}

App.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default App;
