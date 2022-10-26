<template>
<div class="documentation">

<!-- markdown -->
<q-markdown >
User Access
===

</q-markdown>
<!-- /markdown -->

<div class="component q-ma-lg">
        <u-q-user-access @success="success()"></u-q-user-access>
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
import UQUserAccess from '../../components/admin/UQUserAccess'

export default
{
    data:() =>
    ({
        code: `<div>hellworld</div><div></div>`
    }),
    components: { UQUserAccess},
    mounted()
    {
        // alert('sjdjg')
    },
    methods:
    {
    },
}
</script>