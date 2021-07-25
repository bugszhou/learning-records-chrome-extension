<template>
  <div class="main">
    <h3>复习记录器</h3>
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-submenu index="1">
        <template slot="title">我的复习库</template>
        <el-menu-item index="1-1">
          算法和数据结构 (今日：10，总计：100)
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <div class="review-info">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="review__header">算法和数据结构</span>
        </div>
        <section style="text-align: right">
          <el-button
            style="padding: 3px 4px"
            type="text"
            @click="handleShowNewDialog"
          >
            新增记录
          </el-button>
          <el-button style="padding: 3px 4px" type="danger"> 删除 </el-button>
          <el-button style="padding: 3px 4px" type="text"> 结束 </el-button>
        </section>
        <div v-for="o in 4" :key="o" class="text item">
          {{ "列表内容 " + o }}
        </div>
      </el-card>
    </div>
    <div class="review__list">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="今日复习" name="first">
          <div class="review__body">
            <el-collapse
              v-model="activeRecords"
              @change="handleActiveRecordChange"
            >
              <el-collapse-item title="两数之和" name="1">
                <div class="review__info">
                  <div class="review__info-warp">
                    <div class="info">上一次学习：2021-07-25 20:12:30</div>
                    <div class="info">下一次学习：2021-07-26 20:12:30</div>
                    <div class="info">
                      <span class="info__item">已学习：5次</span>
                    </div>
                  </div>
                  <h4>学习内容：</h4>
                  <div class="review__content">https://baidu.com</div>
                </div>
                <h4>学习记录：</h4>
                <el-button
                  style="padding: 10px 10px; margin-bottom: 10px"
                  type="primary"
                  @click="handleShowReviewItemDialog"
                >
                  新增复习记录
                </el-button>
                <el-table :data="tableData" border style="width: 100%">
                  <el-table-column fixed prop="id" label="序号" width="50">
                  </el-table-column>
                  <el-table-column prop="date" label="复习时间" width="130">
                  </el-table-column>
                  <el-table-column prop="next" label="下次复习时间" width="130">
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="50">
                    <el-button type="text" size="small">编辑</el-button>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>
            <el-collapse
              v-model="activeRecords"
              @change="handleActiveRecordChange"
            >
              <el-collapse-item title="两数之和" name="2">
                <div class="review__info">
                  <div class="review__info-warp">
                    <div class="info">上一次学习：2021-07-25 20:12:30</div>
                    <div class="info">下一次学习：2021-07-26 20:12:30</div>
                    <div class="info">
                      <span class="info__item">已学习：5次</span>
                    </div>
                  </div>
                  <h4>学习内容：</h4>
                  <div class="review__content">https://baidu.com</div>
                </div>
                <h4>学习记录：</h4>
                <el-button
                  style="padding: 10px 10px; margin-bottom: 10px"
                  type="primary"
                  @click="handleShowReviewItemDialog"
                >
                  新增复习记录
                </el-button>
                <el-table :data="tableData" border style="width: 100%">
                  <el-table-column fixed prop="id" label="序号" width="50">
                  </el-table-column>
                  <el-table-column prop="date" label="复习时间" width="130">
                  </el-table-column>
                  <el-table-column prop="next" label="下次复习时间" width="130">
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="50">
                    <el-button type="text" size="small">编辑</el-button>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>
        <el-tab-pane label="全部内容" name="second">全部</el-tab-pane>
      </el-tabs>
    </div>

    <!-- 新增学习记录 -->
    <el-dialog title="新增学习记录" :visible.sync="showNewDialog">
      <el-form :model="newReviewRecord">
        <el-form-item label="学习内容" :label-width="80">
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
            type="date"
            placeholder="选择日期"
            v-model="newReviewItem.date"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showNewReviewItemDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleAddReviewItem">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1",
      activeName: "first",
      tableData: [
        {
          id: "01",
          date: "2021-07-21 15:30:02",
          next: "2021-07-22 15:30:02",
        },
      ],
      activeRecords: ["1"],
      showNewDialog: false,
      newReviewRecord: {
        content: "",
      },
      showNewReviewItemDialog: false,
      newReviewItem: {
        date: "",
      },
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClick(tab, event) {
      console.log(tab, event);
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
    handleAddReviewRecord() {
      this.showNewDialog = false;
      console.log(this.newReviewRecord);
    },
    /**
     * 显示复习记录
     */
    handleShowReviewItemDialog() {
      this.showNewReviewItemDialog = true;
    },
    /**
     * 保存复习记录
     */
    handleAddReviewItem() {
      this.showNewReviewItemDialog = false;
      console.log(this.newReviewItem);
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

.el-dialog {
  width: 80%;
}
</style>
