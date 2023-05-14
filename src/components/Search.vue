<template>
  <div class="search-block">
    <Search class="icon-search" />
    <el-select
      filterable
      placeholder="input city"
      remote-show-suffix="false"
      class="place-input"
      v-model="currentCity"
      @change="changeSelect"
    >
      <el-option
        v-for="item in options"
        :key="item.cityCode"
        :label="item.label"
        :value="item.cityCode"
      />
    </el-select>

    <el-date-picker
      class="date-picker"
      v-model="pickDate"
      type="daterange"
      start-placeholder="Start Date"
      end-placeholder="End Date"
      :default-value="[new Date(2023, 5, 10), new Date(2023, 5, 20)]"
    />

    <el-input
      v-model="inputFilter"
      placeholder="2 adults, 0 children, 1 room"
      class="filter-input"
    />

    <el-button type="primary" class="search-button" @click="search">Search</el-button>
  </div>
</template>

<script>
import { onBeforeMount, ref, toRefs } from 'vue';
import hotelService from '@/services/hotelService';

export default {
  props: {
    selectedCity: String,
  },
  setup(props, context) {
    const pickDate = ['2023-05-10', '2010-05-20'];
    const options = ref([]);
    const inputFilter = ref('');
    const currentCity = ref('');

    const { selectedCity } = toRefs(props);
    currentCity.value = selectedCity.value;

    /**
     * @inital get all city name nad city code through remote api.
     */
    onBeforeMount(async () => {
      const result = await hotelService.getCitys();
      options.value.push(...result);
    });

    const changeSelect = (city) => {
      console.log('changeselect:', city);
      currentCity.value = city;
      // context.emit('getHotels', city);
    };

    const search = () => {
      console.log('search:', currentCity.value);
      context.emit('getHotels', currentCity.value);
    };

    return {
      inputFilter,
      pickDate,
      options,
      changeSelect,
      search,
      currentCity,
    };
  },
};
</script>

<style>
.search-block {
  position: relative;
}
.place-input {
  box-sizing: border-box;
  position: absolute;
  left: 145px;
  top: 10px;
  background: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 3px;
  width: 370px;
  height: 50px;
}

.place-input input {
  height: 50px;
  padding-left: 25px;
}

.date-picker {
  box-sizing: border-box;
  position: absolute;
  left: 525px;
  top: 10px;
  /* white */
  background: #ffffff;
  /* line */
  border: 1px solid #dddddd;
  border-radius: 3px;
  height: 50px;
  width: 210px !important;
}

.filter-input {
  position: absolute;
  height: 50px;
  width: 200px;
  left: 745px;
  top: 10px;
  border-radius: 3px;
}

.filter-input > input {
  height: 50px;
}

.search-button {
  position: absolute;
  /* left: 79.51%;
  right: 10.07%;
  top: 14.29%;
  bottom: 14.29%; */
  /* blue 2 */
  background: #00a1e6;
  border-radius: 3px;
  height: 50px;
  width: 150px;
  left: 955px;
  top: 10px;
  border-radius: 3px;
}

.search-button > span {
  /* height: 22.5px; */
  /* width: 78.33333587646484px;
  left: 1181.666748046875px; */
  /* top: 22.5px; */
  font-family: 'Mulish';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 23px;
  /* identical to box height */
  display: flex;
  align-items: flex-end;
  text-align: center;
  /* white */
  color: #ffffff;
}

.icon-search {
  width: 1em;
  height: 1em;
  margin-right: 8px;
  position: absolute;
  left: 150px;
  top: 28px;
  z-index: 1001;
}
</style>
