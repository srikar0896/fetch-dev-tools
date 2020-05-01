import { BehaviorSubject } from "rxjs";

let requests = [];
let processingRequests = [];

const requestsSubscriber = new BehaviorSubject(requests);
const requestResolver = new BehaviorSubject("");
const requestRejector = new BehaviorSubject("");
const processingRequestsSubscriber = new BehaviorSubject(processingRequests);

const registerRequest = requestOptions => {
  const requestId = `req-${Date.now()}`;
  const r = {
    id: requestId,
    options: requestOptions
  };

  processingRequestsSubscriber.next([...processingRequests, requestId]);

  const requestPromise = new Promise((resolve, reject) => {
    requestResolver.subscribe(resolvedRequest => {
      const { id: resolvedRequestId, response, status_code } = resolvedRequest;

      if (resolvedRequestId === requestId) {
        resolve({ data: response, status: status_code });
        // if (customResponse) {
        //   resolve(JSON.parse(customResponse));
        // } else {
        //   resolve(requestOptions.response);
        // }
        removeFromProcessingList(requestId);
      }
    });

    requestRejector.subscribe(rejectRequest => {
      const { id: rejectRequestId, status_code, error_message } = rejectRequest;
      if (rejectRequestId === requestId) {
        // reject(requestOptions.error);
        reject({ status: status_code, errorMessage: error_message });
        removeFromProcessingList(rejectRequestId);
      }
    });
  });

  requests = [...requests, r];
  requestsSubscriber.next(requests);
  // setTimeout(() => {
  //   resolveRequest(requestId);
  // }, 3000);
  return requestPromise;
};

const removeFromProcessingList = requestId => {
  let newProcessingRequests = processingRequests;
  newProcessingRequests.splice(newProcessingRequests.indexOf(requestId));
  processingRequestsSubscriber.next(newProcessingRequests);
};

const resolveRequest = request => {
  const { id } = request;

  let r = requests;
  r = r.filter(i => i.id !== id);
  requests = r;
  requestsSubscriber.next(r);
  requestResolver.next(request);
};

const cancelAllRequests = () => {
  requests = [];
  requestsSubscriber.next([]);
};

const rejectRequest = request => {
  const { id } = request;

  let r = requests;
  r = r.filter(i => i.id !== id);
  requests = r;
  requestsSubscriber.next(r);
  requestRejector.next(request);
};

export default {
  subscriber: requestsSubscriber
};

export { resolveRequest, rejectRequest, cancelAllRequests, registerRequest };
