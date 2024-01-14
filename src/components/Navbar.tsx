import Link from "next/link";
import Image from "next/image";
import MegaMenu from "./MegaMenu";
import MenuIcon from "./MenuIcon";
import { Badge } from "@mui/material";
import { ShoppingBagOutlined } from "@mui/icons-material";
import Search from "./Search";
import Cart from "./Cart";

function Navbar() {
  return (
    <div className="h-[60px] lg:h-[104px] flex items-center justify-evenly shadow-sm">
      <div className="h-[100%] w-[90vw] lg:w-[95vw] mx-auto flex flex-col">
        <div className="flex-[1] flex items-center">
          <div className="flex-[1]">
            <MenuIcon />
          </div>
          <div className="flex-[1] flex items-center justify-center">
            <Link
              href="/"
              className="flex items-center justify-center  text-3xl font-[500] w-fit"
            >
              SHAH.
            </Link>
          </div>
          <div className="flex-[1] flex items-center justify-end gap-4">
            <Search />
            <Link href="/myaccount" className="hidden lg:flex">
              <Image
                src="/user.svg"
                alt="user"
                width={26}
                height={26}
                className="object-contain cursor-pointer"
              />
            </Link>
            <Cart />
          </div>
        </div>
        <div className="flex-[1] hidden lg:flex">
          <MegaMenu />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
