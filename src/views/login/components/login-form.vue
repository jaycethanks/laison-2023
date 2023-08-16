<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">
      {{ $t('login.form.title') }}
    </div>
    <div class="login-form-sub-title">
      {{ $t('login.form.title') }}
    </div>
    <div class="login-form-error-msg">
      {{ errorMessage }}
    </div>
    <a-form
      :model="userInfo"
      class="login-form"
      layout="vertical"
      @finish="onFinished"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="Username"
        name="username"
        :rules="[{ required: true, message: $t('login.form.userName.errMsg') }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input
          v-model:value="userInfo.username"
          :placeholder="$t('login.form.userName.placeholder')"
        >
          <template #prefix>
            <UserOutlined />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        label="Password"
        name="password"
        :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input-password
          v-model:value="userInfo.password"
          :placeholder="$t('login.form.password.placeholder')"
          allow-clear
        >
          <template #prefix>
            <LockOutlined />
          </template>
        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions">
          <a-checkbox
            :checked="loginConfig.rememberPassword"
            @change="setRememberPassword as any"
          >
            {{ $t('login.form.rememberPassword') }}
          </a-checkbox>
          <!-- <a>{{ $t('login.form.forgetPassword') }}</a> -->
        </div>
        <a-button
          type="primary"
          html-type="submit"
          long
          :loading="loading"
        >
          {{ $t('login.form.login') }}
        </a-button>
        <!-- <a-button type="text" long class="login-form-register-btn">
          {{ $t('login.form.register') }}
        </a-button> -->
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message as Message } from 'ant-design-vue';
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue';

// import { ValidatedError } from "ant-design-vue"
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import type { CheckboxChangeEvent } from 'ant-design-vue/es/_util/EventInterface';
import { useUserStore } from '@/store';
import useLoading from '@/hooks/loading';
import type { LoginData } from '@/api/user';

const router = useRouter();
const { t } = useI18n();
const errorMessage = ref('');
const { loading, setLoading } = useLoading();
const userStore = useUserStore();

const loginConfig = useStorage('login-config', {
  rememberPassword: true,
  username: 'admin', // 演示默认值
  password: 'admin', // demo default value
});

const { rememberPassword } = loginConfig.value;

const userInfo = reactive({
  username: rememberPassword ? loginConfig.value.username : undefined,
  password: rememberPassword ? loginConfig.value.password : undefined,
});

const onFinished = async (values: any) => {
  if (loading.value) return;
  const errors = false;
  if (!errors) {
    setLoading(true);
    try {
      await userStore.login(values as LoginData);
      const { redirect, ...othersQuery } = router.currentRoute.value.query;
      router.push({
        name: (redirect as string) || 'Workplace',
        query: {
          ...othersQuery,
        },
      });
      Message.success(t('login.form.login.success'));
      const { rememberPassword } = loginConfig.value;
      const { username, password } = values;
      // 实际生产环境需要进行加密存储。
      // The actual production environment requires encrypted storage.
      loginConfig.value.username = rememberPassword ? username : '';
      loginConfig.value.password = rememberPassword ? password : '';
    }
    catch (err) {
      errorMessage.value = (err as Error).message;
    }
    finally {
      setLoading(false);
    }
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
const setRememberPassword = (e: CheckboxChangeEvent) => {
  const { checked } = e.target;
  if (typeof checked !== 'undefined') {
    loginConfig.value.rememberPassword = checked;
  }
};
</script>

<style lang="less" scoped>
  .login-form {
    &-wrapper {
      width: 320px;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }
  }
</style>
