const { GraphQLClient } = require('graphql-request');

const domain = 'meatzystore.myshopify.com';
const token = 'a5bdc1bfd39a768240c3d49013570733';
const endpoint = `https://${domain}/api/2024-10/graphql.json`;

const client = new GraphQLClient(endpoint, {
  headers: {
    'X-Shopify-Storefront-Access-Token': token,
    'Content-Type': 'application/json',
  },
});

const GET_COLLECTIONS = `
  query getCollections {
    collections(first: 20) {
      edges {
        node {
          id
          title
          handle
          description
        }
      }
    }
  }
`;

async function testCollections() {
  try {
    const data = await client.request(GET_COLLECTIONS);
    console.log('Collections found:\n');
    data.collections.edges.forEach(({ node }) => {
      console.log(`Title: ${node.title}`);
      console.log(`Handle: ${node.handle}`);
      console.log(`ID: ${node.id}`);
      console.log(`Description: ${node.description || 'No description'}`);
      console.log('---\n');
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
  }
}

testCollections();
