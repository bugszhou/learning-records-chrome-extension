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

  const maxId = lib.item.reduce((maxVal, learningItem) => {
    if (maxVal < learningItem.id) {
      return learningItem.id;
    }
    return maxVal;
  }, 0);

  const learning = {
    id: maxId + 1,
    name: data.name,
    content: data.content,
    lastReviewTime: +new Date(),
    nextReviewTime: +new Date(),
    reviews: [],
  };

  lib.item.push(learning);

  return await updateLib(lib);
}

export async function removeLearning(data) {
  const lib = await queryLibById(data.libId);
  if (!lib) {
    return { status: "NO_LIB", msg: "未查到复习库", data: null };
  }

  if (!Array.isArray(lib.item)) {
    lib.item = [];
  }

  lib.item.splice(data.learningInd, 1);

  return await updateLib(lib);
}

// const review = {
//   id: "01",
//   date: "2021-07-21 15:30:02",
//   next: "2021-07-22 15:30:02",
// };

export async function addReview(data) {
  const lib = await queryLibById(data.libId);
  console.log(lib);
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

  const item = lib.item.filter(
    (learning) => String(learning.id) === String(data.learningId),
  )[0];

  if (!Array.isArray(item.reviews)) {
    item.reviews = [];
  }

  const maxId = item.reviews.reduce((maxVal, review) => {
    if (maxVal < review.id) {
      return review.id;
    }
    return maxVal;
  }, 0);
  reviews.id = maxId + 1;

  item.reviews.push(reviews);
  item.nextReviewTime = reviews.next;

  let ind = -1;
  lib.item.some((learning, index) => {
    if (String(learning.id) === String(data.learningId)) {
      ind = index;
      return true;
    }
    return false;
  });

  if (ind === -1) {
    return { status: "LEARNING_ERROR", msg: "未找到学习记录", data: null };
  }

  lib.item[ind] = item;

  return await updateLib(lib);
}

export async function updateReview(options) {
  const lib = await queryLibById(options.libId);
  if (!lib) {
    return { status: "NO_LIB", msg: "未查到复习库", data: null };
  }

  if (!Array.isArray(lib.item)) {
    return { status: "NO_LEARNING", msg: "未查到学习记录", data: null };
  }

  if (!options.nextReviewDate) {
    return { status: "TIME_ERROR", msg: "下一次复习时间错误", data: null };
  }

  const item = lib.item.filter(
    (learning) => String(learning.id) === String(options.learningId),
  )[0];

  if (!Array.isArray(item.reviews)) {
    item.reviews = [];
  }

  item.reviews.forEach((review) => {
    if (String(review.id) === String(options.reviewId)) {
      review.next = +new Date(options.nextReviewDate);
    }
  });

  let ind = -1;
  lib.item.some((learning, index) => {
    if (String(learning.id) === String(options.learningId)) {
      ind = index;
      return true;
    }
    return false;
  });

  if (ind === -1) {
    return { status: "LEARNING_ERROR", msg: "未找到学习记录", data: null };
  }

  lib.item[ind] = item;

  return await updateLib(lib);
}

export async function removeReview(options) {
  if (!options.reviewId) {
    return { status: "INDEX_ERROR", msg: "复习记录编号错误", data: null };
  }

  const lib = await queryLibById(options.libId);

  if (!lib) {
    return { status: "NO_LIB", msg: "未查到复习库", data: null };
  }

  if (!Array.isArray(lib.item)) {
    return { status: "NO_LEARNING", msg: "未查到学习记录", data: null };
  }

  let ind = -1;
  lib.item.some((learning, index) => {
    if (String(learning.id) === String(options.learningId)) {
      ind = index;
      return true;
    }
    return false;
  });

  if (!Array.isArray(lib.item[ind].reviews)) {
    return { status: "NO_LEARNING_REVIEW", msg: "未查到学习记录", data: null };
  }

  lib.item[ind].reviews = lib.item[ind].reviews.filter(
    (review) => String(review.id) !== String(options.reviewId),
  );

  return await updateLib(lib);
}
