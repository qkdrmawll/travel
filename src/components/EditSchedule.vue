<template>
    <v-row>
        <v-col cols="4">
            <div class="add-location" @click="locationModal = true">장소 추가</div>
            <v-text-field variant="solo" v-model="searchInput" class="search-input" label="상호명 또는 주소를 입력하세요"
                @keyup.enter="searchPlace">

            </v-text-field>
            <div id="map" style="width:100%; aspect-ratio: 3 / 2; margin: 0 auto;"></div>
            <ul id="placesList">
                <li v-for="(place, index) in places" :key="index" class="item" @click="selectLocation(place)">
                    <span class="markerbg" :class="'marker_' + (index + 1)"></span>
                    <div class="info">
                        <h5>{{ place.place_name }}</h5>
                        <span v-if="place.road_address_name">{{ place.road_address_name }}</span>
                        <span v-else>{{ place.address_name }}</span>
                    </div>
                </li>
            </ul>
            <select name="category" id="category" v-model="category" class="category">
                <option value="카페">카페</option>
                <option value="식당">식당</option>
                <option value="관광명소">관광명소</option>
            </select>
            <!-- 이미지 업로드 추가 -->
            <input type="file" @change="handleFileUpload" accept="image/*" />
            <div class="add-location-button" @click="addLocation">추가</div>
        </v-col>
        <v-col>
            <v-row>
                <v-col cols="2" v-for="location in locations" :key="location.locationId">
                    <div class="order">{{ location.scheduleOrder }}</div>
                    <div class="location-name mt-1">{{ location.locationName }}</div>
                    <div class="location-category">{{ location.category }}</div>
                </v-col>
            </v-row>
        </v-col>

    </v-row>


</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            locations: [],
            location: null,
            map: null,
            ps: null,
            pagination: [],
            currentPage: 1,
            places: [],
            markers: [],
            category: "카페",
            searchInput: "",
            file: null,
        }
    },
    watch: {
        day() {
            this.locations = [];
        }
    },
    mounted() {
        this.loadKakaoMapScript();
        this.loadLocations();
    },
    props: {
        day: {
            type: Date,
            required: true
        },
        planId: {
            type: Number,
            required: true
        }
    },
    methods: {
        saveChanges() {
            this.$emit("save", this.locations); // 부모에게 데이터 전달
        },
        selectLocation(location) {
            this.location = location;
            this.searchInput = location.place_name;
            console.log(location);
            this.places = [];
            const firstPosition = new window.kakao.maps.LatLng(location.y, location.x);
            this.kakaoMap.panTo(firstPosition); // 지도 중심 이동
        },
        loadKakaoMapScript() {
            const script = document.createElement('script');
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.VUE_APP_KAKAO_MAP_JS_APP_KEY}&autoload=false&libraries=services`;
            script.onload = () => {
                console.log("Kakao map script loaded successfully");
                this.initMap(); // 스크립트 로드 후 지도 초기화
            };
            script.onerror = () => {
                console.error("Failed to load Kakao map script");
            };
            document.head.appendChild(script);
        },
        initMap() {
            window.kakao.maps.load(() => {
                console.log("Kakao map API loaded");
                const container = document.getElementById('map');
                console.log("Map container:", container);

                const options = {
                    center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                    level: 3,
                };
                this.kakaoMap = new window.kakao.maps.Map(container, options);
                console.log("place", new window.kakao.maps.services.Places());
                if (window.kakao.maps.services) {
                    this.ps = new window.kakao.maps.services.Places();
                    console.log("Places service initialized successfully.");
                } else {
                    console.error("Places service is not available.");
                }
            });
        },
        searchPlace() {
            this.ps.keywordSearch(this.searchInput, this.placesSearchCB);
        },
        placesSearchCB(data, status, pagination) {
            if (status === window.kakao.maps.services.Status.OK) {
                this.places = data;
                this.displayMarkers();
                this.pagination = Array.from({ length: pagination.last }, (_, i) => i + 1);
            } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                alert("검색 결과가 존재하지 않습니다.");
            } else if (status === window.kakao.maps.services.Status.ERROR) {
                alert("검색 중 오류가 발생했습니다.");
            }
        },
        displayMarkers() {
            // 기존 마커를 제거 (필요 시 구현)
            if (this.markers) {
                this.markers.forEach(marker => marker.setMap(null));
            }
            this.markers = [];

            this.places.forEach((place) => {
                const marker = new window.kakao.maps.Marker({
                    map: this.kakaoMap,
                    position: new window.kakao.maps.LatLng(place.y, place.x),
                });

                this.markers.push(marker);
            });
            // 첫 번째 검색 결과로 지도 포커스 이동
            if (this.places.length > 0) {
                const firstPlace = this.places[0];
                const firstPosition = new window.kakao.maps.LatLng(firstPlace.y, firstPlace.x);
                this.kakaoMap.panTo(firstPosition); // 지도 중심 이동
            }
        },
        // 파일 업로드 처리
        handleFileUpload(event) {
            this.file = event.target.files[0];
        },
        async addLocation() {
            const formData = new FormData();
            const dto = {
                latitude: this.location.x,
                longitude: this.location.y,
                address: this.location.address_name,
                day: this.day, // 반드시 'YYYY-MM-DD' 형식으로 전달
                scheduleOrder: this.locations.length + 1,
                category: "관광명소",
                locationName: this.location.place_name,
                planId: this.planId,
            };

            formData.append('locationCreateReqDto', new Blob([JSON.stringify(dto)], { type: "application/json" })); // JSON 직렬화
            formData.append('file', this.file); // 파일 추가

            try {
                await axios.post(`${process.env.VUE_APP_API_BASE_URL}/location`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                this.location = null;
                this.searchInput = "";
                this.file = null;
                this.loadLocations();
            } catch (error) {
                console.error('위치등록 중 오류 발생:', error.response.data);
                alert('위치등록에 실패했습니다.');
            }
        },
        async loadLocations() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/location/${this.planId}/${this.day}`);
                this.locations = response.data.result;
                console.log(response);
            } catch (error) {
                console.error('위치등록 중 오류 발생:', error.response.data);
                alert('위치등록에 실패했습니다.');
            }
        }
    },
};
</script>
<style scoped>
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

.location-name {
    font-size: 20px;
    font-weight: 600;
}

.location-category {
    color: #8B959F;
}

.add-location {
    font-size: 20px;
    font-weight: 600;
    text-align: start;
}

.add-location-button {
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    margin: 10px auto;
    background-color: black;
    color: #fff;
    border-radius: 5px;
    width: 100px;
    padding: 5px 8px;
}

.search-input {
    margin: 10px auto;
    width: 100%;
}

.category {
    margin-top: 10px;
    border: 1px solid #8f9091;
    border-radius: 5px;
    padding: 10px 10px;
    text-align: center;
    width: 100%;
}
</style>