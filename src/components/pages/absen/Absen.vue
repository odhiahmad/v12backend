<template>
  <section>
    <div class="columns headerAtas">
      <div class="column is-8"></div>

      <div class="column">
        <b-field grouped message="What do you want to search?">
          <b-input
            placeholder="Search..."
            v-model="cariValue"
            expanded
          ></b-input>
          <p class="control">
            <b-button @click="loadAsyncData" label="Search" type="is-primary" />
          </p>
        </b-field>
      </div>
    </div>
    <b-table
      hoverable
      :data="data"
      :loading="loading"
      paginated
      backend-pagination
      :total="total"
      :per-page="perPage"
      @page-change="onPageChange"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
      backend-sorting
      :default-sort-direction="defaultSortOrder"
      :default-sort="[sortField, sortOrder]"
      @sort="onSort"
    >
      <b-table-column
        field="nomor"
        centered
        width="20"
        label="No"
        v-slot="props"
      >
        {{ props.index + 1 }}
      </b-table-column>
      <b-table-column field="name" label="Nama" v-slot="props">
        {{ props.row.pegawai.nama }}
      </b-table-column>

      <b-table-column label="Di Buat" v-slot="props">
        {{ props.row.createdAt | tanggalIndonesia }}
      </b-table-column>

      <b-table-column label="Action" v-slot="props">
        <b-button
          style="margin-right: 10px"
          :v-model="props.index"
          type="is-white is-light"
          size="is-small"
          @click="editView(props.index)"
          icon-left="note"
        >
          Lihat Absen
        </b-button>
      </b-table-column>
    </b-table>
  </section>
</template>
<script src="./absenComponent.js" />
<style>
.headerAtas {
  margin-top: 10px;
}
</style>
