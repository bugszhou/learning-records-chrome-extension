// import { now } from "core-js/core/date";

// const list = {
//   0: {
//     id: 0,
//     name: "算法和数据结构",
//     endTime: now(),
//     item: [
//       {
//         name: "两数之和",
//         lastReviewTime: now(),
//         nextReviewTime: now(),
//         content: "",
//         reviews: [
//           {
//             reviewTime: now(),
//             nextReviewTime: now(),
//           },
//         ],
//       },
//     ],
//   },
// };

export function store(key, data) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: data }, () => {
      resolve(data);
    });
  });
}

export function query(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result);
    });
  });
}

export function remove(key) {
  return new Promise((resolve) => {
    chrome.storage.local.remove(key, () => {
      resolve();
    });
  });
}
