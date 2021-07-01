<template>
  <el-radio-group v-if="tagType=='radio'" :value="value" :disabled="disabled" :style="styleN" :class="classN" :size="sizeN" @change="handleInput">
    <el-radio v-for="(item, key) in dictOptions" :key="key" :value="item.dictValue" :label="item.dictValue">
      {{ item.dictLabel }}
    </el-radio>
  </el-radio-group>

  <el-select v-else-if="tagType=='select'" :value="value" :placeholder="placeholder" :disabled="disabled" :style="styleN" :class="classN" :size="sizeN" @change="handleInput">
    <el-option value="">请选择</el-option>
    <el-option v-for="(item, key) in dictOptions" :key="key" :value="item.dictValue" :label="item.dictLabel" />
  </el-select>
</template>

<script>
import { getDictDataList } from '@/utils/dictUtils'

export default {
  name: 'DictSelect',
  props: {
    dictType: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    triggerChange: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    styleN: {
      type: String,
      default: ''
    },
    classN: {
      type: String,
      default: ''
    },
    sizeN: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dictOptions: [],
      tagType: ''
    }
  },
  watch: {
    dictType: {
      immediate: true,
      handler() {
        this.initDictData()
      }
    }
  },
  created() {
    // console.log(this.type)
    if (!this.type || this.type === 'list') {
      this.tagType = 'select'
    } else {
      this.tagType = this.type
    }
    // 获取字典数据
    // this.initDictData();
  },
  methods: {
    initDictData() {
      // 根据字典type, 初始化字典数组
      this.dictOptions = getDictDataList(this.dictType)
    },
    handleInput(e) {
      console.log(e)
      let val = e
      // // eslint-disable-next-line eqeqeq
      if (this.tagType === 'radio') {
        val = e.target.value
      } else {
        val = e
      }
      if (this.triggerChange) {
        this.$emit('change', val)
      } else {
        this.$emit('input', val)
      }
    },
    setCurrentDictOptions(dictOptions) {
      this.dictOptions = dictOptions
    },
    getCurrentDictOptions() {
      return this.dictOptions
    }
  }
}
</script>

<style scoped>
</style>
