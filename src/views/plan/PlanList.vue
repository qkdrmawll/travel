<template>
    <v-container>
        <v-row align="start">
            <v-col cols="10" class="title">
                {{ destination }} 을 다녀온 시람들의 여행 계획 ✈️
            </v-col>
            <v-col cols="2">
                <div class="plan-button" @click="planCreateModal=true">
                    내 일정 만들기
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col v-for="(plan, index) in planList" :key="index" cols="6">
                <v-card variant="none">
                    <v-card-title>{{ plan.title }}</v-card-title>
                    <v-card-text>
                        <p>{{ plan.contents }}</p>
                        <p>여행 기간: {{ plan.startDate }} ~ {{ plan.endDate }}</p>
                        <p>방문 장소: {{ formatPlaceList(plan.placeList) }}</p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- 여행 생성 모달 -->
        <PlanCreateModalVue v-model="planCreateModal" @update:dialog="planCreateModal = $event;" @create-plan="addPlan">
        </PlanCreateModalVue>
    </v-container>
</template>
<script>
import { useRoute } from 'vue-router';
import PlanCreateModalVue from '@/components/PlanCreateModal.vue'
export default {
    components: {
        PlanCreateModalVue
    },
    data() {
        return {
            planCreateModal: false,
            destination: "",
            planList: [
                {
                    id: 1,
                    title: "미국미국",
                    contents: "진짜 최고였음",
                    startDate: "2024-11-11",
                    endDate: "2024-11-29",
                    placeList: [
                        { name: "성산일출봉" },
                        { name: "협재 해변" },
                        { name: "협재 해변" },
                    ]
                },
                {
                    id: 1,
                    title: "제주제주",
                    contents: "진짜 최고였음",
                    startDate: "2024-11-11",
                    endDate: "2024-11-29",
                    placeList: [
                        { name: "성산일출봉" },
                        { name: "협재 해변" },
                        { name: "협재 해변" },
                    ]
                },
                {
                    id: 1,
                    title: "일본일본",
                    contents: "진짜 최고였음",
                    startDate: "2024-11-11",
                    endDate: "2024-11-29",
                    placeList: [
                        { name: "성산일출봉" },
                        { name: "협재 해변" },
                        { name: "협재 해변" },
                    ]
                }
            ]
        }
    },
    created() {
        const route = useRoute();
        this.destination = route.params.destination;
        console.log(this.destination);
    },
    methods: {
        formatPlaceList(placeList) {
            const names = placeList.map(place => place.name); // Extract names
            if (names.length > 2) {
                // If more than two names, add "etc."
                return `${names.slice(0, 2).join(", ")} 등`;
            }
            return names.join(", ");
        }
    }

}
</script>
<style scoped>
.title {
    font-size: 28px;
    font-weight: 600;
}

.plan-button {
    font-size: 16px;
    font-weight: 500;
    background-color: #62c2ee;
    padding: 5px 5px;
    border-radius: 10px;
    color: white;
    cursor: pointer;
}
</style>