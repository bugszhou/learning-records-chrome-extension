<template>
  <div class="main">
    <h1>复习记录器</h1>
    <el-button
      style="padding: 3px 4px; margin-top: 20px; margin-bottom: 10px"
      type="text"
      @click="handleShowNewLib"
    >
      新增复习库
    </el-button>
    <el-menu
      :default-active="String(selectedLib && selectedLib.id)"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleLibSelected"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-submenu index="1">
        <template slot="title">我的复习库</template>
        <el-menu-item
          :index="String(item.id)"
          v-for="(item, index) in navList"
          v-bind:key="index"
        >
          {{ item.name }}
          <span class="item__desc"
            >(今日：{{ item.today }}，总计：{{ item.total }})</span
          >
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <div class="review-info" v-if="selectedLib">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="review__header">{{ selectedLib.name }}</span>
        </div>
        <section style="text-align: right">
          <el-button
            style="padding: 3px 4px"
            type="text"
            @click="handleShowNewDialog"
          >
            新增记录
          </el-button>
          <el-button
            style="padding: 3px 4px"
            type="danger"
            @click="handleDelLib"
          >
            删除
          </el-button>
          <el-button style="padding: 3px 4px" type="text"> 结束 </el-button>
        </section>
        <p class="review__tip">复习时间间隔建议：1天、2天、5天、10天、31天</p>
        <h3>复习概况：</h3>
        <section class="review__desc">
          <div class="text item">复习总数：{{ selectedLib.total }}</div>
          <div class="text item">今日复习数：{{ selectedLib.today }}</div>
        </section>
      </el-card>
    </div>
    <div class="review__list" v-if="selectedLib">
      <el-tabs v-model="selectedTab" type="border-card">
        <el-tab-pane label="今日复习" name="today">
          <div class="review__body">
            <el-collapse
              v-for="(record, index) in selectedLib.todayList"
              v-bind:key="record.id"
              v-model="activeRecords"
              @change="handleActiveRecordChange"
            >
              <el-collapse-item :title="record.name" :name="index">
                <section style="text-align: right">
                  <el-button
                    style="padding: 3px 4px"
                    type="danger"
                    @click="handleDelLearning(index)"
                  >
                    删除
                  </el-button>
                </section>
                <div class="review__info">
                  <div class="review__info-warp">
                    <div class="info">
                      上一次学习：{{
                        dateFormat(
                          +new Date(record.lastReviewTime),
                          "yyyy-MM-dd hh:mm:ss",
                        )
                      }}
                    </div>
                    <div class="info">
                      下一次学习：{{
                        dateFormat(
                          +new Date(record.nextReviewTime),
                          "yyyy-MM-dd hh:mm:ss",
                        )
                      }}
                    </div>
                    <div class="info">
                      <span class="info__item"
                        >已学习：{{
                          record.reviews && record.reviews.length
                            ? record.reviews.length
                            : 0
                        }}次</span
                      >
                    </div>
                  </div>
                  <h4>学习内容：</h4>
                  <div class="review__content">{{ record.content }}</div>
                </div>
                <h4>学习记录：</h4>
                <el-button
                  style="padding: 10px 10px; margin-bottom: 10px"
                  type="primary"
                  @click="handleShowReviewItemDialog(index)"
                >
                  新增复习记录
                </el-button>
                <el-table :data="record.reviews" border style="width: 100%">
                  <el-table-column fixed prop="id" label="序号" width="50">
                  </el-table-column>
                  <el-table-column prop="date" label="复习时间" width="125">
                    <template slot-scope="scope">
                      <span>{{
                        dateFormat(
                          +new Date(scope.row.date),
                          "yyyy-MM-dd hh:mm:ss",
                        )
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="next" label="下次复习时间" width="125">
                    <template slot-scope="scope">
                      <span>{{
                        dateFormat(
                          +new Date(scope.row.next),
                          "yyyy-MM-dd hh:mm:ss",
                        )
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="50">
                    <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="
                          handleDeleteReview(scope.row, index)
                        "
                        type="text"
                        size="small"
                      >
                        移除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>
        <el-tab-pane label="全部内容" name="all">
          <div class="review__body">
            <el-collapse
              v-for="(record, index) in selectedLib.item"
              v-bind:key="record.id"
              v-model="activeRecords"
              @change="handleActiveRecordChange"
            >
              <el-collapse-item :title="record.name" :name="index">
                <section style="text-align: right">
                  <el-button
                    style="padding: 3px 4px"
                    type="danger"
                    @click="handleDelLearning(index)"
                  >
                    删除
                  </el-button>
                </section>
                <div class="review__info">
                  <div class="review__info-warp">
                    <div class="info">
                      上一次学习：{{
                        dateFormat(
                          +new Date(record.lastReviewTime),
                          "yyyy-MM-dd hh:mm:ss",
                        )
                      }}
                    </div>
                    <div class="info">
                      下一次学习：{{
                        dateFormat(
                          +new Date(record.nextReviewTime),
                          "yyyy-MM-dd hh:mm:ss",
                        )
                      }}
                    </div>
                    <div class="info">
                      <span class="info__item"
                        >已学习：{{
                          record.reviews && record.reviews.length
                            ? record.reviews.length
                            : 0
                        }}次</span
                      >
                    </div>
                  </div>
                  <h4>学习内容：</h4>
                  <div class="review__content">{{ record.content }}</div>
                </div>
                <h4>学习记录：</h4>
                <el-button
                  style="padding: 10px 10px; margin-bottom: 10px"
                  type="primary"
                  @click="handleShowReviewItemDialog(index)"
                >
                  新增复习记录
                </el-button>
                <el-table :data="record.reviews" border style="width: 100%">
                  <el-table-column fixed prop="id" label="序号" width="50">
                  </el-table-column>
                  <el-table-column prop="date" label="复习时间" width="125">
                    <template slot-scope="scope">
                      <span>{{
                        dateFormat(
                          +new Date(scope.row.date),
                          "yyyy-MM-dd hh:mm:ss",
                        )
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="next" label="下次复习时间" width="125">
                    <template slot-scope="scope">
                      <span>{{
                        dateFormat(
                          +new Date(scope.row.next),
                          "yyyy-MM-dd hh:mm:ss",
                        )
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="50">
                    <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="
                          handleDeleteReview(scope.row, index)
                        "
                        type="text"
                        size="small"
                      >
                        移除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 新增复习库 -->
    <el-dialog title="新增复习库" :visible.sync="showNewLibDialog">
      <el-form :model="newLib">
        <el-form-item label="复习库名称">
          <el-input v-model="newLib.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showNewLibDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleAddReviewLib">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增学习记录 -->
    <el-dialog title="新增学习记录" :visible.sync="showNewDialog">
      <el-form :model="newReviewRecord">
        <el-form-item label="学习标题">
          <el-input v-model="newReviewRecord.name"></el-input>
        </el-form-item>
        <el-form-item label="学习内容">
          <el-input
            type="textarea"
            v-model="newReviewRecord.content"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showNewDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleAddReviewRecord"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 新增复习记录 -->
    <el-dialog title="新增复习记录" :visible.sync="showNewReviewItemDialog">
      <el-form :model="newReviewItem">
        <el-form-item label="下次复习时间">
          <el-date-picker
            type="datetime"
            placeholder="选择日期"
            v-model="newReviewItem.date"
            :default-value="new Date()"
            default-time="09:00:00"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleHideReviewItemDialog">取 消</el-button>
        <el-button type="primary" @click="handleAddReviewItem">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  createLib,
  queryLibList,
  normalizeLibList,
  removeLib,
} from "../lib/storage/storeLib";
import {
  createLearning,
  addReview,
  removeReview,
  removeLearning,
} from "../lib/storage/storeLearning";
import { dateFormat } from "../lib/utils";

export default {
  name: "App",
  data() {
    return {
      /**
       * 所有的复习库
       */
      libs: [],
      navList: [],
      selectedTab: "today",
      selectedReviewInd: -1,
      selectedLib: {},
      activeRecords: ["1"],
      showNewLibDialog: false,
      newLib: {
        name: "",
      },
      showNewDialog: false,
      newReviewRecord: {
        name: "",
        content: "",
      },
      showNewReviewItemDialog: false,
      newReviewItem: {
        date: "",
      },
    };
  },
  async mounted() {
    this.init();
  },
  methods: {
    dateFormat,
    async init() {
      await this.queryLibList();
      this.selectLib();
    },
    /**
     * 折叠面板事件
     */
    handleActiveRecordChange(data) {
      console.log(data);
    },
    /**
     * 显示新增学习记录弹框
     */
    handleShowNewDialog() {
      this.showNewDialog = true;
    },
    /**
     * 保存学习记录
     */
    async handleAddReviewRecord() {
      if (!this.newReviewRecord.name || !this.newReviewRecord.content) {
        this.$notify.error({
          title: "添加失败",
          message: "学习标题和学习内容必填",
          duration: 2000,
        });
        return;
      }
      await createLearning({
        libId: this.selectedLib.id,
        name: this.newReviewRecord.name,
        content: this.newReviewRecord.content,
      });
      this.showNewDialog = false;
      this.newReviewRecord = {
        name: "",
        content: "",
      };
      await this.updateSelectedLib();
    },
    /**
     * 删除学习记录
     */
    async handleDelLearning(learningInd) {
      if (!learningInd && Number(learningInd) !== 0) {
        return;
      }
      await removeLearning({
        libId: this.selectedLib.id,
        learningInd,
      });
      await this.updateSelectedLib();
    },
    /**
     * 显示复习记录
     */
    handleShowReviewItemDialog(ind) {
      this.showNewReviewItemDialog = true;
      this.selectedReviewInd = ind;
    },
    /**
     * 取消新增
     */
    handleHideReviewItemDialog() {
      this.showNewReviewItemDialog = false;
      this.selectedReviewInd = -1;
    },
    /**
     * 保存复习记录
     */
    async handleAddReviewItem() {
      this.showNewReviewItemDialog = false;
      if (this.selectedReviewInd === -1 || !this.newReviewItem.date) {
        this.$notify.error({
          title: "添加失败",
          message: "数据有误，请重试",
          duration: 2000,
        });
        return;
      }
      await addReview({
        libId: this.selectedLib.id,
        learningInd: this.selectedReviewInd,
        nextReviewDate: this.newReviewItem.date,
      });
      await this.updateSelectedLib();
      this.selectedReviewInd = -1;
      this.newReviewItem = {
        date: "",
      };
    },
    async handleDeleteReview(review, learningInd) {
      await removeReview({
        reviewId: review.id,
        libId: this.selectedLib.id,
        learningInd,
      });
      this.$notify.success({
        title: "成功",
        message: "删除成功",
        duration: 2000,
      });
      await this.updateSelectedLib();
    },
    async updateSelectedLib() {
      await this.queryLibList();
      this.selectedLib = this.libs.filter(
        (lib) => String(lib.id) === String(this.selectedLib.id),
      )[0];
    },
    handleShowNewLib() {
      this.showNewLibDialog = true;
    },
    /**
     * 新增复习库
     */
    async handleAddReviewLib() {
      this.showNewLibDialog = false;
      await createLib(this.newLib.name);

      this.$notify({
        title: "添加成功",
        message: "复习库已经添加成功",
        duration: 3000,
      });
      this.queryLibList();
      this.selectLib();
    },
    /**
     * 查询已有的复习库
     */
    async queryLibList() {
      const list = await queryLibList();
      const data = normalizeLibList(list);
      this.libs = data;
      this.navList = data.map((item) => ({
        id: item.id,
        name: item.name,
        total: item.total,
        today: item.today,
      }));
    },
    /**
     * 选择复习库
     */
    handleLibSelected(libId) {
      this.selectedLib =
        this.navList.filter(
          // eslint-disable-next-line prettier/prettier
          (item) => String(item.id) === String(libId),
        )[0] || {};
    },
    /**
     * 删除复习库
     */
    async handleDelLib() {
      await removeLib(this.selectedLib.id);
      await this.queryLibList();
      this.selectedLib = null;
      this.selectLib();
    },
    /**
     * 默认选择复习库
     */
    selectLib(isRefresh = false) {
      if (isRefresh) {
        this.selectedLib = this.libs[0];
        return;
      }

      if (this.selectedLib && Object.keys(this.selectedLib).length !== 0) {
        return;
      }

      this.selectedLib = this.libs[0];
      console.log(this.selectedLib);
    },
  },
};
</script>

<style>
html {
  width: 400px;
  height: 800px;
  overflow: auto;
}

body {
  width: 100%;
  height: 100%;
  padding-bottom: 40px;
  margin: 0;
  padding: 10px;
  box-sizing: border-box;
  /* overflow: auto; */
}

.main {
  height: 200px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.review__header {
  font-size: 16px;
  font-weight: bold;
}

.review__list {
  padding-top: 20px;
  padding-bottom: 20px;
}

.review__body {
  padding: 10px;
}

.el-collapse-item__header {
  font-weight: bold;
  color: #f14545;
}

.el-tabs__content {
  border: 1px solid #e4e7ed;
  border-top: 0;
}

.el-tabs__header {
  margin-bottom: 0;
  border-bottom: 0;
}

.info {
  font-size: 14px;
}

.review__content {
  padding: 20px 10px;
  border: 1px solid #e4e7ed;
}

.review__desc {
  padding: 20px 10px;
  border: 1px solid #e4e7ed;
}

.el-dialog {
  width: 80%;
}

.review__tip {
  color: #f14545;
  font-size: 14px;
  font-weight: bold;
}

.item__desc {
  font-size: 12px;
  color: #aeb0b3;
}
</style>
