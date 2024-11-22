<template>
    <v-container>
        <v-spacer :style="{ height: '50px' }"></v-spacer>
        <v-row>
            <v-col>
                <v-row class="info-ment">
                    기존에 경험하지 못한 새로운 여행 플래너
                </v-row>
                <v-spacer :style="{ height: '50px' }"></v-spacer>
                <v-row class="small-font">
                    고민만 하던 여행 계획을 트래블러로 스케줄링 해보세요
                </v-row>
                <v-row>
                    <div class="black-button mt-5" @click="this.$router.push('/destination')">
                        여행 계획하기
                    </div>
                </v-row>
            </v-col>

        </v-row>
    </v-container>
</template>
<script>
export default {
    
}
</script>
<style scoped>
.info-ment {
    font-size: 30px;
    font-weight: 800;
}
.small-font {
    color: #828282;
}
.black-button {
    background-color: black;
    color: white;
    padding : 8px 10px;
    cursor: pointer;
}
</style>