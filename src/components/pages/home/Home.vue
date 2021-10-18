<template>
  <section>
    <header class="docs-header" style="margin-top: 20px; margin-bottom: 20px">
      <div class="columns">
        <div class="column">
          <h2 class="title">Halaman {{ $route.meta.linkText }}</h2>
        </div>
        <div class="column">
          <nav style="float: right" aria-label="breadcrumbs" class="breadcrumb">
            <ul>
              <li v-for="(route, index) in $route.matched" :key="index">
                <router-link class="active" :to="{ name: route.name }">
                  {{ route.meta.linkText }}
                </router-link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
    <div class="columns">
      <div class="column">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <p>Jumlah User</p>

              <b-skeleton v-if="loading === true" height="60"></b-skeleton>
              <h2 v-else>{{ data.jumlahUser }}</h2>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <p>Aktif User</p>
              <b-skeleton v-if="loading === true" height="60"></b-skeleton>
              <h2 v-else>{{ data.aktif }}</h2>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <p>Non Aktif User</p>
              <b-skeleton v-if="loading === true" height="60"></b-skeleton>
              <h2 v-else>{{ data.nonAktif }}</h2>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <p>Jumlah Role</p>
              <b-skeleton v-if="loading === true" height="60"></b-skeleton>
              <h2 v-else>{{ data.role }}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="columns is-centered">
      <div class="column is-half">
        <div class="card">
          <div class="card-content">
            <apexcharts
              height="400"
              type="bar"
              :options="datacollection.options"
              :series="datacollection.datasets"
            ></apexcharts>
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="card">
          <div class="card-content">
            <apexcharts
              height="400"
              type="line"
              :options="datacollection.options"
              :series="datacollection.datasets"
            ></apexcharts>
          </div>
        </div>
      </div>
    </div> -->
  </section>
</template>

<script>
// import VueApexCharts from "vue-apexcharts";
// import io from "socket.io-client";
// var socket = io.connect("http://localhost:3000");
export default {
  components: {
    // apexcharts: VueApexCharts,
  },
  data() {
    return {
      data: {
        aktif: 0,
        nonAktif: 0,
        jumlahUser: 0,
        role: 0,
      },
      datacollection: [],
      loading: false,
    };
  },
  created() {
    // this.getRealtimeData();
    this.getDataUser();
  },
  methods: {
    fillData(fetchedData) {
      this.datacollection = {
        options: {
          chart: {
            id: "vuechart-example",
          },
          xaxis: {
            categories: ["Minggu 1", "Minggu 2"],
          },
        },
        datasets: [
          {
            name: "Google Stock",
            data: [
              this.getRandomChartValues(fetchedData),
              this.getRandomChartValues(fetchedData),
            ],
          },
          {
            name: "Microsoft Stock",
            data: [
              this.getRandomChartValues(fetchedData),
              this.getRandomChartValues(fetchedData),
            ],
          },
        ],
      };
    },
    // getRealtimeData() {
    //   socket.on("newdata", (fetchedData) => {
    //     this.fillData(fetchedData);
    //     // console.log(fetchedData);
    //   });

    //   socket.on("dashboardUser", (fetchedData) => {
    //     console.log(fetchedData);
    //   });
    // },
    getDataUser() {
      this.loading = true;

      this.$http
        .get("dashboard/dashboardHome")
        .then(({ data }) => {
          console.log(data.data[0].aktif);
          this.data.aktif = data.data[0].aktif;
          this.data.nonAktif = data.data[0].nonAktif;
          this.data.jumlahUser = data.data[0].jumlahUser;
          this.data.role = data.data[0].role;

          this.loading = false;
        })
        .catch((error) => {
          this.data = [];
          this.loading = false;
          throw error;
        });
    },
    getRandomChartValues(number) {
      return Math.floor(Math.random() * number);
    },
  },
};
</script>
