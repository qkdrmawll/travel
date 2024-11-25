<template>
  <v-app-bar app style="background-color: #fff;">
    <v-container fluid class="custom-container">
      <v-row align="center">
        <v-col cols="2" class="justify-start text-no-wrap">
          <v-toolbar-title>
            <router-link to="/" class="logo">
              TRAVELER
            </router-link>
          </v-toolbar-title>
        </v-col>

        <v-col class="d-flex flex-row justify-center text-no-wrap" cols="5">


        </v-col>
        <v-col class="d-flex flex-row justify-center text-no-wrap" cols="2">
          <!-- 왼쪽 정렬 -->
          <v-btn class="custom-button" @click="$router.push('/destination')"> 
            여행지
          </v-btn>

        </v-col>

        <v-col cols="3" class="d-flex align-end justify-start text-no-wrap">
          <!-- 오른쪽 정렬 -->
          <v-menu v-if="isLogin" open-on-hover>
            <template v-slot:activator="{ props }">
              <v-btn text v-bind="props" height="60">
                <v-avatar size="40">
                  <v-img :src="profileImgUrl" alt="profileImgUrl"></v-img>
                </v-avatar>
                <span class="ml-2" style="font-size: 17px;">{{ name }}</span>
              </v-btn>
            </template>
            <v-list>
              <v-list-item :to="{ path: '/mypage'}">
                <v-list-item-title>마이 페이지</v-list-item-title>
              </v-list-item>
              <v-list-item @click="logout">
                <v-list-item-title>로그아웃</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn v-if="!isLogin" @click="kakaoLogin" class="mb-2">
            로그인
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      isLogin: false, // 로그인 상태 확인 변수
      name: "김용이",
      profileImgUrl: 'https://travel1030.s3.ap-southeast-2.amazonaws.com/paris.png',
      memberId: '',
      role: '',
      email: '',
      notifications: [], // 알림 목록 추가
    };
  },
  created() {
    this.memberId = localStorage.getItem("memberId");
    this.email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    if (token) {
      this.isLogin = true;
      this.loadUserProfile();
      this.fetchNotifications(); // 알림 데이터 불러오기
    }
  },
  methods: {
    async loadUserProfile() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/id/${this.memberId}`);
        this.name = response.data.result.name;
        this.role = response.data.result.role;
        this.profileImgUrl = response.data.result.profileImgUrl || 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/default_user_image.png';
      } catch (error) {
        console.error("사용자 프로필 loading error : ", error);
      }
    },
    async fetchNotifications() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/fcm/list`);
        this.notifications = response.data.result.content;
      } catch (error) {
        console.error("알림 데이터를 불러오는 중 오류 발생:", error);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    handleNotificationClick(notification) {
      // 알림 클릭 시 처리 로직
      window.location.href = notification.url || '/';
    },
    kakaoLogin() {
      window.location.href = '/login';
    },
    logout() {
      console.log("Logout function called"); // 호출 여부 확인
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('profileImgUrl');
      localStorage.removeItem('name');
      console.log(localStorage); // 삭제 후 확인
      this.isLogin = false;
      window.location.href = "/";
    }
  }
};
</script>

<style scoped>
.logo {
  font-weight: bold;
  color: inherit;
  text-decoration: none;
}

.logo-image {
  width: 150px;
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

.custom-button {
  font-weight: bold !important;
  font-size: 18px !important;
  text-transform: none !important;
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}
</style>
