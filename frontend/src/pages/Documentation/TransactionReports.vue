<template>
<div class="documentation">

<!-- markdown -->
<q-markdown >
Transaction Reports
===
</q-markdown>
<!-- /markdown -->

<div v-if="$token">
    <div class="">
        <u-q-transaction-reports></u-q-transaction-reports>
    </div>
</div>

<!-- markdown -->
<q-markdown >
This __component__ is for `Transaction Reports`

``` html
{{ code }}
```
</q-markdown>
<!-- /markdown -->

</div>
</template>

<script>
import UQTransactionReports from '../../components/UQTransactionReports'

export default
{
    data:() =>
    ({
        code: `<div class="component q-ma-lg">
    <div class="form-container">
        <u-q-transaction-reports></u-q-transaction-reports>
    </div>
</div>`
    }),

    components: 
    { 
      UQTransactionReports,
    },

    mounted()
    { },

    methods: 
    { },
}
</script>
