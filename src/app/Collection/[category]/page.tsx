import ProductsSlider from "@/components/ProductsSlider";
import gql from "graphql-tag";
import { print } from "graphql";
import { storeFront } from "../../../../utils";
import ErrPage from "@/components/ErrPage";

const categoryQuery = gql`
  query ProductCollection($tag: String!) {
    products(first: 1, query: $tag) {
      edges {
        node {
          collections(first: 1) {
            edges {
              node {
                description
                products(first: 8) {
                  edges {
                    node {
                      handle
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

async function singleCategory({ params }: { params: { category: string } }) {
  const { category } = params;
  const productTag = decodeURIComponent(category);
  const { data, errors } = await storeFront(print(categoryQuery), {
    tag: `tag:${productTag}`,
  });

  const items = data?.products?.edges[0].node.collections;

  return errors ? (
    <ErrPage />
  ) : (
    <ProductsSlider title={productTag} ProductsList={items} />
  );
}

export default singleCategory;
