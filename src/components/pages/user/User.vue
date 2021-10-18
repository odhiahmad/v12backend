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
      <b-table-column field="nama" label="Nama" sortable v-slot="props">
        {{ props.row.nama }}
      </b-table-column>
      <b-table-column field="email" label="Username" sortable v-slot="props">
        <span class="tag">
          {{ props.row.email }}
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

      <b-table-column field="createdAt" label="Di Buat" v-slot="props" sortable>
        {{ props.row.createdAt | tanggalIndonesia }}
      </b-table-column>
      <b-table-column
        field="status"
        centered
        label="Status"
        sortable
        v-slot="props"
      >
        <span class="tag">
          {{ props.row.status | status }}
        </span>
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
                placeholder="Masukan email, usahakan uniq"
                label="Username *"
                v-model="form.email"
              />
              <BInputValidations
                v-if="editMode === true"
                type="password"
                placeholder="masukan password"
                label="Ubah Password"
                rules=""
                v-model="form.password"
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
