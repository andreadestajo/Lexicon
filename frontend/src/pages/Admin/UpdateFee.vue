<template>
<div class="documentation">
<!-- **Author: VP -->
<!-- markdown -->
<q-markdown >
Fee
===

</q-markdown>
<!-- /markdown -->

<div v-if="$token" class="component q-ma-lg">
    <div class="form-container">
        <u-q-fee @success="success()"></u-q-fee>
    </div>
</div>

<!-- markdown -->
<q-markdown >

This __component__ is for `Fee`

``` html
{{ code }}
```

</q-markdown>
<!-- /markdown -->


</div>
</template>

<script>
import UQFee from '../../components/global_settings/UQFee'

export default
{
    data:() =>
    ({
        code: `<div class="component q-ma-lg">
    <div class="form-container">
        <u-q-fee @success="success()"></u-q-fee>
    </div>
</div>`
    }),
    components: { UQFee },
    mounted()
    {
    },
    methods:
    {
    },
}
</script>