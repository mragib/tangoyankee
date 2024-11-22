import StorageTable from "@/features/storage/StorageTable";

import Row from "@/ui/Row";

function Storage() {
  return (
    <>
      <Row type="horizontal">
        <h1 className="text-xl md:text-2xl font-semibold leading-4 pb-2 md:pb-4">
          Storage
        </h1>
      </Row>
      <Row>
        <StorageTable />
      </Row>
    </>
  );
}

export default Storage;
