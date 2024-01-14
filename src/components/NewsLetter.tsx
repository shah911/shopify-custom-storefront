import { ArrowForwardIos } from "@mui/icons-material";
import Image from "next/image";

const socialLinks = [
  { src: "/instagram.svg", alt: "instagarm" },
  { src: "/facebook-f.svg", alt: "facebook" },
  { src: "/x-twitter.svg", alt: "twitter" },
  { src: "/pinterest.svg", alt: "pinterest" },
];

function NewsLetter() {
  return (
    <div className="flex flex-col lg:flex-row h-[35vh] md:h-[30vh] lg:bg-[#fbfbfb] border-b-[1.5px] border-[#f2f2f2]">
      <div className="flex-[1] flex flex-col justify-evenly bg-[#fbfbfb]">
        <div className="h-[55%] md:h-[60%] lg:h-[55%] w-[80%] mx-auto flex flex-col items-center lg:items-start justify-between">
          <span className="uppercase text-xs lg:text-sm font-[400] text-left">
            SUBSCRIBE TO OUR NEWSLETTER
          </span>
          <div className="flex">
            <div className="input-group">
              <input
                required
                type="email"
                className="input bg-white border border-solid border-gray-400 border-r-0 w-[75vw] md:w-[50vw] lg:w-[30vw]"
              />
              <label className="user-label">Your Email</label>
            </div>
            <button className="btn-secondary px-5 py-1 border border-solid border-gray-400">
              <ArrowForwardIos />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-[1] flex flex-col items-center lg:items-start justify-evenly">
        <div className="h-[55%] w-[80%] mx-auto flex flex-col justify-between items-center lg:items-start">
          <span className="uppercase text-xs md:text-sm lg:text-sm font-[400] text-left">
            follow us
          </span>
          <div className="flex items-center gap-6 py-4">
            {socialLinks.map((link) => (
              <Image
                key={link.alt}
                src={link.src}
                alt={link.alt}
                width={24}
                height={24}
                className="object-cover"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsLetter;
