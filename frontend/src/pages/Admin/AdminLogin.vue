<template>
<div class="documentation">

<!-- markdown -->
<q-markdown >
Admin Login
===

</q-markdown>
<!-- /markdown -->

<div class="component q-ma-lg">
    <div class="form-container">
        <u-q-admin-login @success="success()"></u-q-admin-login>
    </div>
</div>

<!-- markdown -->
<q-markdown >

The __code above__ can be `bla blab abla`

``` html
{{ code }}
```

</q-markdown>
<!-- /markdown -->


</div>
</template>

<script>
import UQAdminLogin from '../../components/Admin/UQAdminLogin'

export default
{
    data:() =>
    ({
        code: `<div>hellworld</div><div></div>`
    }),
    components: { UQAdminLogin},
    mounted()
    {
        // alert('sjdjg')
    },
    methods:
    {
    },
}
</script>