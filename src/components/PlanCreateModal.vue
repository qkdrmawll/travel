<template>
    <v-dialog v-model="dialog" width="700px">
        <v-card>
            <v-spacer :style="{ height: '10px' }"></v-spacer>
            <v-card-text>
                <div class="title">여행 기간이 어떻게 되시나요?</div>
                <v-row style="width: 600px; margin: 0 auto;">
                    <v-col>
                        <v-text-field v-model="startDate" type="date" variant="none" label="시작 날짜"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field v-model="endDate" type="date" variant="none" label="종료 날짜"></v-text-field>
                    </v-col>
                </v-row>
                <v-row style="width: 600px; margin: 0 auto;">
                    <v-col>
                        <v-text-field v-model="title" label="여행 주제" variant="outlined" >

                        </v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <div class="black-button" @click="createPlan">
                        일정 생성하기
                    </div>
                </v-row>
            </v-card-text>
            <v-spacer :style="{ height: '10px' }"></v-spacer>
        </v-card>
    </v-dialog>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            startDate: null,
            endDate: null,
            title: ""
        }
    },
    methods: {
        async createPlan() {
            const newPlan = {
                startDate: this.startDate,
                endDate: this.endDate,
                title: this.title,
                destinationName: "서울"
            };
            const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/plan`, newPlan);
            console.log(response);
            this.$emit('create-plan', newPlan)
            this.$emit('update:dialog', false);
            this.$router.push('/plan/'+response.data.result.planId);
        }
    }
}
</script>
<style scoped>
.title{
    font-size: 30px;
    font-weight: 500;
    text-align: center;
}
.black-button {
    background-color: black;
    color: white;
    padding : 8px 10px;
    cursor: pointer;
    margin: 0 auto;
}
</style>