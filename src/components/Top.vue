<template>
  <div>
    <img src="../assets/cloudtravel-logo.jpg" />
    <div class="top-right">
      <el-dropdown>
        <span class="el-dropdown-link">
          English
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(item, index) in languages" :key="index">{{
              item
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown>
        <span class="el-dropdown-link">
          USD
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(item, index) in currency" :key="index">{{
              item
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <span>My Account</span>
      <span>Log Out</span>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import initSetting from '@/services/initSetting';

const languages = ref([]);
const currency = ref([]);
onBeforeMount(() => {
  languages.value = initSetting.setupLanguages();
  currency.value = initSetting.setupCurrency();
});
</script>

<style scoped>
img {
  position: absolute;
  width: 227.5px;
  height: 35px;
  left: 147px;
  top: 13px;
  object-fit: cover;
}

.el-dropdown {
  cursor: pointer;
  color: #000000;
  padding-right: 10px;
}

.top-right span {
  cursor: pointer;
  color: #000000;
  padding-right: 10px;
}

.top-right {
  font-family: 'Mulish';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  /* identical to box height */

  display: flex;
  align-items: flex-end;
  text-align: right;
  letter-spacing: 0.01em;

  /* 000 */

  color: #000000;
  position: absolute;
  /* left: 68.12%; */
  /* right: 9.31%; */
  /* top: 35.18%; */
  /* bottom: 32%; */
  height: 20px;
  width: 325px;
  left: 850px;
  top: 21.435546875px;
  border-radius: 3px;
}
</style>
