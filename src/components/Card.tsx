import { FC } from "react";
import Link from "next/link";
import Image from "next/image";

type ImageNode = {
  url: string;
};

type ImageEdge = {
  node: ImageNode;
};

type Product = {
  handle: string;
  title: string;
  tags: string[];
  images: {
    edges: ImageEdge[];
  };
};

type ProductEdge = {
  node: Product;
};

type ProductCardProps = {
  item: ProductEdge;
  accessories: boolean;
};

const Card: FC<ProductCardProps> = ({ item, accessories }) => {
  const product = item.node;
  const image = product.images.edges[0].node;

  return (
    <Link href={`/yourwatch/${product.handle}`} key={product.handle}>
      <div className="flex flex-col items-center justify-center gap-4 h-[500px] md:w-[250px] w-[190px] relative">
        <div className="md:w-[240px] h-[275px] w-[180px] relative">
          <Image
            src={image.url}
            alt={product.title}
            fill={true}
            className="bg-[#f2f2f264] object-contain"
          />
        </div>
        <span className="uppercase text-sm font-[400]">
          {accessories ? product.tags[1] : product.tags[0]}
        </span>
        <span className="text-xs font-[300] capitalize text-center w-[90%] h-[10%]">
          {product.title}
        </span>
        <div className="hidden lg:flex h-[100%] w-[100%] absolute top-0 opacity-0 transition-all duration-200 justify-center hover:opacity-[1]">
          <button className="btn-secondary py-2 px-5 uppercase font-[400] text-sm absolute h-10 top-[88.5%] border border-gray-400">
            details
          </button>
        </div>
      </div>
    </Link>
  );
};

export default Card;
