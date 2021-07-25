/* eslint-disable prettier/prettier */
import { store, query, remove } from ".";
import { storageKey } from "../../config";
import { dateFormat } from "../utils";

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

export function clearLib() {
  return remove(storageKey);
}

export function createLib(name) {
  return query(storageKey)
    .then((data) => {
      let id = 1;

      if (!data || Object.keys(data || {}).length === 0) {
        return { id, list: {} };
      }

      const libData = data[storageKey];

      id = Object.keys(libData).sort((a, b) => b - a)[0];

      return { id: Number(id) + 1, list: libData };
    })
    .then((data) => {
      data.list[data.id] = {
        id: data.id,
        name,
        createdAt: dateFormat(Date.now(), "yyyy-MM-dd hh:mm:ss"),
        endTime: "",
        item: [],
      };
      return store(storageKey, data.list);
    });
}

export async function queryLibList() {
  const data = await query(storageKey);
  if (!data) {
    return [];
  }
  const list = data[storageKey] || {};

  return Object.keys(list)
    .sort((a, b) => b - a)
    .map((id) => list[id]);
}

export function normalizeLibList(list) {
  if (!Array.isArray(list)) {
    return [];
  }

  list.forEach((item) => {
    if (!item || !item.item) {
      return [];
    }
    item.total = item.item.length || 0;
    item.today = item.item.reduce((total, curr) => {
      if (!curr || !curr.nextReviewTime) {
        return total;
      }
      const nextReviewTime = +new Date(curr.nextReviewTime);

      const todayDate = new Date();
      const todayStart = new Date(
        todayDate.getFullYear(),
        todayDate.getMonth(),
        todayDate.getDate(),
      );
      const todayEnd = new Date(
        todayDate.getFullYear(),
        todayDate.getMonth(),
        todayDate.getDate() + 1,
      );

      if (nextReviewTime >= +todayStart && nextReviewTime < +todayEnd) {
        total += 1;
      }
    }, 0);
  });

  return list;
}
