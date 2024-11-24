<template>
    <v-container class="main-content" fluid>
        <v-spacer :style="{ height: '130px' }"></v-spacer>
        <v-row justify="center">
            <v-col cols="12" sm="6" md="8">
                <v-card class="login-card">
                    <v-card-title class="text-center">
                        <div style="font-size: 16px">
                            여행 스케줄러, 트래블러
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-form>
                            <!-- 이메일 필드 -->
                            <v-text-field label="아이디(이메일)" v-model="memberEmail" type="email" required
                                class="underline-input-field" variant="outlined" hide-details></v-text-field>
                            <br>
                            <!-- 비밀번호 필드 -->
                            <v-text-field label="비밀번호" v-model="password" type="password" required
                                class="underline-input-field" variant="outlined" hide-details></v-text-field>
                            <v-spacer :style="{ height: '40px' }"></v-spacer>
                            <!-- 로그인 버튼 -->
                            <v-row justify="center">
                                <v-btn @click="doLogin" class="login-btn">로그인</v-btn>
                            </v-row>
                            <!-- 회원가입 버튼 -->
                            <v-row justify="center" class="mt-5">
                                아직 회원이 아니세요?<div @click="signUp" class="sign-up">&nbsp;이메일 회원가입</div>
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import axios from 'axios';

export default {
    data() {
        return {
            memberEmail: "",
            password: "",
        }
    },
    methods: {
        signUp() {

        },
        async doLogin() {
            try {
                const loginData = {
                    email: this.memberEmail,
                    password: this.password,
                };
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/doLogin`, loginData);
                const token = response.data.result.token;
                localStorage.setItem('token', token);
                window.location.href = "/";
            } catch (e) {
                const error_message = e.response?.data?.status_message || "로그인에 실패했습니다.";
                console.error("Login request failed:", e);
                alert(error_message);
            }
        }
    }
}
</script>
<style scoped>
html {
    background-color: #f9f9f9;
}

.main-content {
    width: 100%;
    height: 100%;
    padding: 0px;
}

.v-container {
    background-color: #f9f9f9;
}

.login-card {
    width: 500px;
    margin: 0 auto;
    padding: 30px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 밑줄이 있는 텍스트 필드 */
.underline-input-field .v-input__control {
    border-bottom: 2px solid #00499e !important;
    box-shadow: none !important;
    background-color: white !important;
    margin-bottom: 10px;
}

.underline-input-field .v-input__control:hover {
    border-bottom-color: #003c8f !important;
}

.underline-input-field .v-input__control input {
    padding-left: 0 !important;
}

/* 체크박스 간격 좁히기 */
.checkbox-row {
    margin-top: -5px !important;
    /* 간격 좁힘 */
    margin-bottom: -5px !important;
    /* 간격 좁힘 */
}

.custom-checkbox {
    color: #00499e;
    font-size: 14px;
    margin-left: 30px;
}

/* 로그인 버튼 크기 조정 및 중앙 정렬 */
.login-btn {
    background-color: #c2d7ff !important;
    color: #00499e !important;
    border-radius: 5px !important;
    padding: 9px 40px !important;
    font-family: 'Inter' !important;
    font-weight: 700 !important;
    font-size: 16px !important;
    text-transform: none !important;
    width: 400px;
}

.link-text {
    color: #00499e;
    font-weight: 500;
    cursor: pointer;
    text-align: center;
}

.link-text:hover {
    text-decoration: underline;
}

.signup-title {
    font-size: 28px;
    font-weight: 700;
    color: #00499e;
    text-align: center;
    margin-bottom: 20px;
}

.signup-title-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
}

.custom-list {
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 8px;
}

.sign-up {
    color: #003c8f;
    font-weight: 500;
}
</style>