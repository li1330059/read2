import { createStore } from 'vuex'
import sha1 from 'sha1'
import { userInfo, articleList, getWxjsapiticket } from '../api/index'
import { ElMessage, ElNotification } from 'element-plus';
import createPersistedState from 'vuex-persistedstate'
import router from "../router/index.js"
import { wechatSharefund } from '../libs/wechat_record.js'
import { getLocalPid } from '../libs/util'
export default createStore({
	state: {
		token: '',
		pid: '',
		userId: '',
		title: '',
		wxAppId: '',
		sign: '',
		userInfo: {},
		safeMes: {},
		articleData: {},
		sentence: '',
		word: '',
		offset: -1,
		jsApiTicket: '',
		isChangeArticle: false,
		articleId: 0,
		toArticleId: 0,
		inGetting: 0,
		articleTitle: ''
	},
	mutations: {
		// 登录记录
		login(state, data) {
			state.token = data.token
			state.userId = data.userId
			let num = '12345678'
			let uid = state.userId + ''
			let key = 'read.bluebirdabc.com-web-api'
			let i = 0
			while (uid.length < 8) {
				uid += num[i]
				i++
			}
			let sign = uid + state.token + uid + key
			state.sign = sha1(sign)
			state.safeMes = {
				sign: state.sign,
				token: state.token,
				userId: state.userId
			}
			localStorage.setItem('safeMes', JSON.stringify(state.safeMes))
			let ways = localStorage.getItem('ways')
			console.log('ways', ways)
			if (ways == 'wechat') {
				//				router.push('/my')
				router.push({ name: 'my', query: { pid: getLocalPid() } });
			}
		},
		// 初始化状态
		init(state, data) {
			let data1 = window.localStorage.getItem('userMes')
			if (!data1) return
			let msg = JSON.parse(data1)
			state.token = msg.token
			state.userId = msg.userId

			let num = '12345678'
			let uid = state.userId + ''
			let key = 'read.bluebirdabc.com-web-api'
			let i = 0
			while (uid.length < 8) {
				uid += num[i]
				i++
			}
			let sign = uid + state.token + uid + key
			state.sign = sha1(sign)
			state.safeMes = {
				sign: state.sign,
				token: state.token,
				userId: state.userId
			}
			localStorage.setItem('safeMes', JSON.stringify(state.safeMes))
			if (data == 'share') wechatSharefund()
		},
		// 清空
		exit(state) {
			localStorage.removeItem('userMes');
			state.token = ''
			state.userId = ''
			state.wxAppId = ''
			state.userInfo = {}
			state.safeMes = {}
			state.articleData = {}
			localStorage.removeItem('safeMes')
			localStorage.removeItem('ways');
			localStorage.removeItem('title');
		},
		// 获取标题
		getTitle(state, data) {
			state.title = data
		},
		// 保存微信appid
		saveAppId(state, data) {
			state.wxAppId = data
		},
		// 保存用户信息
		saveUserInfo(state, data) {
			state.userInfo = data
		},

		destoryPreUserMes(state) {
			state.userInfo = {}
		},
		// 保存文章
		saveArticleData(state, data) {
			state.articleData = data
			console.log(state.articleData)
		},
		saveSafeMes(state) {
			let data = localStorage.getItem('safeMes')
			if (data) {
				data = JSON.parse(data)
				state.safeMes = data
			}
		},
		saveJsApiTicket(state, data) {
			state.jsApiTicket = data
		},
		changeSentence(state, str) {
			state.sentence = str || ''
		},
		changeWord(state, str) {
			console.log(str)
			console.log('strstrstr')
			state.word = str || ''
		},
		changeOffset(state, num) {
			state.offset = num || -1
		},
		changeArticle(state, data) {
			console.log('on changeArticle', state, data);
			state.isChangeArticle = data
		},
		// 判断code token过期不 过期重新登录
		judgeCode(state, data) {
			if (data.code >= 1001 && data.code <= 1006) {
				ElMessage.error(data.msg + " " + data.code)
				let chr = localStorage.getItem('ways')
				if (chr == 'wechat') return router.push('/weChat')
				else if (chr == 'username') return router.push({ name: 'login', query: { pid: getLocalPid() } })
				else return router.push({ name: 'my', query: { pid: getLocalPid() } })
			}
			else {
				return ElMessage.error(data.msg + " " + data.code)
			}
		},
		saveArticleId(state, data) {
			state.articleId = data
		},
		saveToArticleId(state, data) {
			console.log('要跳转的article ', data)
			state.toArticleId = data
		},
		changeGettingStatus(state, data) {
			state.inGetting = data
		},
		saveArticleTitle(state, data) {
			state.articleTitle = data
		}
	},
	actions: {
		//获取用户信息
		getUserInfo({ state, commit, dispatch }, data) {
			let obj = {
				userId: state.userId,
				token: state.token,
				sign: state.sign,
				pid: getLocalPid(),
			}
			userInfo(JSON.stringify(obj)).then(res => {
				if (res.data.code) {
					return commit('judgeCode', { code: res.data.code, msg: res.data.msg })
				}
				commit('saveUserInfo', res.data.data)
				console.log('用户信息', state.userInfo)
				let way = localStorage.getItem('ways')
				if (!state.userInfo.hasSchoolInfo && way == 'wechat') {
					return router.push({ name: 'schoolMes', query: { type: 123 } })
				}
				if (data == 'article') {
					dispatch('getArticles')
				}
			}).catch(err => {
				console.log(err)
				ElMessage.error('获取个人信息失败')
			})
		},

		// 获取文章列表
		getArticles({ state, commit }) {
			let obj = {
				...state.safeMes,
				pid: getLocalPid(),
			}
			articleList(JSON.stringify(obj)).then(res => {
				let data = res.data
				if (data.code) return commit("judgeCode", { code: data.code, msg: data.msg })
				commit('saveArticleData', data.data)
			})
				.catch(() => {
					ElMessage.error('获取文章列表失败 请稍后再试')
				})
		},
		// 获取微信Jsapi_ticket
		getWxAppIdAndJsapi_ticket({ state, commit, dispatch }, data) {
			getWxjsapiticket({
				pid: getLocalPid()
			}).then(res => {
				let msg = res.data
				if (msg.code != 0) return ElMessage.error(msg.msg + msg.code)
				console.log(msg)
				commit('saveAppId', msg.data.wxAppId)
				commit('saveJsApiTicket', msg.data.jsApiTicket)
				console.log(state.jsApiTicket)
				//没登录信息 看看本地中是否存储了 有的话就保存 并调用自定义分享
				//有登录信息就直接调用自定义分享
				if (!state.token) {
					commit('init', 'share')
				} else {
					wechatSharefund()
					commit('changeGettingStatus', 1)
					if (data == 'record') return
				}
				if (state.token && !state.userInfo.nickname) dispatch('getUserInfo', 'article')
				else if (state.token && state.userInfo.nickname) {
					if (state.toArticleId) {
						window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + '/article?id=' + state.toArticleId + '&pid=' + localStorage.getItem("pid") ? localStorage.getItem("pid") : ""
						commit('saveToArticleId', 0)
					}
					else {
						dispatch('getArticles')
					}
				}
				if (!state.token) {
					ElNotification({
						title: '提示',
						message: '登录后获取定制的文章哦',
						type: 'warning',
						duration: 2000,
						position: 'top-left'
					});
					router.push({ name: 'my', query: { pid: getLocalPid() } })
				}
			}).catch(err => {
				console.log('err', err)
				ElMessage.error(err)
			})
		},
	},
	modules: {
	},
	plugins: [
		createPersistedState({
			storage: {
				getItem: (key) => {
					try {
						return JSON.parse(localStorage.getItem(key))
					} catch (error) {
						return localStorage.getItem(key)
					}
				},
				setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
				removeItem: (key) => localStorage.removeItem(key)
			}
		})
	]
})
