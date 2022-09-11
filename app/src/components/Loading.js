import Spinner from "react-bootstrap/Spinner";

const Loading = (props) => {
  return (
    <div
      className="container mx-auto w-100 d-flex align-items-center justify-content-center"
      style={{ marginTop: "3em" }}
    >
      <Spinner animation="grow" variant="info" size="lg" className="mx-auto" />
    </div>
  );
};

export default Loading;
