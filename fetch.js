import { registerRequest } from "./requestService";

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
