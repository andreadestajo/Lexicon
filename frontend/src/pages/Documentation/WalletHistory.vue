<template>
<div class="documentation">

<!-- markdown -->
<q-markdown >
Transaction History
===

</q-markdown>
<!-- /markdown -->

<div v-if="$token" class="component q-ma-lg">
    <div class="form-container">
        <u-q-wallet-history @success="success()"></u-q-wallet-history>
    </div>
</div>

<!-- markdown -->
<q-markdown >

This __component__ is for `Transaction History`

``` html
{{ code }}
```

</q-markdown>
<!-- /markdown -->


</div>
</template>

<script>
import UQWalletHistory from '../../components/UQWalletHistory'

export default
{
    data:() =>
    ({
        code: `<div class="component q-ma-lg">
    <div class="form-container">
        <u-q-wallet-history @success="success()"></u-q-wallet-history>
    </div>
</div>`
    }),
    components: { UQWalletHistory },
    mounted()
    {
    },
    methods:
    {
    },
}
</script>