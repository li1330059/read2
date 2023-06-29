<template>
  <div id="root">
    <router-view />
  </div>
</template>

<style>
* {
  text-decoration: none;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 14px;
}
html,
body {
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: #f7f7f7;
}
#root {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: #f7f7f7;
}
/* flex常用方法 */
.flex {
  display: flex;
}
.justify-center {
  justify-content: center;
}
.align-center {
  align-items: center;
}
.flex-1 {
  flex: 1;
}
.flex-column {
  flex-direction: column;
}

/* 定位 */
.position-relative {
  position: relative;
}
.position-absolute {
  position: absolute;
}
.position-fiexd {
  position: fixed;
}
.top-0 {
  top: 0;
}
.left-0 {
  left: 0;
}
.right-0 {
  right: 0;
}
.bottom-0 {
  bottom: 0;
}

/* 主题 */
.theme-color {
  color: #6995e6;
}
.font-bold {
  font-weight: 700;
}

/* 长宽 */
.w-100 {
  width: 100%;
}
.h-100 {
  height: 100%;
}

/* 文字格式 */
.text-left {
  text-align: left;
}
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}
.text-white {
  color: white;
}

/* 背景 */
.bg-white {
  background-color: white;
}

/* 行内块 */
.inline-block {
  display: inline-block;
}
.el-message {
  min-width: auto !important;
  width: 90%;
}
</style>
