import { BehaviorSubject } from "rxjs";
import uuid from "uuid";

let requests = [];
let processingRequests = [];

const requestsSubscriber = new BehaviorSubject(requests);
const requestResolver = new BehaviorSubject("");
const requestRejector = new BehaviorSubject("");
const processingRequestsSubscriber = new BehaviorSubject(processingRequests);

const registerRequest = requestOptions => {
  const requestId = uuid();
  const r = {
    id: requestId,
    options: requestOptions
  };

  processingRequestsSubscriber.next([...processingRequests, requestId]);

  const requestPromise = new Promise((resolve, reject) => {
    requestResolver.subscribe(resolvedRequest => {
      const { requestId: resolvedRequestId, customResponse } = resolvedRequest;

      if (resolvedRequestId === requestId) {
        resolve(customResponse);
        // if (customResponse) {
        //   resolve(JSON.parse(customResponse));
        // } else {
        //   resolve(requestOptions.response);
        // }
        removeFromProcessingList(requestId);
      }
    });

    requestRejector.subscribe(rejectRequest => {
      const { requestId: rejectRequestId, customError } = rejectRequest;
      if (rejectRequestId === requestId) {
        // reject(requestOptions.error);
        reject(customError);
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
