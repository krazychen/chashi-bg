<template>
  <el-popover v-model="visible" placement="bottom" width="200" trigger="manual" @show="showPopover">
    <el-input
      ref="sInput"
      v-model="value"
      placeholder="请输入内容"
      clearable
      @keyup.enter.native="confirm"
    >
      <!-- <el-button slot="append" icon="el-icon-search" @click="confirm"> -->
      <!-- </el-button> -->
    </el-input>
    <el-button type="primary" size="mini" style="margin-top:5px" @click="confirm">搜索</el-button>
    <el-button size="mini" @click="resetData">重置</el-button>
    <div slot="reference" v-click-outside="closeOver" style="margin-left:5px" @click.stop="popClick">
      <!-- <i class="el-icon-search" :style="{'color':iconColor}" ></i> -->
      <svg
        viewBox="64 64 896 896"
        data-icon="search"
        width="1em"
        height="1em"
        fill="currentColor"
        :style="{'color':iconColor? 'rgb(16, 142, 233)': '', 'margin-top': '5px'}"
      >
        <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" />
      </svg>
    </div>
  </el-popover>
</template>

<script>
export default {
  directives: {
    clickOutside: {
      bind(el, binding, vnode) {
        function clickHandler(e) {
          // 这里判断点击的元素是否是本身，是本身，则返回
          if (el.contains(e.target)) {
            return false
          }
          // 判断指令中是否绑定了函数
          if (binding.expression) {
            // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
            binding.value(e)
          }
        }
        // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
        el.__vueClickOutside__ = clickHandler
        document.addEventListener('click', clickHandler)
      },
      update() {},
      unbind(el, binding) {
        // 解除事件监听
        document.removeEventListener('click', el.__vueClickOutside__)
        delete el.__vueClickOutside__
      }
    }
  },
  props: {
    tableType: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    defaultValue: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: function() {
        return []
      }
    },
    defaultProps: {
      type: Object,
      default: function() {
        return {
          label: 'label',
          value: 'value'
        }
      }
    }
  },
  data() {
    return {
      value: '',
      visible: false,
      iconColor: false
    }
  },
  watch: {
    defaultValue(newVal, oldVal) {
      const self = this
      self.value = newVal
    }

  },
  methods: {
    showPopover() {
      this.$nextTick(() => {
        this.$refs.sInput.focus()
      })
    },
    resetData() {
      console.log('reset')
      this.value = ''
      this.visible = false
      this.iconColor = false
      const self = this
      self.$emit('resetChange', { type: self.type, value: self.value, tableType: self.tableType })
    },
    closeOver() {
      this.visible = false
    },
    popClick(e) {
      // e.stopPropagation()
      this.visible = !this.visible
    },
    confirm() {
      this.visible = false
      this.iconColor = true
      const self = this
      if (self.value) {
        self.$emit('selectChange', { type: self.type, value: self.value, tableType: self.tableType })
      }
    }
  }
}
</script>
