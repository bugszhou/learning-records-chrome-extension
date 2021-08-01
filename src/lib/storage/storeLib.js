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

export function removeLib(id) {
  return query(storageKey).then((data) => {
    if (!data || Object.keys(data || {}).length === 0) {
      return true;
    }

    const libData = data[storageKey];

    const list = Object.keys(libData || {})
      .filter((libId) => String(libId) !== String(id))
      .reduce((obj, currId) => {
        obj[currId] = libData[currId];
        return obj;
      }, {});

    store(storageKey, list);
  });
}

export function createLib(name) {
  return query(storageKey)
    .then((data) => {
      let id = 1;

      if (!data || Object.keys(data || {}).length === 0) {
        return { id, list: {} };
      }

      const libData = data[storageKey];

      id = Object.keys(libData).sort((a, b) => b - a)[0] || 1;

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

export async function updateLib(lib) {
  if (!lib || !lib.id) {
    return { status: "DATA_ERROR", msg: "参数错误", data: null };
  }

  const data = await query(storageKey);
  if (!data) {
    return [];
  }

  const libs = data[storageKey] || {};
  libs[lib.id] = lib;
  return store(storageKey, libs);
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

export async function queryLibById(libId) {
  const data = await queryLibList();

  const lib = data.filter((item) => String(item.id) === String(libId))[0];

  if (!lib) {
    return {};
  }

  return lib;
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

      const reviews = Array.isArray(curr.reviews) ? curr.reviews : [];

      const lastReview = reviews[reviews.length - 1];

      if (!lastReview) {
        curr.nextReviewTime = +new Date();
        total += 1;
        return total;
      }

      const nextReviewTime = +new Date(lastReview.next);
      curr.nextReviewTime = lastReview.next;

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
      return total;
    }, 0);

    item.todayList = item.item.filter((curr) => {
      if (!curr || !curr.nextReviewTime) {
        return false;
      }

      const reviews = Array.isArray(curr.reviews) ? curr.reviews : [];

      const lastReview = reviews[reviews.length - 1];

      if (!lastReview) {
        curr.nextReviewTime = +new Date();
        return true;
      }

      const nextReviewTime = +new Date(lastReview.next);
      curr.nextReviewTime = lastReview.next;

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

      if (+nextReviewTime >= +todayStart && +nextReviewTime < +todayEnd) {
        return true;
      }
      return false;
    });
  });

  return list;
}
