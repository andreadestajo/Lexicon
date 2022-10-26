<template>
<div class="documentation">
<!-- **Author: VP -->
<!-- markdown -->
<q-markdown >
Add Currency
===

</q-markdown>
<!-- /markdown -->

<div v-if="$token" class="component q-ma-lg">
    <div class="form-container">
        <u-q-add-currency @success="success()"></u-q-add-currency>
    </div>
</div>

<!-- markdown -->
<q-markdown >

This __component__ is for `Add Currency`

``` html
{{ code }}
```

</q-markdown>
<!-- /markdown -->


</div>
</template>

<script>
import UQAddCurrency from '../../components/global_settings/UQAddCurrency'

export default
{
    data:() =>
    ({
        code: `<div class="component q-ma-lg">
    <div class="form-container">
        <u-q-add-currency @success="success()"></u-q-add-currency>
    </div>
</div>`,
    }),
    components: { UQAddCurrency },
    mounted()
    {
    },
    methods:
    {
    },
}
</script>