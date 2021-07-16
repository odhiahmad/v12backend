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
          Tambah User
        </b-button>
        <b-button
          style="margin-right: 10px"
          :disabled="aktifButton"
          type="is-success"
          size="is-small"
          @click="confirmAktifBanyak"
          icon-left="check"
        >
          Aktifkan User
        </b-button>
        <b-button
          :disabled="aktifButton"
          type="is-success"
          size="is-small"
          @click="confirmNonAktifBanyak"
          icon-left="check"
        >
          Non Aktifkan User
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
      @details-open="(row) => $buefy.toast.open(`Detail User ${row.username}`)"
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
      <b-table-column field="name" label="Nama" v-slot="props">
        {{ props.row.pegawai.nama }}
      </b-table-column>
      <b-table-column field="username" label="Username" sortable v-slot="props">
        <span class="tag">
          {{ props.row.username }}
        </span>
      </b-table-column>
      <b-table-column
        field="role"
        centered
        label="Role"
        sortable
        v-slot="props"
      >
        <span class="tag" :class="type(props.row.role)">
          {{ props.row.roleUser.keterangan }}
        </span>
      </b-table-column>
      <b-table-column
        field="gaji"
        centered
        label="Gaji"
        sortable
        v-slot="props"
      >
        <span class="tag">
          {{ props.row.pegawai.gaji }}
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
          v-if="props.row.aktif === 1"
          :v-model="props.index"
          type="is-danger"
          size="is-small"
          @click="confirmNonAktif(props.row.id, props.index)"
          icon-left="close"
        >
          Non Aktif
        </b-button>
        <b-button
          v-if="props.row.aktif === 0"
          :v-model="props.index"
          type="is-danger is-light"
          size="is-small"
          @click="confirmAktif(props.row.id, props.index)"
          icon-left="check"
        >
          Aktif
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
                <strong>{{ props.row.pegawai.nama }} </strong>
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
              Tambah User
            </p>
            <p v-show="editMode === true" class="card-header-title">
              Edit User {{ form.nama }}
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
                rules="required"
                type="text"
                placeholder="Isikan nama anda"
                label="Nama *"
                v-model="form.nama"
              />
              <BInputValidations
                rules="required|alpha"
                type="text"
                placeholder="Masukan username, usahakan uniq"
                label="Username *"
                v-model="form.username"
              />
              <BInputValidations
                v-if="editMode === true"
                type="password"
                placeholder="masukan password"
                label="Ubah Password"
                rules=""
                v-model="form.passwordEdit"
                password-reveal
              />
              <BInputValidations
                v-if="editMode === false"
                rules="required"
                type="password"
                placeholder="masukan password"
                label="Password *"
                vid="password"
                v-model="form.password"
                password-reveal
              />
              <BInputValidations
                v-if="editMode === false"
                rules="required|confirmed:password"
                name="Password"
                placeholder="masukan password yang sama"
                type="password"
                label="Confirm Password *"
                password-reveal
                v-model="form.confirmation"
              />
              <BSelectValidations
                rules="required"
                label="Role *"
                @input="selectRole"
                v-model="selectedRole"
                :options="roleVuex"
              >
              </BSelectValidations>
              <BInputValidations
                rules="required|numeric|min:6"
                type="text"
                placeholder="Masukan gaji"
                label="Gaji *"
                v-model="form.gaji"
              />
              <div class="buttons" style="margin-top: 20px">
                <button
                  class="button is-success"
                  @click="handleSubmit(createUser)"
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
<script src="./userComponent.js" />
<style>
.headerAtas {
  margin-top: 10px;
}
</style>
