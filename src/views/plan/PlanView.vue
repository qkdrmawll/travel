<template>
    <v-container>
        <!-- Sidebar -->
        <v-navigation-drawer app permanent style="width: 200px">
            <v-list dense>
                <v-list-item @click="selectDay('전체 일정')" :class="{ 'selected-day': selectedDay === '전체 일정' }">
                    <v-list-item-content>
                        <v-list-item-title>전체 일정</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item v-for="(day, index) in days" :key="index" @click="selectDay(day)"
                    :class="{ 'selected-day': selectedDay === day.value }">
                    <v-list-item-content>
                        <v-list-item-title>{{ day.label }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <div v-if="selectedDay !== '전체 일정'" class="edit-button" @click="edit">
                <span v-if="isEditing">편집 종료</span>
                <span v-else>편집</span>
            </div>
        </v-navigation-drawer>


        <!-- Main Content -->
        <v-main>
            <v-contianer class="plan" fluid>
                <!-- 여행 주제 및 날짜 -->
                <v-row class="title">
                    {{ plan.title }}
                </v-row>
                <v-row>
                    <v-col cols="auto" class="date mt-1">
                        {{ plan.startDate }} - {{ plan.endDate }}
                    </v-col>
                    <v-col cols="auto">
                        <div class="date-button" @click="dateEdit">일자변경</div>
                    </v-col>
                </v-row>

                <!-- 읽기 모드 -->
                <!-- 날짜별 여행일정 -->
                <v-row v-if="!isEditing && selectedDay !== '전체 일정'">
                    <v-col cols="12" style="text-align: start;">
                        <h2>{{ selectedDay.label }}</h2>
                    </v-col>

                    <v-col cols="2" v-for="location in getLocationsForSelectDay(selectedDay.value)" :key="location.id">
                        <div class="order">{{ location.scheduleOrder }}</div>
                        <div class="location-name mt-1">{{ location.locationName }}</div>
                        <div class="location-category">{{ location.category }}</div>
                    </v-col>
                </v-row>

                <!-- 편집 모드 -->
                <v-row v-if="isEditing && selectedDay !== '전체 일정'">
                    <v-col cols="12" style="text-align: start;">
                        <h2>{{ selectedDay.label }} - 편집 모드</h2>
                    </v-col>
                    <v-col cols="12">
                        <!-- 편집용 컴포넌트 -->
                        <EditSchedule :day="selectedDay.value" :planId="planId" @save="handleSave" />
                    </v-col>
                </v-row>

                <!-- 전체 여행 일정 -->
                <div v-if="selectedDay == '전체 일정'">
                    <v-row v-for="(day, index) in days" :key="index">
                        <v-col cols="12" style="text-align: start;">
                            <h2>{{ day.label }}</h2>
                        </v-col>
    
                        <v-col cols="2" v-for="location in getLocationsForDay(day.value)" :key="location.id">
                            <div class="order">{{ location.scheduleOrder }}</div>
                            <div class="location-name mt-1">{{ location.locationName }}</div>
                            <div class="location-category">{{ location.category }}</div>
                        </v-col>
                    </v-row>
                </div>

            </v-contianer>
        </v-main>

    </v-container>
</template>
<script>
import { useRoute } from 'vue-router';
import EditSchedule from '@/components/EditSchedule.vue';
import axios from 'axios';

export default {
    props: [],
    components: {
        EditSchedule
    },
    data() {
        return {
            planCreateModal: true,
            planId: null,
            plan: {
                id: 1,
                title: "나 정말 떠나고 싶어",
                destination: "코타키나발루",
                startDate: "2024-12-16",
                endDate: "2024-12-19",
            },
            locationList: [],
            days: [],
            selectedDay: '전체 일정',
            isEditing: false,
        }
    },
    created() {
        const route = useRoute();
        this.planId = route.params.planId;
        this.loadPlan();
        this.loadLocationList();
    },
    watch: {
        plan: {
            handler() {
                this.generateDays();
            },
            immediate: true, // Trigger on initial load
            deep: true,
        },
    },
    methods: {
        async loadPlan() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/plan/${this.planId}`);
                this.plan = response.data.result;
            } catch (e) {
                alert("계획을 불러오는데 실패하였습니다." + e);
            }
        },
        async loadLocationList() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/location/${this.planId}`);
                this.locationList = response.data.result;
                console.log(this.locationList);
            } catch (e) {
                alert("계획을 불러오는데 실패하였습니다." + e);
            }
        },
        selectDay(day) {
            this.selectedDay = day;
            console.log(`Selected: ${day}`);
        },
        addPlan(newPlan) {
            this.plan = newPlan;
        },
        generateDays() {
            const startDate = new Date(this.plan.startDate);
            const endDate = new Date(this.plan.endDate);

            const days = [];
            let currentDate = new Date(startDate);

            let dayIndex = 1;
            while (currentDate <= endDate) {
                days.push({
                    label: `${dayIndex}일차`, // Display label
                    value: currentDate.toISOString().split("T")[0], // Actual date in yyyy-MM-dd
                });
                currentDate.setDate(currentDate.getDate() + 1); // Increment day
                dayIndex++;
            }

            this.days = days;
        },
        getLocationsForDay(date) {
            console.log("date" + date);
            if (this.locationList) {
                return this.locationList.filter(
                    (location) => location.day === date
                );
            }
        },
        getLocationsForSelectDay(date) {
            console.log("날짜요 ", date);
            console.log("로케 ", this.locationList);
            if (this.locationList) {
                return this.locationList.filter(
                    (location) => location.day === date
                );
            }
        },
        dateEdit() {
            alert('해당 기능은 아직 준비중입니다.');
        },
        edit() {
            this.isEditing = !this.isEditing;
        }
    }
}
</script>
<style scoped>
.title {
    font-size: 28px;
    font-weight: 600;
}

.date {
    color: #8B959F;
    font-size: 17px;
}

.date-button {
    color: #156BF0;
    border: 1px solid #156BF0;
    border-radius: 40px;
    padding: 5px 10px;
    cursor: pointer;
}

.date-button:hover {
    background-color: #156BF0;
    color: #fff;
    border: 1px solid #156BF0;
    border-radius: 40px;
    padding: 5px 10px;
    cursor: pointer;
}

.selected-day {
    background-color: #f0f0f0;
    font-weight: bold;
}

.order {
    background-color: #E54A4B;
    border-radius: 40px;
    color: white;
    font-size: 17px;
    font-weight: 500;
    margin: 0 auto;
    width: 30px;
    height: 30px;
    padding: 3px 3px;
}

.v-main {
    padding-left: 30px;
}

.location-name {
    font-size: 20px;
    font-weight: 600;
}

.location-category {
    color: #8B959F;
}

.edit-button {
    border: 1px solid #156BF0;
    border-radius: 5px;
    width: 150px;
    padding: 5px 10px;
    margin: 0 auto;
    cursor: pointer;
}

.edit-button:hover {
    background-color: #156BF0;
    color: #fff;
    border: 1px solid #156BF0;
    border-radius: 5px;
    width: 150px;
    padding: 5px 10px;
    margin: 0 auto;
    cursor: pointer;
}
.apply-button{
    border: 1px solid;
    border-radius: 5px;
    width: 150px;
    padding: 5px 10px;
    margin: 0 auto;
    cursor: pointer;
}
.apply-button:hover {
    background-color: #000000;
    color: #fff;
    border: 1px solid #000000;
    border-radius: 5px;
    width: 150px;
    padding: 5px 10px;
    margin: 0 auto;
    cursor: pointer;
}
</style>