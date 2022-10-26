<template>
<div class="documentation">

<!-- markdown -->
<q-markdown >
Permissions
===

</q-markdown>
<!-- /markdown -->

<div class="component q-ma-lg">

        <u-q-permissions @success="success()"></u-q-permissions>

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
import UQPermissions from '../../components/Admin/UQPermissions'

export default
{
    data:() =>
    ({
        code: `<div>hellworld</div><div></div>`
    }),
    components: { UQPermissions},
    mounted()
    {
        // alert('sjdjg')
    },
    methods:
    {
    },
}
</script>