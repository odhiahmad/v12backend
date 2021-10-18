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
        <b-button
          :disabled="!aktifButton"
          style="margin-right: 10px"
          type="is-success"
          size="is-small"
          @click="tambahView"
          icon-left="plus"
        >
          Tambah Role
        </b-button>
        <b-button
          style="margin-right: 10px"
          :disabled="aktifButton"
          type="is-success"
          size="is-small"
          @click="confirmAktifBanyak"
          icon-left="check"
        >
          Aktifkan Role
        </b-button>
        <b-button
          :disabled="aktifButton"
          type="is-success"
          size="is-small"
          @click="confirmNonAktifBanyak"
          icon-left="check"
        >
          Non Aktifkan Role
        </b-button>
      </div>

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
      detailed
      detail-key="id"
      detail-transition="fade"
      @details-open="(row) => $buefy.toast.open(`Detail Role ${row.nama}`)"
      :show-detail-icon="true"
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
      <b-table-column field="nama" label="Nama Role" v-slot="props">
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
          Edit
        </b-button>
        <b-button
          style="margin-right: 10px"
          :v-model="props.index"
          type="is-warning is-light"
          size="is-small"
          @click="editFungsidanMenuView(props.index)"
          icon-left="pencil"
        >
          Edit Menu & Fungsi
        </b-button>
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                ornare magna eros, eu pellentesque tortor vestibulum ut.
                Maecenas non massa sem. Etiam finibus odio quis feugiat
                facilisis.
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
              Tambah Role
            </p>
            <p v-show="editMode === true" class="card-header-title">
              Edit Role {{ form.nama }}
            </p>
          </header>
          <div class="card-content">
            <div class="content">
              <BInputValidations
                rules="required|alpha_dash"
                type="text"
                placeholder="Isikan nama role"
                label="Nama *"
                v-model="form.nama"
              />
              <BInputValidations
                rules="required"
                type="text"
                placeholder="Isikan keterangan"
                label="Keterangan *"
                v-model="form.keterangan"
              />

              <BCheckboxesValidations
                v-if="editMode === false"
                rules="required"
                label="Pilih Menu *"
              >
                <div v-for="menu in dataMenuForm" :key="menu.id">
                  <p
                    style="
                      margin-bottom: -1px;
                      font-size: 12px;
                      margin-right: 40px;
                    "
                  >
                    Menu {{ menu.nama | hurufBesar }}
                  </p>
                  <b-checkbox v-model="form.id_menu" :native-value="menu.id">
                    {{ menu.nama }}
                  </b-checkbox>
                  <p
                    v-if="menu.anak.length !== 0"
                    style="margin-bottom: -1px; font-size: 12px"
                  >
                    Sub Menu {{ menu.nama | hurufBesar }}
                  </p>
                  <div v-for="menuAnak in menu.anak" :key="menuAnak.id">
                    <b-checkbox
                      v-model="form.id_menu_sub"
                      :native-value="menuAnak.id"
                    >
                      {{ menuAnak.nama }}
                    </b-checkbox>
                  </div>
                </div>
              </BCheckboxesValidations>

              <div class="buttons" style="margin-top: 20px">
                <button
                  class="button is-success"
                  @click="handleSubmit(createRole)"
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
    <b-modal v-model="isFungsiModalActive" :width="640" scroll="keep">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            Edit Menu & Fungsi {{ this.form.nama }}
          </p>
          <b-button
            style="margin-right: 10px; margin-top: 8px"
            type="is-primary"
            size="is-small"
            @click="tambahFungsiView()"
            icon-left="plus"
          >
            Tambah Fungsi
          </b-button>
        </header>
        <div class="card-content">
          <b-table :data="dataMenu">
            <b-table-column
              centered
              width="20"
              field="no"
              label="No"
              numeric
              v-slot="props"
            >
              {{ props.index + 1 }}
            </b-table-column>
            <b-table-column field="nama" label="Menu" numeric v-slot="props">
              {{ props.row.userFungsi.nama }}
            </b-table-column>
            <b-table-column
              field="fungsi"
              label="Fungsi"
              numeric
              v-slot="props"
            >
              <span
                v-for="(fungsi, index) in props.row.fungsi"
                :key="index"
                class="tag"
              >
                {{ fungsi }}
              </span>
            </b-table-column>
            <b-table-column field="nama" label="Menu" numeric v-slot="props">
              <b-button
                style="margin-right: 10px"
                :v-model="props.index"
                type="is-warning"
                size="is-small"
                @click="editFungsiView(props.index)"
                icon-left="pencil"
              >
                Edit
              </b-button>
              <b-button
                style="margin-right: 10px"
                :v-model="props.index"
                type="is-danger"
                size="is-small"
                @click="hapusFungsi(props.index)"
                icon-left="delete"
              >
                Hapus
              </b-button>
            </b-table-column>
          </b-table>
        </div>
      </div>
    </b-modal>
    <b-modal v-model="isFungsiEditModalActive" :width="640" scroll="keep">
      <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
        <div class="card">
          <header class="card-header">
            <p v-if="tambahFungsiFlag === false" class="card-header-title">
              Edit Fungsi
            </p>
            <p v-if="tambahFungsiFlag === true" class="card-header-title">
              Tambah Fungsi
            </p>
          </header>
          <div class="card-content">
            <div class="content">
              <BTagValidations
                placeholder="Pilih Fungsi"
                rules="required"
                autocomplete
                type="text"
                label="Fungsi *"
                v-model="formFungsi.fungsi"
                :data="dataFungsi"
                v-if="tambahFungsiFlag === false"
              />
              <BTagValidations
                v-if="tambahFungsiFlag === true"
                placeholder="Pilih Menu"
                rules="required"
                autocomplete
                type="text"
                label="Menu *"
                v-model="formRole.menu"
                :before-adding="beforeAdding"
                :data="getMenuVuex"
              >
              </BTagValidations>

              <div class="buttons" style="margin-top: 20px">
                <button
                  class="button is-success"
                  v-if="tambahFungsiFlag === false"
                  @click="handleSubmit(editFungsiSubmit)"
                >
                  <span class="icon is-small">
                    <i class="fas fa-check"></i>
                  </span>
                  <span>Submit</span>
                </button>
                <button
                  class="button is-success"
                  v-if="tambahFungsiFlag === true"
                  @click="handleSubmit(tambahMenuSubmit)"
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
<script src="./roleComponent.js" />
<style>
.headerAtas {
  margin-top: 10px;
}
</style>
