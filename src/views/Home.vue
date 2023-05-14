<template>
  <div class="Home">
    <!-- nav bar -->
    <Top class="Top"></Top>
    <!-- search bar -->
    <Search class="Search" :selectedCity="selectedCity" @getHotels="getHotels"></Search>
    <!-- main content area -->
    <Main
      class="Main"
      :isLoading="isLoading"
      :selectedCity="selectedCity"
      :rootSource="rootSource"
      @getHotels="getHotels"
    >
    </Main>
    <!-- bottom bar -->
    <Bottom class="Bottom"></Bottom>
  </div>
</template>

<script>
// @ is an alias to /src
import Main from '@/components/Main.vue';
import Bottom from '@/components/Bottom.vue';
import Top from '@/components/Top.vue';
import Search from '@/components/Search.vue';
import { ref, onBeforeMount, provide } from 'vue';
import hotelService from '@/services/hotelService';
import filterService from '@/services/filterService';

export default {
  name: 'Home',
  components: {
    Top,
    Main,
    Search,
    Bottom,
  },
  setup() {
    const selectedCity = ref('sgsg');
    const rootSource = ref([]);
    const isLoading = ref(true);

    const getHotels = async (newValue) => {
      isLoading.value = true;
      console.log('isloading', isLoading.value);
      let ifRunnFilter = false;
      if (typeof newValue === 'object') {
        ifRunnFilter = true;
      } else if (newValue) {
        // city changed need to get hotels again so that turn on loading mask.
        selectedCity.value = newValue;
        console.log('home:', selectedCity.value);
      }

      // get all root source (hotels) through remote API.
      await hotelService
        .getHotels(selectedCity.value)
        .then((res) => {
          if (res.data.status === 400) {
            rootSource.value = { errorMessage: res.data.message };
          } else if (ifRunnFilter) {
            const filledResults = filterService.filter(newValue, res.data.outlets.availability);
            rootSource.value.results = filledResults;
          } else {
            rootSource.value = res.data.outlets.availability;
          }

          isLoading.value = false;
          console.log('isloading', isLoading.value);
        })
        .catch((error) => {
          isLoading.value = false;
          console.error(
            'an error has been occurred while get profile, the details is %s',
            error
          );
          rootSource.value = { errorMessage: error.message };
        });
    };

    onBeforeMount(async () => {
      await getHotels(false);
    });

    provide('getHotels', getHotels);

    return {
      selectedCity,
      getHotels,
      isLoading,
      rootSource,
    };
  },
};
</script>

<style>
.Home {
  width: 100%;
  height: 100%;
}

.Top {
  width: 100%;
  height: 70px;
  background: #ffffff;
  position: relative;
}

.Search {
  width: 100%;
  height: 70px;
  background: #002d63;
  border-radius: 3px;
}

.Main {
  width: 100%;
  min-height: calc(100% - 260px);
}

.Bottom {
  width: 100%;
  height: 120px;
  background: #000000;
  position: relative;
}

.title {
  width: 100%;
  height: 30px;
  display: inline-flex;
  justify-content: space-between;
}

.margin-right-10 {
  margin-right: 10px;
}

.margin-top-10 {
  margin-top: 10px;
}

.padding-top-10 {
  padding-top: 10px;
}

.font-white-14 {
  color: #ffffff;
  font-family: 'Mulish';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
}

.font-white-18 {
  color: #ffffff;
  font-family: 'Mulish';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 20px;
}

.filter-block {
  background: white;
  min-height: 120px;
  width: 290px;
  border-radius: 5px;
  display: inline;
}

.margin-right-10 {
  margin-right: 10px;
}

.margin-top-10 {
  margin-top: 10px;
}

.margin-left-10 {
  margin-left: 10px;
}

.padding-top-10 {
  padding-top: 10px;
}

.padding-left-10 {
  padding-left: 10px;
}

.padding-right-10 {
  padding-right: 10px;
}

.font-blue-12 {
  font-family: 'Mulish';
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 20px;
  /* identical to box height, or 167% */
  text-transform: uppercase;
  /* blue 1 */
  color: #002d63;
  cursor: pointer;
}

.font-grey-12 {
  font-family: 'Mulish';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  /* identical to box height, or 133% */
  color: #757575;
}

.font-black-16 {
  font-family: Mulish;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 32px;
  color: #000000;
}

.display-block {
  display: block;
}

.text-align-left {
  text-align: left;
}
.text-align-center {
  text-align: center;
}

.width-100 {
  width: 100%;
}
</style>
