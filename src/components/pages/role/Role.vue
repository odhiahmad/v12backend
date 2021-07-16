<template>
  <section>
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
            <!-- <button class="card-header-icon" aria-label="more options">
              <span class="icon">
                <i class="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </button> -->
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

              <b>Pilih Menu *</b>
              <br />
              <BCheckboxesValidations rules="required" label="Role">
                <div v-for="menu in dataMenu" :key="menu.id">
                  <p style="margin-bottom: -1px">Menu</p>
                  <b-checkbox v-model="form.id_menu" :native-value="menu.id">
                    {{ menu.nama }}
                  </b-checkbox>
                  <p v-if="menu.anak.length !== 0" style="margin-bottom: -1px">
                    Sub Menu {{ menu.nama | hurufBesar }}
                  </p>
                  <div v-for="menuAnak in menu.anak" :key="menuAnak.id">
                    <b-checkbox
                      style="float: left"
                      v-model="form.id_menu_sub"
                      :native-value="menuAnak.id"
                    >
                      {{ menuAnak.nama }}
                    </b-checkbox>
                  </div>
                  <br v-if="menu.anak.length !== 0" />
                  <br v-if="menu.anak.length !== 0" />
                </div>
              </BCheckboxesValidations>
              <br />
              <b>Pilih Fungsi Modul *</b>

              <BCheckboxesValidations rules="required" label="Role">
                <div v-for="menu in dataMenu" :key="menu.id">
                  <p v-if="menu.anak.length === 0" style="margin-bottom: -1px">
                    Fungsi Modul {{ menu.nama }}
                  </p>
                  <div v-if="menu.anak.length === 0" :native-value="menu.id">
                    <b-checkbox
                      v-for="(fungsi, index) in dataFungsi"
                      :key="index"
                      v-model="form.id_fungsi"
                      :native-value="fungsi"
                    >
                      {{ fungsi }}
                    </b-checkbox>
                  </div>

                  <div v-for="menuAnak in menu.anak" :key="menuAnak.id">
                    <p style="margin-bottom: -1px">
                      Fungsi Modul {{ menuAnak.nama | hurufBesar }}
                    </p>
                    <b-checkbox
                      v-for="(fungsi, indexSub) in dataFungsi"
                      :key="indexSub"
                      v-model="form.id_fungsi"
                      :native-value="fungsi"
                    >
                      {{ fungsi }}
                    </b-checkbox>
                  </div>
                </div>
              </BCheckboxesValidations>
              {{ form.id_fungsi }}

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
  </section>
</template>
<script src="./roleComponent.js" />
<style>
.headerAtas {
  margin-top: 10px;
}
</style>
