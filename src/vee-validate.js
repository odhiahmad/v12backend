
import { extend } from "vee-validate";
import { localize } from 'vee-validate';
import id from 'vee-validate/dist/locale/id.json';
import { messages } from 'vee-validate/dist/locale/id.json';
import * as rules from 'vee-validate/dist/rules';

Object.keys(rules).forEach(rule => {
    extend(rule, {
        ...rules[rule], // copies rule configuration
        message: messages[rule] // assign message
    });
});

// with typescript
for (let [rule, validation] of Object.entries(rules)) {
    extend(rule, {
        ...validation
    });
}
localize(
    'id',
    id
);