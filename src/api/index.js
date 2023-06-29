import axios from '../libs/api.request'

export const getSitename = (data) => {
  return axios.request({
    url: '/partner/get/sitename',
    method: 'get',
    params: data
  })
}

export const setNickName = (data) => {
  return axios.request({
    url: '/user/set/nickname',
    method: 'post',
    data: data
  })
}

export const userInfo = (data) => {
  return axios.request({
    url: '/user/info',
    method: 'post',
    data: data
  })
}
export const articleList = (data) => {
  return axios.request({
    url: '/article/list',
    method: 'post',
    data: data
  })
}

export const getWxjsapiticket = (data) => {
  return axios.request({
    url: '/partner/get/wxjsapiticket',
    method: 'get',
    params: data
  })
}

export const userLogin = (data) => {
  return axios.request({
    url: '/user/login',
    method: 'post',
    data: data
  })
}

export const userRegister = (data) => {
  return axios.request({
    url: '/user/register',
    method: 'post',
    data: data
  })
}

export const urlGuide = (data) => {
  return axios.request({
    url: '/biz/url/guide',
    method: 'post',
    data: data
  })
}

export const getWxappid = (data) => {
  return axios.request({
    url: '/partner/get/wxappid',
    method: 'get',
    params: data
  })
}

export const grammarSplit = (data) => {
  return axios.request({
    url: '/biz/grammar/split',
    method: 'post',
    data: data
  })
}

export const ocr = (data) => {
  return axios.request({
    url: '/biz/ocr',
    method: 'post',
    data: data
  })
}

export const grammarAnalysis = (data) => {
  return axios.request({
    url: '/biz/grammar/analysis',
    method: 'post',
    data: data
  })
}

export const bizTts = (data) => {
  return axios.request({
    url: '/biz/tts',
    method: 'post',
    data: data
  })
}

export const urlService = (data) => {
  return axios.request({
    url: '/biz/url/service',
    method: 'post',
    data: data
  })
}

export const translate = (data) => {
  return axios.request({
    url: '/biz/translate',
    method: 'post',
    data: data
  })
}

export const articleListPlan = (data) => {
  return axios.request({
    url: '/article/list-plan',
    method: 'post',
    data: data
  })
}

export const questionList = (data) => {
  return axios.request({
    url: '/article/question/list',
    method: 'post',
    data: data
  })
}

export const articleComplete = (data) => {
  return axios.request({
    url: '/article/complete',
    method: 'post',
    data: data
  })
}

export const articleNext = (data) => {
  return axios.request({
    url: '/article/next',
    method: 'post',
    data: data
  })
}

export const questionSubmit = (data) => {
  return axios.request({
    url: '/article/question/submit',
    method: 'post',
    data: data
  })
}

export const utilSplit = (data) => {
  return axios.request({
    url: '/util/split',
    method: 'post',
    data: data
  })
}

export const bizOralscore = (data) => {
  return axios.request({
    url: '/biz/oralscore',
    method: 'post',
    data: data
  })
}

export const articleEnter = (data) => {
  return axios.request({
    url: '/article/enter',
    method: 'post',
    data: data
  })
}

export const articleAAr = (data) => {
  return axios.request({
    url: '/article/aar',
    method: 'post',
    data: data
  })
}

export const articleSubjects = (data) => {
  return axios.request({
    url: '/article/subjects',
    method: 'post',
    data: data
  })
}

export const articleSearch = (data) => {
  return axios.request({
    url: '/article/search',
    method: 'post',
    data: data
  })
}

export const bizQueryTeacher = (data) => {
  return axios.request({
    url: '/biz/query-teacher',
    method: 'post',
    data: data
  })
}

export const bizSetTeacher = (data) => {
  return axios.request({
    url: '/biz/set-teacher',
    method: 'post',
    data: data
  })
}

export const bizAutoSetTeacher = (data) => {
  return axios.request({
    url: '/biz/auto-set-teacher',
    method: 'post',
    data: data
  })
}

export const userCityList = (data) => {
  return axios.request({
    url: '/user/city/list',
    method: 'post',
    data: data
  })
}

export const userSchoolList = (data) => {
  return axios.request({
    url: '/user/school/list',
    method: 'post',
    data: data
  })
}

export const userSetClass = (data) => {
  return axios.request({
    url: '/user/set/class',
    method: 'post',
    data: data
  })
}

export const userSetLevel = (data) => {
  return axios.request({
    url: '/user/set/level',
    method: 'post',
    data: data
  })
}

export const bizRecharge = (data) => {
  return axios.request({
    url: '/biz/recharge',
    method: 'post',
    data: data
  })
}

export const bizUrlStore = (data) => {
  return axios.request({
    url: '/biz/url/store',
    method: 'post',
    data: data
  })
}
