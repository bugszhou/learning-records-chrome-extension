import { queryLibById, updateLib } from "./storeLib";

// const learning = {
//   name: "两数之和",
//   lastReviewTime: new Date(),
//   nextReviewTime: new Date(),
//   content: "",
//   reviews: [],
// };

export async function createLearning(data) {
  const lib = await queryLibById(data.libId);
  if (!lib) {
    return { status: "NO_LIB", msg: "未查到复习库", data: null };
  }

  if (!Array.isArray(lib.item)) {
    lib.item = [];
  }
  const learning = {
    name: data.name,
    content: data.content,
    lastReviewTime: +new Date(),
    nextReviewTime: +new Date(),
    reviews: [],
  };

  lib.item.push(learning);

  return await updateLib(lib);
}

// const review = {
//   id: "01",
//   date: "2021-07-21 15:30:02",
//   next: "2021-07-22 15:30:02",
// };

export async function addReview(data) {
  const lib = await queryLibById(data.libId);
  if (!lib) {
    return { status: "NO_LIB", msg: "未查到复习库", data: null };
  }

  if (!Array.isArray(lib.item)) {
    return { status: "NO_LEARNING", msg: "未查到学习记录", data: null };
  }

  const reviews = {
    id: 1,
    date: Date.now(),
    next: +new Date(data.nextReviewDate),
  };

  if (!reviews.next) {
    return { status: "TIME_ERROR", msg: "下一次复习时间错误", data: null };
  }

  if (!Array.isArray(lib.item[data.learningInd].reviews)) {
    lib.item[data.learningInd].reviews = [];
  }
  reviews.id = lib.item[data.learningInd].reviews.length + 1;

  lib.item[data.learningInd].reviews.push(reviews);

  return await updateLib(lib);
}
