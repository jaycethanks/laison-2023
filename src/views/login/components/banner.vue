<template>
  <div class="banner">
    <div class="banner-inner">
      <a-carousel autoplay class="carousel" effect="fade">
        <div v-for="item in carouselItem" :key="item.slogan">
          <div :key="item.slogan" class="carousel-item">
            <div class="carousel-title">
              {{ item.slogan }}
            </div>
            <div class="carousel-sub-title">
              {{ item.subSlogan }}
            </div>
            <!-- <img class="carousel-image" :src="item.image" /> -->
            <p
              class="carousel-image"
              style="text-align: center; font-size: 128px"
            >
              {{ item.image }}
            </p>
          </div>
        </div>
      </a-carousel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const carouselItem = computed(() => [
  {
    slogan: t('login.banner.slogan1'),
    subSlogan: t('login.banner.subSlogan1'),
    image: '🐒️',
    // image: bannerImage,
  },
  {
    slogan: t('login.banner.slogan2'),
    subSlogan: t('login.banner.subSlogan2'),
    image: '🥳️',
  },
  {
    slogan: t('login.banner.slogan3'),
    subSlogan: t('login.banner.subSlogan3'),
    image: '🎉️',
  },
]);
</script>

<style lang="less" scoped>
  .banner {
    &-inner {
      padding: 6rem;
      height: 100%;
    }
  }

  .carousel {
    height: 100%;

    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    &-title {
      color: var(--color-fill-1);
      font-weight: 500;
      font-size: 20px;
      height: 4em;
      line-height: 28px;
    }

    &-sub-title {
      margin-top: 8px;
      color: var(--color-text-3);
      font-size: 14px;
      height: 4em;
      line-height: 22px;
    }

    &-image {
      width: 320px;
      // margin-top: 30px;
      margin-bottom: 100px;
    }
  }
</style>
