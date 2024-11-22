import UserTableOperation from "@/features/authentication/UserTableOperation";

import Row from "../ui/Row";
import UserTable from "@/features/authentication/UserTable";

function Users() {
  return (
    <>
      <Row type="horizontal">
        <h1 className="text-xl md:text-2xl font-semibold leading-4 pb-2 md:pb-4">
          Users
        </h1>
        <UserTableOperation />
      </Row>
      <Row>
        <UserTable />
      </Row>
    </>
  );
}

export default Users;
