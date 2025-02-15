<template>
  <div class="container h-full w-full">
    <div class="grid grid-cols-4 gap-4">
      <Card class="mb-6">
        <template #title>Jumlah Barang</template>
        <template #content>
            <h1 class="text-xl mt-3">{{ dashboard.jumlah_barang }}</h1>
        </template>
      </Card>
      <Card class="mb-6">
        <template #title>Jumlah Kassa</template>
        <template #content>
            <h1 class="text-xl mt-3">{{ dashboard.jumlah_kassa }}</h1>
        </template>
      </Card>
      <Card class="mb-6">
        <template #title>
          <div class="flex justify-between">
            Transaksi Hari Ini
            <div class="text-end">
              <Tag :severity="`${dashboard.persentase_transaksi <= 0 ? 'danger' : 'success'}`" >
                <i class="pi pi-arrow-down-right" v-if="dashboard.persentase_transaksi <= 0"></i> 
                <i class="pi pi-arrow-up-right" v-else></i> 
                {{ getFixPecent(dashboard.persentase_transaksi) }}%
              </Tag>
            </div>
          </div>
        </template>
        <template #content>
            <h1 class="text-xl mt-3">{{ dashboard.jumlah_transaksi_hari_ini }}</h1>
        </template>
      </Card>
      <Card class="mb-6">
        <template #title>
          <div class="flex justify-between">
            Penjualan Hari Ini 
            <div class="text-end">
              <Tag :severity="`${dashboard.persentase_penjualan <= 0 ? 'danger' : 'success'}`">
                <i class="pi pi-arrow-down-right" v-if="dashboard.persentase_penjualan <= 0"></i> 
                <i class="pi pi-arrow-up-right" v-else></i> 
                {{ getFixPecent(dashboard.persentase_penjualan) }}%
              </Tag>
            </div>
          </div>
        </template>
        <template #content>
            <h1 class="text-xl mt-3">{{ formatNumber(dashboard.jumlah_penjualan_hari_ini) }}</h1>
        </template>
      </Card>
    </div>
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-7">
        <Card>
          <template #title>Grafik Penjualan Hari Ini</template>
          <template #content>
            <div class="flex gap-2 ms-24">
              <Button size="small" severity="secondary" @click="setZoom('1M')">1M</Button>
              <Button size="small" severity="secondary" @click="setZoom('6M')">6M</Button>
              <Button size="small" severity="secondary" @click="setZoom('1Y')">1Y</Button>
              <Button size="small" severity="secondary" @click="setZoom('YTD')">YTD</Button>
              <Button size="small" severity="secondary" @click="setZoom('ALL')">ALL</Button>
            </div>
            <apexchart ref="chart" :height="chartPenjualanOptions.height" :type="chartPenjualanOptions.type" :options="chartPenjualanOptions" :series="chartPenjualanOptions.series"></apexchart>
          </template>
        </Card>
      </div>
      <div class="col-span-5">
        <Card>
          <template #title>Barang Terlaris Hari Ini</template>
          <template #content>
            <DataTable :value="barang_terlaris_bulan_ini">
              <Column field="kode_barang" header="Kode Barang"></Column>
              <Column field="nama_barang" header="Nama Barang"></Column>
              <Column field="jumlah_barang" header="Jumlah Barang"></Column>
            </DataTable>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>
<script>
import Card from 'primevue/card';
import axios from 'axios';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional
import Tag from 'primevue/tag';


export default {
  components: {
    Card, Button, DataTable, Column, ColumnGroup, Row, Tag
  },
  data(){
    return {
      dashboard: {},
      all_series: [],
      chartPenjualanOptions: {
        chart: {
          height: 380,
          width: "100%",
          type: "area",
          animations: {
            initialAnimation: {
              enabled: false
            }
          },
          stroke: {
            curve: 'smooth',
          },
          zoom: {
            autoScaleYaxis: true
          }
        },
        dataLabels: {
          enabled: false
        },
        series: [
          {
            data: [
              {
                x: "02-10-2017 GMT",
                y: 34
              },
              {
                x: "02-11-2017 GMT",
                y: 43
              },
              {
                x: "02-12-2017 GMT",
                y: 31
              },
              {
                x: "02-13-2017 GMT",
                y: 43
              },
              {
                x: "02-14-2017 GMT",
                y: 33
              },
              {
                x: "02-15-2017 GMT",
                y: 52
              }
            ]
          }
        ],
        xaxis: {
          type: "datetime",
          labels: {
            formatter: (value) => new Intl.DateTimeFormat('en-US', {year: '2-digit', month: 'short', day: 'numeric'}).format(new Date(value))
          }
        },
        yaxis: {
          labels: {
            formatter: (value) => this.formatNumber(value)
          }
        }
      },
      barang_terlaris_bulan_ini: []
    }
  },
  mounted() {
    this.$store.dispatch('setBreadcrumbs', [
      {label: 'Admin', route: '/admin'},
      {label: 'Dashboard', route: '/admin'},
    ]);
  },
  created(){
    this.fetchDashboard();
  },
  methods:{
    fetchDashboard(){
      axios.get('http://localhost:5000/api/dashboard')
      .then(res => res.data)
      .then(res => {
        this.dashboard = res.data;
        this.all_series = res.data.series.map(item => ({
          x: new Date(item.x),
          y: item.y
        }));
        this.chartPenjualanOptions.series[0].data = this.all_series;
        this.barang_terlaris_bulan_ini = res.data.barang_terlaris_bulan_ini;
        this.setZoom('1M');
      }).catch(err => this.alert(err));
    },
    formatNumber(number){
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number).replace(',00', '');
    },
    setZoom(range){
      if(!this.$refs.chart){
        return
      }

      let max = new Date().getTime(); // Waktu sekarang
      let min;
      let new_series = [];

      switch (range) {
        case "1M":
          min = new Date();
          min.setDate(1);
          new_series = this.all_series.filter((d) => new Date(d.x).getMonth() >= min.getMonth() && new Date(d.x).getFullYear() >= min.getFullYear());
          break;
        case "6M":
          min = new Date();
          min.setMonth(min.getMonth() - 6);
          new_series = this.all_series.filter((d) => new Date(d.x).getTime() >= min.getTime());
          break;
        case "1Y":
          min = new Date();
          min.setFullYear(min.getFullYear() - 1);
          new_series = this.all_series.filter((d) => new Date(d.x).getFullYear() >= min.getFullYear());
          break;
        case "YTD":
          min = new Date(new Date().getFullYear(), 0, 1); // Awal tahun
          new_series = this.all_series.filter((d) => new Date(d.x).getTime() >= min.getTime());
          break;
        case "ALL":
          new_series = this.all_series;
          break;
      }

      this.chartPenjualanOptions.xaxis.min = min;
      this.chartPenjualanOptions.xaxis.max = max;
      this.chartPenjualanOptions.series[0].data = new_series;
    },
    getFixPecent(value){
      return Math.abs(value).toFixed(1);
    }
  }
}
</script>