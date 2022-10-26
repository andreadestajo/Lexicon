<template>
<div class="documentation">

<!-- markdown -->
<q-markdown >
Manage Deposit
===

</q-markdown>
<!-- /markdown -->

<div v-if="$token" class="component q-ma-lg">
    <div class="form-container">
        <u-q-manage-deposit @success="success()"></u-q-manage-deposit>
    </div>
</div>

<!-- markdown -->
<q-markdown>

This __component__ is for `Manage Transactions`

``` html
{{ code }}
```

</q-markdown>
<!-- /markdown -->


</div>
</template>

<script>
import UQManageDeposit from '../../components/UQManageDeposit'

export default
{
    data:() =>
    ({
        code: `<div class="component q-ma-lg">
    <div class="form-container">
        <u-q-manage-transactions @success="success()"></u-q-manage-transactions>
    </div>
</div>`
    }),
    components: { UQManageDeposit },
    mounted()
    {
    },
    methods:
    {
    },
}
</script>