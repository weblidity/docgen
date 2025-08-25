import React from 'react';

const products = [
  {
    name: "DocProd",
    url: "/docgen/docs/docgen/overview",
    description: "A tool to generate documentation from source code. This description is intentionally long to demonstrate truncation.",
    orderNumber: 3
  },
  {
    name: "Another Product",
    url: "/docs/another-product",
    description: "Description for another product. This is also a very long description to make sure that the truncation is working as expected on multiple items.",
    orderNumber: 1
  },
  {
      name: "Third Product",
      url: "/docs/third-product",
      description: "This is the third product in our amazing suite. It has a medium length description.",
      orderNumber: 2
  },
  {
    name: "Fourth Product",
    url: "/docs/fourth-product",
    description: "The fourth product is the best one yet."
  },
  {
    name: "Fifth Product",
    url: "/docs/fifth-product",
    description: "You will love the fifth product."
  },
  {
    name: "Sixth Product",
    url: "/docs/sixth-product",
    description: "And here is the sixth."
  }
];

function truncate(str, maxLength) {
  if (!str || str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength) + '...';
}

function Card({ name, url, description, centerContent, maxDescriptionLength }) {
  const cardStyle = {
    height: '100%',
    textAlign: centerContent ? 'center' : 'left',
  };

  return (
    <div className="card" style={cardStyle}>
      <div className="card__header">
        <h3><a href={url}>{name}</a></h3>
      </div>
      <div className="card__body">
        {description && <p>{truncate(description, maxDescriptionLength)}</p>}
      </div>
    </div>
  );
}

function CardsGrid({ products, centerContent, maxDescriptionLength }) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="container">
        <div className="row">
        {products.map(product => (
            <div className="col col--4" key={product.url} style={{ marginBottom: '20px' }}>
            <Card {...product} centerContent={centerContent} maxDescriptionLength={maxDescriptionLength} />
            </div>
        ))}
        </div>
    </div>
  );
}

function BulletList({ products, maxDescriptionLength }) {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.url}>
          <strong><a href={product.url}>{product.name}</a></strong>
          {product.description && ` : ${truncate(product.description, maxDescriptionLength)}`}
        </li>
      ))}
    </ul>
  );
}

const ProductDirectory = ({ type = 'list', centerContent = false, sortBy = 'name', maxDescriptionLength = 100 }) => {
  if (!products || products.length === 0) {
    return <p>No products available.</p>;
  }

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'orderNumber') {
      if (a.orderNumber === undefined && b.orderNumber === undefined) return 0;
      if (a.orderNumber === undefined) return 1;
      if (b.orderNumber === undefined) return -1;
      return a.orderNumber - b.orderNumber;
    }
    return a.name.localeCompare(b.name);
  });

  const components = {
    list: <BulletList products={sortedProducts} maxDescriptionLength={maxDescriptionLength} />,
    grid: <CardsGrid products={sortedProducts} centerContent={centerContent} maxDescriptionLength={maxDescriptionLength} />,
  };

  return components[type] || components.list;
};

export default ProductDirectory;
