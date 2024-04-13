import { ToastContainer } from "react-toastify";

const Toasty = () => {
  return (
    <ToastContainer
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  );
};

export default Toasty;
