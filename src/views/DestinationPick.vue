<template>
    <v-container>
        <v-row class="title d-flex justify-center">
            어디로 여행을 떠나시나요?
        </v-row>
        <v-spacer :style="{ height: '50px' }"></v-spacer>
        <v-row class="d-flex justify-center">
            <v-col cols="2">

            </v-col>
            <v-col cols="7">
                <v-text-field v-model="search" label="국가명이나 도시명으로 검색해보세요" prepend-inner-icon="mdi-magnify"
                    variant="solo" type="text" clearable class="mt-n1"></v-text-field>
            </v-col>
            <v-col cols="2">

            </v-col>
        </v-row>
        <v-row >
            <v-col v-for="destination in destonationList" :key="destination.id" @click="this.$router.push('/plans/'+destination.name)">
                <v-avatar class="ma-5" style="height:220px; width:220px; border-radius: 10px; object-fit:cover;">
                    <!-- 목적지 사진 -->
                    <v-img
                        :src="destination.image ? destination.image : 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/no-image.png'" />
                </v-avatar>
                <div class="destination-name">{{destination.name}}</div>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
export default {
    data() {
        return {
            destonationList: [
                {
                    id: 1,
                    image: "https://travel1030.s3.ap-southeast-2.amazonaws.com/4.png",
                    name: "제주"
                },
                {
                    id: 2,
                    image: "https://travel1030.s3.ap-southeast-2.amazonaws.com/3%5C.png",
                    name: "뉴욕"
                },
                {
                    id: 3,
                    image: "https://travel1030.s3.ap-southeast-2.amazonaws.com/paris.png",
                    name: "파리"
                },
                {
                    id: 4,
                    image: "https://travel1030.s3.ap-southeast-2.amazonaws.com/seoul.png",
                    name: "서울"
                },
                {
                    id: 5,
                    image: "https://travel1030.s3.ap-southeast-2.amazonaws.com/4.png",
                    name: "오사카"
                },
            ]
        }
    }
}
</script>
<style scoped>
.title {
    font-size: 28px;
    font-weight: 800;
}

.destination-name{
    font-size: 20px;
    font-weight: 600;
}
</style>