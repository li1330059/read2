import { createRouter, createWebHistory, } from 'vue-router'
import index from '../views/reading/index/index_copy.vue'//
import home from '../views/home/index_copy.vue'//
// import login from '../views/my/login/login.vue'
import register from '../views/my/register/register_copy.vue'
import before from '../views/my/before/before.vue'
import search from '../views/reading/index/search_copy.vue' //
import weChat from '../views/my/weChat/weChat.vue'
import schoolMes from '../views/my/schoolMes/schoolMes_copy.vue'
import classMes from '../views/my/schoolMes/classMes_copy.vue'
import studentMes from '../views/my/schoolMes/studentMes_copy.vue'
import classInfo from '../views/my/schoolMes/classInfo_copy.vue'
import schoolInfo from '../views/my/schoolMes/schoolInfo_copy.vue'
import myCourse from '../views/reading/article/myCourse_copy.vue'
import record from '../views/reading/record/record.vue'
import teacher from '../views/reading/teacher/teacher.vue'
import my from '../views/my/my/my_copy.vue'
import user from '../views/my/my/user_copy.vue'
import ability from '../views/my/ability/ability_copy.vue'
import recharge from '../views/my/recharge/recharge_copy.vue'
import photo from '../views/reading/photo/photo.vue'
import plan from '../views/reading/index/plan_copy.vue'
import article from '../views/reading/article/article.vue'
import practice from '../views/reading/practice/practice.vue'
import level from '../views/my/level/level_copy.vue'


import { getInitSpanMillis, getLocalPid } from '../libs/util'
const routes = [
	{
		path: '/',
		redirect: '/index',
	},
	{
		path: '/home',
		name: 'home',
		component: home
	},
	{
		path: '/level',
		name: 'level',
		component: level
	},
	{
		path: '/practice',
		name: 'practice',
		component: practice
	},
	{
		path: '/index',
		name: 'index',
		component: index
	},
	{
		path: '/article',
		name: 'article',
		component: article
	},
	{
		path: '/ability',
		name: 'ability',
		component: ability
	},
	// {
	// 	path: '/login',
	// 	name: 'login',
	// 	component: login
	// },
	{
		path: '/register',
		name: 'register',
		component: register
	},
	{
		path: '/before',
		name: 'before',
		component: before
	},
	{
		path: '/weChat',
		name: 'weChat',
		component: weChat
	},
	{
		path: '/my',
		name: 'my',
		component: my
	},
	{
		path: '/user',
		name: 'user',
		component: user
	},
	{
		path: '/photo',
		name: 'photo',
		component: photo
	},
	{
		path: '/plan',
		name: 'plan',
		component: plan
	},
	{
		path: '/search',
		name: 'search',
		component: search
	},
	{
		path: '/record',
		name: 'record',
		component: record
	},
	{
		path: '/teacher',
		name: 'teacher',
		component: teacher
	},
	{
		path: '/schoolMes',
		name: 'schoolMes',
		component: schoolMes
	},
	{
		path: '/classMes',
		name: 'classMes',
		component: classMes
	},
	{
		path: '/studentMes',
		name: 'studentMes',
		component: studentMes
	},
	{
		path: '/classInfo',
		name: 'classInfo',
		component: classInfo
	},
	{
		path: '/schoolInfo',
		name: 'schoolInfo',
		component: schoolInfo
	},
	{
		path: '/recharge',
		name: 'recharge',
		component: recharge
	},
	{
		path: '/myCourse',
		name: 'myCourse',
		component: myCourse
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

router.beforeEach((to, from, next) => {
	let token = window.localStorage.getItem('userMes') ? JSON.parse(localStorage.getItem('userMes')).token : ''

	let initSpan = getInitSpanMillis();
	if (!token && initSpan < 10 * 60 * 1000 && (to.name === 'photo' || to.name === 'article')) {
		token = 'protected-token';
	}

	if (!token && (to.name !== 'home' && to.name !== 'login' && to.name !== 'register' && to.name !== 'before' && to.name !== 'weChat' && to.name !== 'article')) {
		next({
			name: 'home', query: { pid: getLocalPid() }
		});
	} else if (!token && (to.name === 'home' || to.name === 'login' || to.name === 'register' || to.name === 'before' || to.name === 'weChat')) {
		next()
	} else if (token && to.name === 'home') {
		next()
	} else if (token && (to.name === 'login' || to.name === 'register' || to.name === 'before' || to.name === 'weChat')) {
		next({
			name: 'index', query: { pid: getLocalPid() }
		})
	} else {
		next()
	}
})
const originalPush = router.push

router.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

export default router
