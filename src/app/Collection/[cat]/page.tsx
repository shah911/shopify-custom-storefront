import ProductsSlider from "@/components/ProductsSlider";
import gql from "graphql-tag";
import { print } from "graphql";
import { storeFront } from "../../../../utils";
import ErrPage from "@/components/ErrPage";

const Query = gql`
  query Collection($title: String) {
    collections(first: 1, query: $title) {
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
`;

async function Products({ params }: { params: { cat: string } }) {
  const { cat } = params;
  const catTitle = cat.replace(/%20/g, "+");
  const { data, errors } = await storeFront(print(Query), { title: catTitle });

  if (errors) {
    return <ErrPage />;
  }

  return <ProductsSlider title={catTitle} ProductsList={data} />;
}

export default Products;
