<template>
  <div id="app">
    <router-view />

    <!-- 批量导入压缩包 -->
    <import-rar-file></import-rar-file>
    <!-- 批量导入文件 -->
    <import-file-report></import-file-report>
  </div>
</template>

<script>
import importRarFile from './views/admin/importRarFile.vue';
import importFileReport from '@/views/admin/importFileReport.vue';
export default {
  components: { importRarFile, importFileReport },
  name: 'App'
}
</script>
