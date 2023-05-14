<template>
  <div class="main-block">
    <div class="left-panel">
      <Filter ref="filterComponent"></Filter>
    </div>
    <div class="right-panel">
      <div class="display-panel">
        <div class="bar">
          <div style="width-100" v-if="root">
            <span v-if="isLoading" class="font-black-16 display-block text-align-left">
              Finding the best deals...
            </span>
            <span v-else class="font-black-16 display-block text-align-left"
              >{{ selectedCity }}:
              {{ root.pagination ? root.pagination.totalItems : 0 }} properties found
            </span>

            <div class="sort-panel">
              <span
                v-bind:class="{ selected_sort: currentSort.isPopular }"
                @click="sortCard('isPopular')"
                >Popularity</span
              >
              <span
                v-bind:class="{ selected_sort: currentSort.isPrice }"
                @click="sortCard('isPrice')"
                >Price(lowest first)
                <el-icon><CaretBottom /> </el-icon>
              </span>
              <span
                v-bind:class="{ selected_sort: currentSort.isReview }"
                @click="sortCard('isReview')"
                >Reviews</span
              >
              <span
                v-bind:class="{ selected_sort: currentSort.isDiscount }"
                @click="sortCard('isDiscount')"
                >Discount</span
              >
            </div>
          </div>
        </div>

        <div class="cards">
          <!-- loading -->
          <Loading v-if="isLoading"></Loading>
          <!-- error display -->
          <template v-if="!isLoading">
            <!-- error page -->
            <div
              v-if="root && !!root.errorMessage"
              class="font-black-16"
              style="color: #757575; padding-top: 50px"
            >
              <el-icon><Warning /></el-icon>
              <p>Opps, something went wrong.</p>
              <p>{{ root.errorMessage }}</p>
            </div>
            <!-- have data to display -->
            <div v-else-if="root.results.length">
              <div
                class="card margin-top-10"
                v-for="(item, index) in root.results"
                :key="index"
              >
                <Card :cardInfo="item" :id="index"></Card>
              </div>
            </div>
            <!-- no data to display -->
            <div v-else class="font-black-16" style="color: #757575; padding-top: 50px">
              <el-icon><Search /></el-icon>
              <p>Sorry! We cloudn't find any properties for your search.</p>
            </div>
          </template>
          <!-- 分页 -->
          <div
            v-if="
              !isLoading &&
              root &&
              !root.errorMessage &&
              root.results &&
              root.results.length
            "
            style="margin: 10px 0"
          >
            <span class="font-blue-12" style="float: left" @click="goTop($event)">
              Back to top
            </span>
            <span class="font-grey-12" style="color: #cccccc" v-if="root.pagination">
              Showing Results {{ root.pagination.showing[0] }} -
              {{ root.pagination.showing[1] }} of {{ root.pagination.totalItems }}
            </span>
            <el-pagination
              small
              layout="prev, pager, next"
              :total="100"
              v-model:current-page="currentPage"
              @current-change="switchPage($event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, toRefs, watchEffect, ssrContextKey } from 'vue';
import { Search } from '@element-plus/icons-vue';
import Filter from '@/components/Filter.vue';
import Loading from '@/components/Loading.vue';
import Card from '@/components/Card.vue';
import sortService from '@/services/sortService';

export default {
  name: 'Main',
  components: {
    Filter,
    Loading,
    Card,
  },
  emits: ['getHotels'],
  props: {
    selectedCity: String,
    rootSource: Object,
    isLoading: Boolean,
  },
  setup(props, content) {
    console.log('main:', props);

    const filterComponent = ref();
    const { rootSource, selectedCity, isLoading } = toRefs(props);
    const root = ref({});
    root.value = rootSource.value;
    watchEffect(() => {
      root.value = rootSource.value;
    });

    /**
     * @description change sort approach
     * highlight select sort approach.
     */
    const currentSort = reactive({
      isPopular: true,
      isPrice: false,
      isReview: false,
      isDiscount: false,
    });
    const sortCard = (sortName) => {
      currentSort.isPopular = false;
      currentSort.isPrice = false;
      currentSort.isReview = false;
      currentSort.isDiscount = false;

      currentSort[sortName] = true;
      try {
        sortService.sort(sortName, rootSource.value);
      } catch (error) {
        console.log(
          `an error has been occurred while filtering data by condition, details is ${error}`
        );
        root.value = { errorMessage: error.message };
      }
    };

    /**
     * @description simulate change page action, mock data
     * @param {} newPage
     */
    const currentPage = ref(1);
    const switchPage = (newPage) => {
      console.log('go to last page', newPage);
      currentPage.value = newPage;
      content.emit('getHotels', false);
    };

    /**
     * @description back to top
     * @param {*} $event
     */
    const goTop = ($event) => {
      let targetPoint = 0;
      let speed = 1;
      const goSpeed = setInterval(() => {
        speed++;
        targetPoint = window.pageYOffset - 10 * speed;
        window.scrollTo(window.pageXOffset, targetPoint);
        if (window.pageYOffset < 100) {
          clearInterval(goSpeed);
          console.log('go to top');
        }
      }, 10);
    };

    /**
     * @description watach city change
     * reset filter condition
     */
    watch(
      () => props.selectedCity,
      (newvalue, oldvalue) => {
        console.log('main watch:', newvalue);
        if (newvalue !== oldvalue) {
          currentSort.isPopular = true;
          currentSort.isPrice = false;
          currentSort.isReview = false;
          currentSort.isDiscount = false;
          filterComponent.value.reset();
        }
      }
    );

    return {
      filterComponent,
      Search,
      root,
      currentSort,
      sortCard,
      currentPage,
      switchPage,
      goTop,
    };
  },
};
</script>

<style scoped>
.font-black-14 {
  font-family: 'Mulish';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  color: #000000;
}

.main-block {
  position: relative;
  display: inline-flex;
}
.left-panel {
  display: inline-flex;
  height: 100%;
  width: 350px;
  flex-direction: column;
  align-items: flex-end;
  background: transparent;
}
.right-panel {
  display: inline;
  height: 100%;
  width: 900px;
  float: right;
}
.slider-demo-block {
  display: flex;
  align-items: center;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}
.display-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.sort-panel {
  width: 850px;
  display: flex;
  justify-content: space-between;
}

.sort-panel > span {
  line-height: 44px;
  width: 210px;
  background: #ffffff;
  display: inline-block;
  height: 100%;
  border-radius: 5px;
  border: 1px solid #dddddd;
  cursor: pointer;
}

.selected_sort {
  border: 1px solid #dddddd;
  background: #002d63 !important;
  color: #ffffff;
}

.hotel-input {
  background: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 3px;
  width: 250px;
  height: 40px;
}

.bar {
  width: 100%;
  /* background-color: aquamarine; */
  height: 80px;
}

.cards {
  width: 100%;
  /* background-color: beige; */
}

.card {
  height: 230px;
  width: 850px;
  background: #ffffff;
  display: flex;
  border-radius: 5px;
}

.card:hover {
  box-shadow: 2px 2px 2px #cccccc;
}

::v-deep .el-pagination button:disabled {
  background-color: transparent !important;
}

::v-deep .el-pagination .btn-next,
::v-deep .el-pagination .btn-prev {
  background-color: transparent !important;
}

::v-deep .el-pager li {
  background-color: transparent !important;
}

::v-deep .el-pager li.active {
  background-color: #002d63 !important;
  color: #ffffff;
}
</style>
