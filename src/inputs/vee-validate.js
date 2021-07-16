import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";

// Install rules
extend("required", required);