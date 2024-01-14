import Orders from "./Orders";
import User from "./User";

function UserDashboard() {
  return (
    <div className="flex flex-col items-center justify-center">
      <User />
      <div className="pb-10">
        <h1 className="uppercase text-center text-[#c40d2e] text-3xl lg:text-4xl font-[300] tracking-[3px] py-10">
          recent orders
        </h1>
        <Orders />
      </div>
    </div>
  );
}

export default UserDashboard;
