import { registerRequest } from "./requestService";
import "./components/devtools";

const fetch = (options, extra) => {
  if(typeof(options) === "string") {
    return registerRequest({
      url: options,
      ...extra
    });
  }

  return registerRequest(options);
};

export default fetch;
