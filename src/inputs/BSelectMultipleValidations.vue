<template>
  <ValidationProvider
    :vid="vid"
    :name="$attrs.label"
    :rules="rules"
    v-slot="{ errors, valid }"
  >
    <b-field
      style="margin-bottom: 15px"
      custom-class="is-small"
      v-bind="$attrs"
      :type="{ 'is-danger': errors[0], 'is-success': valid }"
      :message="errors"
    >
      <v-select multiple :options="options" v-model="innerValue"> </v-select>
    </b-field>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from "vee-validate";

export default {
  components: {
    ValidationProvider,
  },
  props: {
    placeholder: {
      type: String,
    },
    vid: {
      type: String,
    },
    options: {
      type: [Array],
    },
    rules: {
      type: [Object, String],
      default: "",
    },
    // must be included in props
    value: {
      type: null,
    },
  },
  data: () => ({
    innerValue: "",
  }),
  watch: {
    // Handles internal model changes.
    innerValue(newVal) {
      this.$emit("input", newVal);
    },
    // Handles external model changes.
    value(newVal) {
      this.innerValue = newVal;
    },
  },
  created() {
    if (this.value) {
      this.innerValue = this.value;
    }
  },
};
</script>
