<template>
  <section>
    <header class="docs-header" style="margin-top: 20px">
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
    <div class="columns headerAtas">
      <div class="column is-8">
        <div
          style="float: left"
          v-for="(aksi, index) in aksiRoleUser"
          :key="index"
        >
          <b-button
            :disabled="!aktifButton"
            style="margin-right: 10px"
            type="is-success"
            size="is-small"
            v-show="aksi === 'create'"
            @click="tambahView"
            icon-left="plus"
          >
            Tambah Menu
          </b-button>
          <b-button
            style="margin-right: 10px"
            :disabled="aktifButton"
            type="is-success"
            size="is-small"
            @click="confirmAktifBanyak"
            icon-left="check"
            v-show="aksi === 'update'"
          >
            Aktifkan Menu
          </b-button>

          <b-button
            style="margin-right: 10px"
            :disabled="aktifButton"
            type="is-success"
            size="is-small"
            @click="confirmNonAktifBanyak"
            icon-left="check"
            v-show="aksi === 'update'"
          >
            Non Aktifkan Menu
          </b-button>
        </div>
      </div>
      <div class="column">
        <b-field grouped>
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
      :checked-rows.sync="checkedRows"
      :check="
        checkedRows.length > 0 ? (aktifButton = false) : (aktifButton = true)
      "
      checkable
      checkbox-position="left"
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
      <b-table-column field="nama" label="Nama Menu" sortable v-slot="props">
        {{ props.row.nama }}
      </b-table-column>
      <b-table-column
        field="keterangan"
        label="Keterangan"
        sortable
        v-slot="props"
      >
        <span class="tag">
          {{ props.row.keterangan }}
        </span>
      </b-table-column>

      <b-table-column
        field="icon"
        centered
        label="Icon"
        sortable
        v-slot="props"
      >
        <span class="tag">
          {{ props.row.icon }}
        </span>
      </b-table-column>
      <b-table-column
        field="statusMenu"
        centered
        label="Status"
        sortable
        v-slot="props"
      >
        <span class="tag">
          {{ props.row.statusMenu | statusMenu }}
        </span>
      </b-table-column>
      <b-table-column
        field="status"
        centered
        label="Aktif"
        sortable
        v-slot="props"
      >
        <span class="tag">
          {{ props.row.status | status }}
        </span>
      </b-table-column>
      <b-table-column field="createdAt" label="Di Buat" v-slot="props" sortable>
        {{ props.row.createdAt | tanggalIndonesia }}
      </b-table-column>
      <b-table-column width="300px" label="Action" v-slot="props">
        <nav
          style="float: left"
          v-for="(aksi, index) in aksiRoleUser"
          :key="index"
        >
          <b-button
            style="margin-right: 10px"
            :v-model="props.index"
            type="is-primary"
            size="is-small"
            v-show="aksi === 'update'"
            v-if="aksi === 'update'"
            @click.native="update(props.index)"
            icon-left="pencil"
          >
            {{ aksi | hurufBesar }}
          </b-button>
        </nav>
      </b-table-column>
      <template #detail="props">
        <article class="media">
          <!-- <figure class="media-left">
            <p class="image is-64x64">
              <img src="/static/img/placeholder-128x128.png" />
            </p>
          </figure> -->
          <div class="media-content">
            <div class="content">
              <p>
                <strong>{{ props.row.nama }} </strong>
                <!-- <small>@{{ props.row.user.first_name }}</small>
                <small>31m</small> -->
                <br />
                {{ dataRoleTag }}
              </p>
            </div>
          </div>
        </article>
      </template>
    </b-table>
    <b-modal v-model="isCardModalActive" :width="640" scroll="keep">
      <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
        <div class="card">
          <header class="card-header">
            <p v-show="editMode === false" class="card-header-title">
              Tambah Menu
            </p>
            <p v-show="editMode === true" class="card-header-title">
              Edit Menu {{ form.nama }}
            </p>
          </header>
          <div class="card-content">
            <div class="content">
              <BSelectValidations
                rules="required"
                label="Pilih Jenis Menu *"
                v-model="cekMenu"
                @input="selectJenisMenu"
                :options="isiMenuInduk"
                :placeholder="pilihMenu"
              >
              </BSelectValidations>

              <BSelectValidations
                v-if="menuIndukAktif === true"
                rules="required"
                label="Pilih Menu Induk *"
                v-model="cekMenuInduk"
                @input="selectMenuInduk"
                :options="dataMenuInduk"
                placeholder="Pilih Menu Induk"
              >
              </BSelectValidations>

              <BInputValidations
                rules="required|alpha_dash"
                type="text"
                placeholder="Isikan nama menu"
                label="Nama *"
                v-model="form.nama"
              />
              <BInputValidations
                rules="required"
                type="text"
                placeholder="Isikan keterangan"
                label="Keterangan*"
                v-model="form.keterangan"
              />

              <BInputValidations
                rules="required"
                type="text"
                placeholder="Isikan icon"
                label="Icon *"
                v-model="form.icon"
              />

              <div class="buttons" style="margin-top: 20px">
                <button
                  class="button is-success"
                  @click="handleSubmit(createMenu)"
                >
                  <span class="icon is-small">
                    <i class="fas fa-check"></i>
                  </span>
                  <span>Submit</span>
                </button>

                <button class="button" @click="resetForm">
                  <span class="icon is-small">
                    <i class="fas fa-redo"></i>
                  </span>
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </ValidationObserver>
    </b-modal>
  </section>
</template>
<script src="./menuComponent.js" />
<style>
.headerAtas {
  margin-top: 10px;
}
</style>
