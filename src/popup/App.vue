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
      :default-active="defaultLib"
      mode="horizontal"
      @select="handleLibSelected"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-submenu index="lib">
        <template slot="title">我的复习库</template>
        <el-menu-item
          :index="String(item.id)"
          v-for="item in navList"
          v-bind:key="item.id"
        >
          {{ item.name }}
          <span class="item__desc"
            >(今日：{{ item.today }}，总计：{{ item.total }})</span
          >
        </el-menu-item>
      </el-submenu>
      <!-- <el-submenu index="calendar">
        <template slot="title">日历列表</template>
        <el-menu-item index="calendar"> 复习日历 </el-menu-item>
      </el-submenu> -->
    </el-menu>

    <div class="review-body" v-if="showLib">
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
        <el-button
          type="primary"
          style="margin-bottom: 10px"
          @click="handleToggleReviewCalendar"
        >
          {{ showCalendar ? "关闭" : "显示" }}复习日历
        </el-button>
        <el-card class="today-card" v-if="showCalendar">
          <div slot="header" class="clearfix">
            <span>复习日历</span>
          </div>
          <el-calendar>
            <template slot="dateCell" slot-scope="{ date, data }">
              <div :class="data.isSelected ? 'is-selected' : ''">
                {{ data.day.split("-")[2] }}
                <p class="review-calendar__nums">
                  {{ reviewDateData[data.day] || 0 }}
                </p>
              </div>
            </template>
          </el-calendar>
        </el-card>
        <el-card class="today-card">
          <div slot="header" class="clearfix">
            <span>今日复习</span>
          </div>
          <div class="review__body">
            <el-collapse
              v-for="(record, index) in selectedLib.todayList"
              v-bind:key="record.id"
              @change="handleActiveRecordChange"
            >
              <el-collapse-item
                :title="`${record.id} - ${record.name} (${
                  record.reviews && record.reviews.length
                    ? record.reviews.length
                    : 0
                }次)`"
                :name="index"
              >
                <section style="text-align: right">
                  <el-button
                    style="padding: 3px 4px"
                    type="danger"
                    @click="handleDelLearning(record)"
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
                  <el-button
                    type="primary"
                    plain
                    style="margin-bottom: 4px; padding: 6px 4px"
                    @click="
                      handleCopyContent(
                        'copyInputToday' + record.id,
                        record.content,
                      )
                    "
                  >
                    复制内容
                  </el-button>
                  <input
                    :ref="'copyInputToday' + record.id"
                    style="opacity: 0; height: 0"
                  />
                  <div class="review__content">{{ record.content }}</div>
                </div>
                <h4>学习记录：</h4>
                <el-button
                  style="padding: 10px 10px; margin-bottom: 10px"
                  type="primary"
                  @click="handleShowReviewItemDialog(record)"
                >
                  新增复习记录
                </el-button>
                <el-table :data="record.reviews" border style="width: 100%">
                  <el-table-column fixed prop="id" label="序号" width="50">
                  </el-table-column>
                  <el-table-column prop="date" label="复习时间" width="100">
                    <template slot-scope="scope">
                      <span>{{
                        dateFormat(
                          +new Date(scope.row.date),
                          "yyyy-MM-dd hh:mm:ss",
                        )
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="next" label="下次复习时间" width="105">
                    <template slot-scope="scope">
                      <span>{{
                        dateFormat(
                          +new Date(scope.row.next),
                          "yyyy-MM-dd hh:mm:ss",
                        )
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="90">
                    <template slot-scope="scope">
                      <el-button
                        v-if="scope.$index === record.reviews.length - 1"
                        @click.native.prevent="
                          handleShowEditReviewDialog(scope.row, record)
                        "
                        type="text"
                        size="small"
                      >
                        修改
                      </el-button>
                      <el-button
                        @click.native.prevent="
                          handleDeleteReview(scope.row, record)
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
        </el-card>
        <el-card class="today-card">
          <div slot="header" class="clearfix">
            <span>未分配内容</span>
          </div>
          <div class="review__body">
            <el-collapse
              v-for="(record, index) in selectedLib.noStudies"
              v-bind:key="record.id"
              @change="handleActiveRecordChange"
            >
              <el-collapse-item
                :title="`${record.id} - ${record.name} (${
                  record.reviews && record.reviews.length
                    ? record.reviews.length
                    : 0
                }次)`"
                :name="index"
              >
                <section style="text-align: right">
                  <el-button
                    style="padding: 3px 4px"
                    type="danger"
                    @click="handleDelLearning(record)"
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
                  <el-button
                    type="primary"
                    plain
                    style="margin-bottom: 4px; padding: 6px 4px"
                    @click="
                      handleCopyContent(
                        'copyInputToday' + record.id,
                        record.content,
                      )
                    "
                  >
                    复制内容
                  </el-button>
                  <input
                    :ref="'copyInputToday' + record.id"
                    style="opacity: 0; height: 0"
                  />
                  <div class="review__content">{{ record.content }}</div>
                </div>
                <h4>学习记录：</h4>
                <el-button
                  style="padding: 10px 10px; margin-bottom: 10px"
                  type="primary"
                  @click="handleShowReviewItemDialog(record)"
                >
                  新增复习记录
                </el-button>
                <el-table :data="record.reviews" border style="width: 100%">
                  <el-table-column fixed prop="id" label="序号" width="50">
                  </el-table-column>
                  <el-table-column prop="date" label="复习时间" width="100">
                    <template slot-scope="scope">
                      <span>{{
                        dateFormat(
                          +new Date(scope.row.date),
                          "yyyy-MM-dd hh:mm:ss",
                        )
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="next" label="下次复习时间" width="105">
                    <template slot-scope="scope">
                      <span>{{
                        dateFormat(
                          +new Date(scope.row.next),
                          "yyyy-MM-dd hh:mm:ss",
                        )
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="90">
                    <template slot-scope="scope">
                      <el-button
                        v-if="scope.$index === record.reviews.length - 1"
                        @click.native.prevent="
                          handleShowEditReviewDialog(scope.row, record)
                        "
                        type="text"
                        size="small"
                      >
                        修改
                      </el-button>
                      <el-button
                        @click.native.prevent="
                          handleDeleteReview(scope.row, record)
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
        </el-card>
        <el-card class="today-card">
          <div slot="header" class="clearfix">
            <span>过期内容</span>
          </div>
          <div class="review__body">
            <el-collapse
              v-for="(record, index) in selectedLib.expiredStudies"
              v-bind:key="record.id"
              @change="handleActiveRecordChange"
            >
              <el-collapse-item
                :title="`${record.id} - ${record.name} (${
                  record.reviews && record.reviews.length
                    ? record.reviews.length
                    : 0
                }次)`"
                :name="index"
              >
                <section style="text-align: right">
                  <el-button
                    style="padding: 3px 4px"
                    type="danger"
                    @click="handleDelLearning(record)"
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
                  <el-button
                    type="primary"
                    plain
                    style="margin-bottom: 4px; padding: 6px 4px"
                    @click="
                      handleCopyContent(
                        'copyInputToday' + record.id,
                        record.content,
                      )
                    "
                  >
                    复制内容
                  </el-button>
                  <input
                    :ref="'copyInputToday' + record.id"
                    style="opacity: 0; height: 0"
                  />
                  <div class="review__content">{{ record.content }}</div>
                </div>
                <h4>学习记录：</h4>
                <el-button
                  style="padding: 10px 10px; margin-bottom: 10px"
                  type="primary"
                  @click="handleShowReviewItemDialog(record)"
                >
                  新增复习记录
                </el-button>
                <el-table :data="record.reviews" border style="width: 100%">
                  <el-table-column fixed prop="id" label="序号" width="50">
                  </el-table-column>
                  <el-table-column prop="date" label="复习时间" width="100">
                    <template slot-scope="scope">
                      <span>{{
                        dateFormat(
                          +new Date(scope.row.date),
                          "yyyy-MM-dd hh:mm:ss",
                        )
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="next" label="下次复习时间" width="105">
                    <template slot-scope="scope">
                      <span>{{
                        dateFormat(
                          +new Date(scope.row.next),
                          "yyyy-MM-dd hh:mm:ss",
                        )
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="90">
                    <template slot-scope="scope">
                      <el-button
                        v-if="scope.$index === record.reviews.length - 1"
                        @click.native.prevent="
                          handleShowEditReviewDialog(scope.row, record)
                        "
                        type="text"
                        size="small"
                      >
                        修改
                      </el-button>
                      <el-button
                        @click.native.prevent="
                          handleDeleteReview(scope.row, record)
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
        </el-card>
        <el-tabs v-model="selectedTab" type="border-card">
          <el-tab-pane label="全部内容" name="1">
            <div class="review__body">
              <el-collapse
                v-for="(record, index) in selectedLib.item"
                v-bind:key="record.id"
                @change="handleActiveRecordChange"
              >
                <el-collapse-item
                  :title="`${record.id} - ${record.name} (${
                    record.reviews && record.reviews.length
                      ? record.reviews.length
                      : 0
                  }次)`"
                  :name="index"
                >
                  <section style="text-align: right">
                    <el-button
                      style="padding: 3px 4px"
                      type="danger"
                      @click="handleDelLearning(record)"
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
                    <el-button
                      type="primary"
                      plain
                      style="margin-bottom: 4px; padding: 6px 4px"
                      @click="
                        handleCopyContent(
                          'copyInputAll' + record.id,
                          record.content,
                        )
                      "
                    >
                      复制内容
                    </el-button>
                    <input
                      :ref="'copyInputAll' + record.id"
                      style="opacity: 0; height: 0"
                    />
                    <div class="review__content">{{ record.content }}</div>
                  </div>
                  <h4>学习记录：</h4>
                  <el-button
                    style="padding: 10px 10px; margin-bottom: 10px"
                    type="primary"
                    @click="handleShowReviewItemDialog(record)"
                  >
                    新增复习记录
                  </el-button>
                  <el-table :data="record.reviews" border style="width: 100%">
                    <el-table-column fixed prop="id" label="序号" width="50">
                    </el-table-column>
                    <el-table-column prop="date" label="复习时间" width="100">
                      <template slot-scope="scope">
                        <span>{{
                          dateFormat(
                            +new Date(scope.row.date),
                            "yyyy-MM-dd hh:mm:ss",
                          )
                        }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="next"
                      label="下次复习时间"
                      width="105"
                    >
                      <template slot-scope="scope">
                        <span>{{
                          dateFormat(
                            +new Date(scope.row.next),
                            "yyyy-MM-dd hh:mm:ss",
                          )
                        }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="90">
                      <template slot-scope="scope">
                        <el-button
                          v-if="scope.$index === record.reviews.length - 1"
                          @click.native.prevent="
                            handleShowEditReviewDialog(scope.row, record)
                          "
                          type="text"
                          size="small"
                        >
                          修改
                        </el-button>
                        <el-button
                          @click.native.prevent="
                            handleDeleteReview(scope.row, record)
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
    </div>
    <div class="review-body" v-else></div>

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
            default-time="10:00:00"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleHideReviewItemDialog">取 消</el-button>
        <el-button type="primary" @click="handleAddReviewItem">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改复习记录 -->
    <el-dialog title="修改复习记录" :visible.sync="showEditReviewItemDialog">
      <el-form :model="editReviewItem">
        <el-form-item label="下次复习时间">
          <el-date-picker
            type="datetime"
            placeholder="选择日期"
            v-model="editReviewItem.date"
            :default-value="new Date()"
            default-time="10:00:00"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleHideEditReviewItemDialog">取 消</el-button>
        <el-button type="primary" @click="handleUpdateReviewItem">
          确 定
        </el-button>
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
  updateReview,
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
      selectedTab: "1",
      selectedReview: null,
      selectedLib: {},
      showNewLibDialog: false,
      showLib: true,
      // 是否显示复习日历
      showCalendar: false,
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
      showEditReviewItemDialog: false,
      editReviewItem: {
        learningId: "",
        id: "",
        date: "",
      },
      reviewDateData: {},
    };
  },
  computed: {
    defaultLib() {
      if (!this.selectedLib) {
        return "0";
      }
      return String(this.selectedLib.id);
    },
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
    handleCopyContent(refName, content) {
      const copyElement = this.$refs[refName][0];
      copyElement.value = content;
      copyElement.focus();
      copyElement.select();
      document.execCommand("Copy", false, null);
      this.$notify.success({
        title: "成功",
        message: "复制成功",
        duration: 2000,
      });
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
    async handleDelLearning(record) {
      if (!record.id && Number(record.id) !== 0) {
        return;
      }
      await removeLearning({
        libId: this.selectedLib.id,
        learningId: record.id,
      });
      await this.updateSelectedLib();
    },
    /**
     * 显示复习记录
     */
    handleShowReviewItemDialog(record) {
      this.showNewReviewItemDialog = true;
      this.selectedReview = record;
    },
    /**
     * 取消新增
     */
    handleHideReviewItemDialog() {
      this.showNewReviewItemDialog = false;
      this.selectedReview = null;
    },
    /**
     * 保存复习记录
     */
    async handleAddReviewItem() {
      this.showNewReviewItemDialog = false;
      if (!this.selectedReview || !this.newReviewItem.date) {
        this.$notify.error({
          title: "添加失败",
          message: "数据有误，请重试",
          duration: 2000,
        });
        return;
      }

      await addReview({
        libId: this.selectedLib.id,
        learningId: this.selectedReview.id,
        nextReviewDate: this.newReviewItem.date,
      });
      await this.updateSelectedLib();
      this.selectedReview = null;
      this.newReviewItem = {
        date: "",
      };
    },
    async handleDeleteReview(review, record) {
      await removeReview({
        reviewId: review.id,
        libId: this.selectedLib.id,
        learningId: record.id,
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
      this.countCalendar();
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
      await this.queryLibList();
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
    handleLibSelected(libId, menuPath) {
      const menuType = menuPath[0];

      if (menuType === "lib") {
        this.selectedLib =
          this.libs.filter(
            // eslint-disable-next-line prettier/prettier
            (item) => String(item.id) === String(libId),
          )[0] || {};
        this.showLib = true;
      }

      if (menuType === "calendar") {
        this.showLib = false;
      }
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
      this.countCalendar();
    },
    countCalendar() {
      const dateData = {};
      this.selectedLib.item.map((item) => {
        const dateStr = dateFormat(item.nextReviewTime, "yyyy-MM-dd");
        if (!dateData[dateStr]) {
          dateData[dateStr] = 0;
        }
        dateData[dateStr] = Number(dateData[dateStr]) + 1;
      });
      this.reviewDateData = dateData;
    },
    handleHideEditReviewItemDialog() {
      this.showEditReviewItemDialog = false;
    },
    handleShowEditReviewDialog(opts, record) {
      this.showEditReviewItemDialog = true;
      this.editReviewItem.id = opts.id;
      this.editReviewItem.learningId = record.id;
      this.editReviewItem.date = opts.next;
    },
    async handleUpdateReviewItem() {
      if (!this.selectedLib.id || !this.editReviewItem.date) {
        this.$notify.error({
          title: "修改失败",
          message: "数据有误，请重试",
          duration: 2000,
        });
        return;
      }

      await updateReview({
        libId: this.selectedLib.id,
        learningId: this.editReviewItem.learningId,
        reviewId: this.editReviewItem.id,
        nextReviewDate: this.editReviewItem.date,
      });
      await this.updateSelectedLib();
      this.selectedReview = null;
      this.newReviewItem = {
        learningId: "",
        id: "",
        date: "",
      };
      this.handleHideEditReviewItemDialog();
    },
    handleToggleReviewCalendar() {
      this.showCalendar = !this.showCalendar;
      if (this.showCalendar) {
        this.countCalendar();
      }
    },
  },
};
</script>

<style>
html {
  width: 420px;
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

.today-card {
  margin-bottom: 10px;
}

.today-card .review__body {
  padding: 0;
}

.review-calendar__nums {
  color: #f14545;
}

.review-body .el-calendar-table .el-calendar-day {
  height: 60px;
}
</style>
