<script setup lang="ts">
import { computed, defineAsyncComponent, ref, onMounted, Component, h } from "vue";
import { IconSvg, PromptStore, SvgIcon } from '@/components/common'
import { getConfigKey } from '@/api/user';
import { useBasicLayout } from '@/hooks/useBasicLayout'
const { isMobile } = useBasicLayout()
import { removeToken } from '@/store/modules/auth/helper'
import { NTooltip, useMessage, NAvatar, NPopover, NMenu, NIcon } from 'naive-ui'
import { homeStore, useChatStore } from '@/store'
import { loginOut, getUserInfo } from '@/api/user'
import { UserData } from "@/typings/user"
import { defaultSetting, UserInfo } from '@/store/modules/user/helper'
import { useRouter } from 'vue-router'
import { getToken } from "@/store/modules/auth/helper";
import to from "await-to-js";
import {
  Settings as settings,
  Storefront as storefront,
  LogOut as out
} from '@vicons/ionicons5'

const chatStore = useChatStore()
//import gallery from '@/views/gallery/index.vue'

const Setting = defineAsyncComponent(() => import('@/components/common/Setting/index.vue'))


const st = ref({ 'show': false, showImg: false, menu: [], active: 'chat' })
const router1 = useRouter()
const userInfo = ref<UserInfo>(defaultSetting().userInfo)
const message = useMessage()
const show = ref(false)
const urouter = useRouter() //
const isLogin = computed(() => {
  return localStorage.getItem('TOKEN')
});

import { router } from '@/router'

const goHome = computed(() => {
  return router.currentRoute.value.name
});

onMounted(() => {
  getLogo();
  getLoginUserInfo();
});

/**
 * 获取默认头像
 */
async function getLogo() {
  const [err1, res1] = await to(getConfigKey("logoImage"));
  if (err1) {
    console.error("获取配置失败", err1.message);
  } else {
    userInfo.value.avatar = res1.msg;
  }
}

/**
 * 获取当前登录用户信息
 */
async function getLoginUserInfo() {
  // 用户未登录,不需要获取用户信息
  if (!getToken()) {
    return
  }
  const [err, newUserInfo] = await to(getUserInfo<UserData>());
  if (err) {
    // message.error(err.toString())
    console.log(err.toString())
  }
  if (newUserInfo) {
    if (newUserInfo.data.user.avatar) {
      userInfo.value.avatar = newUserInfo.data.user.avatar;
    }
    userInfo.value.name = newUserInfo.data.user.nickName;
    userInfo.value.userBalance = newUserInfo.data.user.userBalance;
    userInfo.value.userName = newUserInfo.data.user.userName;
    isLogin.value = true
  }
}

const chatId = computed(() => chatStore.active ?? '1002');/**
 * 退出登录
 */
async function handleReset() {
  await loginOut()
  // 删除用户token
  removeToken();
  // 跳转到登录页面
  router1.push('/login')
}

async function longin() {
  // 跳转到登录页面
  router1.push('/login')
}

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = ref([
  {
    label: '账号设置',
    key: 'accountSettings',
    icon: renderIcon(settings)
  },
  {
    label: '购买套餐',
    key: 'buy',
    icon: renderIcon(storefront)
  },
  {
    label: '退出账号',
    key: 'logout',
    icon: renderIcon(out)
  }
])

const handleSelect = (key: string) => {
  if (key === 'accountSettings') {
    st.value.show = true
  } else if (key === 'logout') {
    handleReset()
  } else if (key === 'buy') {
    show.value = true
  }
}
</script>
<template>


  <div class="flex-shrink-0 w-[60px] z-[1000]  h-full" v-if="!isMobile" data-tauri-drag-region>
    <div
      class="flex h-full select-none flex-col items-center justify-between bg-[#e8eaf1] px-2 pt-4 pb-8 dark:bg-[#25272d]">
      <div class="flex flex-col space-y-4 flex-1 " data-tauri-drag-region>
        <a @click="st.active = 'chat'; urouter.push(`/chat`)"
          class="router-link-active router-link-exact-active h-12 w-12 cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c] hover:bg-[#bbb] dark:hover:bg-[#555]">
          <n-tooltip placement="right" trigger="hover">
            <template #trigger>
              <div class="flex h-full justify-center items-center py-1 flex-col "
                :class="[goHome == 'Chat' ? 'active' : '']">
                <SvgIcon icon="ri:wechat-line" class="text-3xl  flex-1"></SvgIcon>
              </div>
            </template>
            对话
          </n-tooltip>
        </a>

        <a @click="urouter.push(`/store`)"
          class=" router-link-exact-active h-12 w-12 cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c] hover:bg-[#bbb] dark:hover:bg-[#555]">
          <n-tooltip placement="right" trigger="hover">
            <template #trigger>
              <div class="flex h-full justify-center items-center   py-1 flex-col">
                <SvgIcon icon="ri:apps-fill" class="text-3xl flex-1"></SvgIcon>
              </div>
            </template>
            应用中心
          </n-tooltip>
        </a>

        <a
          class=" router-link-exact-active h-12 w-12 cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c] hover:bg-[#bbb] dark:hover:bg-[#555]">
          <n-tooltip placement="right" trigger="hover">
            <template #trigger>
              <div class="flex h-full justify-center items-center   py-1 flex-col">
                <SvgIcon icon="weui:shop-filled" class="text-3xl flex-1"></SvgIcon>
              </div>
            </template>
            插件市场
          </n-tooltip>
        </a>
      </div>

      <div class="flex flex-col  space-y-2 ">
        <!-- <NAvatar  v-show="isLogin"  size="large"  round  :src="userInfo.avatar"   v-if="userInfo.avatar"  :fallback-src="defaultAvatar"
         class=" cursor-pointer"  /> -->

        <n-popover trigger="click" :show-arrow="false">
          <template #trigger>
            <n-avatar v-show="isLogin" size="large" round :src="userInfo.avatar" />
          </template>
          <n-menu :options="menuOptions" @select="handleSelect" />
        </n-popover>

        <div v-show="!isLogin" class="user-bottom" @click="longin">
          <n-button tertiary type="info">
            登录
          </n-button>
        </div>

      </div>

      
    </div>
    
  </div>
  <Setting v-if="st.show" v-model:visible="st.show" />
  <PromptStore v-model:visible="show"></PromptStore>
  
</template>
